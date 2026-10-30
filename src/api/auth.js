// ชั้น API การยืนยันตัวตน (B-01, B-01.3, B-01.5 — Flow 4, 4.1 · TOR 4.1.11, 6.7 MFA)
// หน้าจอเรียกผ่านไฟล์นี้เท่านั้น — VITE_API_MODE=mock (ค่าเริ่มต้น) จำลองใน browser · http = เรียก backend จริง
// รูป response / error code เป็นข้อเสนอ รอ docs/api/openapi.yaml (backend-developer) แล้วปรับให้ตรง
// ความปลอดภัย: session ใช้ httpOnly cookie จาก backend (credentials: "include") — ไม่เก็บ token ใน localStorage
//
// error ทุกกรณี throw AuthApiError { status, code, data }
//   INVALID_CREDENTIALS (401, data.attemptsLeft) · ACCOUNT_SUSPENDED (423) · NETWORK (0)
//   LINK_EXPIRED (410) · LINK_USED (409) · LINK_INVALID (404) · PASSWORD_REUSED (422) · PASSWORD_POLICY (422)
import { authAccounts, authMock } from "@/mocks/auth.js";
import { usersText } from "@/content/users-roles.js";
import { useAuditStore } from "@/stores/audit.js";
import { useUsersStore } from "@/stores/users.js";
import { nowThaiIso } from "@/utils/format.js";

export class AuthApiError extends Error {
  constructor(status, code, data = {}) {
    super(code);
    Object.assign(this, { status, code, data });
  }
}

const HTTP = import.meta.env.VITE_API_MODE === "http";
const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

// ---------- โหมด http (endpoint ที่เสนอ) ----------
const http = async (method, path, body) => {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AuthApiError(0, "NETWORK");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthApiError(res.status, json.code ?? "UNKNOWN", json);
  return json;
};

// ---------- โหมด mock (จำลองสถานะฝั่ง server ไว้ในหน่วยความจำ รีเฟรชหน้า = เริ่มใหม่) ----------
// ชั่วคราวจนกว่าจะมี API: การนับครั้งที่ผิด / การระงับบัญชี / นโยบายรหัสผ่าน backend เป็นเจ้าของ (สมมติฐานรอ Q-20)
// ตัวนับรหัสผิด / การระงับอยู่ใน authAccounts (mocks/auth.js) ใช้ร่วมกับ B-16 — ปลดล็อกที่ B-16 แล้วเข้าสู่ระบบได้อีก
// Audit Log (B-19) และประวัติการจัดการผู้ใช้ (B-16) ของเหตุการณ์บัญชี: ระบบจริง backend บันทึกเอง — mock บันทึกแทนที่นี่
const passwords = new Map(); // username → รหัสผ่านที่ตั้งใหม่ (B-01.5)
const a = usersText.audit;
// ผู้กระทำของ Log = บัญชีที่กรอก (ยังไม่ได้เข้าสู่ระบบ) — บัญชีที่ไม่มีในรายชื่อใช้ชื่อผู้ใช้ที่กรอก
const actorOf = (u) => ({ name: useUsersStore().byUsername(u)?.name ?? u, username: u });
const audit = (u, action, changes) => useAuditStore().record("login", action, a.account(actorOf(u).name, u), changes, actorOf(u));
const failuresOf = (u) => authAccounts.failures[u] ?? 0;
const clearFailures = (u) => {
  delete authAccounts.failures[u];
  delete authAccounts.lockedAt[u];
};
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const key = (username) => username.trim().toLowerCase();

const linkCheck = (token) => {
  const { expired, used, invalid, error } = authMock.linkTokens;
  if (token === error) throw new AuthApiError(0, "NETWORK");
  if (token === expired) throw new AuthApiError(410, "LINK_EXPIRED");
  if (token === used) throw new AuthApiError(409, "LINK_USED");
  if (token === invalid) throw new AuthApiError(404, "LINK_INVALID");
};

const mock = {
  // นับครั้งที่ผิดตามชื่อผู้ใช้ที่กรอก แม้ไม่มีบัญชีนี้ — ตอบเหมือนกันทุกกรณีเพื่อไม่ให้เดาได้ว่าบัญชีมีอยู่หรือไม่
  async login({ username, password }) {
    await delay();
    const u = key(username);
    if (u === authMock.offlineUsername) throw new AuthApiError(0, "NETWORK");
    const max = authMock.maxAttempts;
    const count = failuresOf(u);
    if (count >= max) {
      audit(u, "loginFailed", [{ field: a.reason, before: null, after: a.lockedAttempt }]);
      throw new AuthApiError(423, "ACCOUNT_SUSPENDED");
    }
    if (password !== (passwords.get(u) ?? authMock.password)) {
      authAccounts.failures[u] = count + 1;
      audit(u, "loginFailed", [
        { field: a.reason, before: null, after: a.invalidPassword },
        { field: a.attempts, before: a.attemptsValue(count, max), after: a.attemptsValue(count + 1, max) },
      ]);
      const attemptsLeft = max - count - 1;
      if (attemptsLeft <= 0) {
        // ครบ 5 ครั้ง = ระงับบัญชี — แสดงสถานะ "ระงับ" ที่ B-16 พร้อมปุ่มปลดล็อก
        authAccounts.lockedAt[u] = nowThaiIso();
        audit(u, "accountLocked", [
          { field: a.status, before: usersText.status.active.label, after: usersText.status.locked.label },
          { field: a.reason, before: null, after: a.lockedReason(max) },
        ]);
        const user = useUsersStore().byUsername(u);
        if (user) useUsersStore().addHistory(usersText.log.system, usersText.log.locked, user.name, usersText.log.lockedDetail(max));
        throw new AuthApiError(423, "ACCOUNT_SUSPENDED");
      }
      throw new AuthApiError(401, "INVALID_CREDENTIALS", { attemptsLeft });
    }
    clearFailures(u);
    // ระบบจริงคืน challenge สำหรับขั้น PIN (ยังไม่ออก session จนกว่า PIN ถูกต้อง)
    return { username: u, next: "pin" };
  },

  // ลิงก์ยืนยันอีเมลของบัญชีใหม่ (Flow 4.1 ขั้น 3)
  async verifyEmailLink(token) {
    await delay();
    linkCheck(token);
    const { username, email } = authMock.verifyAccount;
    return { username, email };
  },

  // ลิงก์หมดอายุ / ใช้แล้ว → ส่งลิงก์ใหม่ไปอีเมลหน่วยงานของบัญชีนั้น (Flow 4.1 "ไม่ใช่: ส่งลิงก์ใหม่") ลิงก์เดิมถูกยกเลิก
  async resendVerification(token) {
    await delay();
    if (token === authMock.linkTokens.error) throw new AuthApiError(0, "NETWORK");
    return { email: authMock.verifyAccount.email, expiresInHours: authMock.verifyAccount.linkHours };
  },

  // บันทึกรหัสผ่าน + PIN พร้อมกันครั้งเดียวเมื่อจบขั้นตอน (Flow 4.1 ขั้น 4 – 6) — ไม่มีบัญชีที่ตั้งได้ครึ่งเดียว
  // backend: Hash รหัสผ่านและ PIN แยกกัน · ลิงก์ใช้แล้ว · สถานะบัญชี "ใช้งาน" · บันทึก Audit Log
  async activateAccount({ token, password }) {
    await delay();
    linkCheck(token);
    const u = authMock.verifyAccount.username;
    passwords.set(u, password);
    audit(u, "setPassword", [
      { field: a.password, before: null, after: a.passwordChanged },
      { field: a.via, before: null, after: a.viaActivate },
    ]);
    return { username: authMock.verifyAccount.username, status: "active" };
  },

  // ขอลิงก์ตั้งรหัสผ่านใหม่ — ตอบสำเร็จเสมอ (ไม่บอกว่าบัญชีมีอยู่หรือไม่) ยกเว้นบัญชีถูกระงับ
  async requestPasswordReset(account) {
    await delay();
    const u = key(account).split("@")[0];
    if (u === authMock.offlineUsername) throw new AuthApiError(0, "NETWORK");
    if (failuresOf(u) >= authMock.maxAttempts) throw new AuthApiError(423, "ACCOUNT_SUSPENDED");
    return { expiresInMinutes: authMock.resetLinkMinutes };
  },

  // ตั้งรหัสผ่านใหม่จากลิงก์ — PIN เดิมยังใช้ต่อ · mock ไม่มี token จริงจึงใช้ account ที่กรอกในขั้นแรก (เข้าสู่ระบบยังต้องผ่าน 2FA ครบ 2 ชั้น)
  async resetPassword({ account, password }) {
    await delay();
    if (authMock.recentPasswords.includes(password)) throw new AuthApiError(422, "PASSWORD_REUSED");
    const u = key(account).split("@")[0];
    passwords.set(u, password);
    clearFailures(u);
    audit(u, "resetPassword", [
      { field: a.password, before: null, after: a.passwordChanged },
      { field: a.via, before: null, after: a.viaReset },
    ]);
    return { username: u };
  },
};

const httpApi = {
  login: (body) => http("POST", "/auth/login", body),
  verifyEmailLink: (token) => http("GET", `/auth/email-verification/${encodeURIComponent(token)}`),
  resendVerification: (token) => http("POST", "/auth/email-verification/resend", { token }),
  activateAccount: (body) => http("POST", "/auth/activate", body),
  requestPasswordReset: (account) => http("POST", "/auth/password-reset", { account }),
  // ระบบจริงระบุบัญชีจาก token ในลิงก์ (ไม่ส่งชื่อผู้ใช้)
  resetPassword: ({ token, password }) => http("POST", "/auth/password-reset/confirm", { token, password }),
};

export const authApi = HTTP ? httpApi : mock;
