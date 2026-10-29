// ชั้น API การยืนยันตัวตน (B-01, B-01.3, B-01.5 — Flow 4, 4.1 · TOR 4.1.11, 6.7 MFA)
// หน้าจอเรียกผ่านไฟล์นี้เท่านั้น — VITE_API_MODE=mock (ค่าเริ่มต้น) จำลองใน browser · http = เรียก backend จริง
// รูป response / error code เป็นข้อเสนอ รอ docs/api/openapi.yaml (backend-developer) แล้วปรับให้ตรง
// ความปลอดภัย: session ใช้ httpOnly cookie จาก backend (credentials: "include") — ไม่เก็บ token ใน localStorage
//
// error ทุกกรณี throw AuthApiError { status, code, data }
//   INVALID_CREDENTIALS (401, data.attemptsLeft) · ACCOUNT_SUSPENDED (423) · NETWORK (0)
//   LINK_EXPIRED (410) · LINK_USED (409) · LINK_INVALID (404) · PASSWORD_REUSED (422) · PASSWORD_POLICY (422)
import { authMock } from "@/mocks/auth.js";

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
const failures = new Map(); // username → จำนวนครั้งที่ผิดติดต่อกัน
const passwords = new Map(); // username → รหัสผ่านที่ตั้งใหม่ (B-01.5)
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
    const count = failures.get(u) ?? 0;
    if (count >= authMock.maxAttempts) throw new AuthApiError(423, "ACCOUNT_SUSPENDED");
    if (password !== (passwords.get(u) ?? authMock.password)) {
      failures.set(u, count + 1);
      const attemptsLeft = authMock.maxAttempts - count - 1;
      if (attemptsLeft <= 0) throw new AuthApiError(423, "ACCOUNT_SUSPENDED");
      throw new AuthApiError(401, "INVALID_CREDENTIALS", { attemptsLeft });
    }
    failures.delete(u);
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
    passwords.set(authMock.verifyAccount.username, password);
    return { username: authMock.verifyAccount.username, status: "active" };
  },

  // ขอลิงก์ตั้งรหัสผ่านใหม่ — ตอบสำเร็จเสมอ (ไม่บอกว่าบัญชีมีอยู่หรือไม่) ยกเว้นบัญชีถูกระงับ
  async requestPasswordReset(account) {
    await delay();
    const u = key(account).split("@")[0];
    if (u === authMock.offlineUsername) throw new AuthApiError(0, "NETWORK");
    if ((failures.get(u) ?? 0) >= authMock.maxAttempts) throw new AuthApiError(423, "ACCOUNT_SUSPENDED");
    return { expiresInMinutes: authMock.resetLinkMinutes };
  },

  // ตั้งรหัสผ่านใหม่จากลิงก์ — PIN เดิมยังใช้ต่อ · mock ไม่มี token จริงจึงใช้ account ที่กรอกในขั้นแรก (เข้าสู่ระบบยังต้องผ่าน 2FA ครบ 2 ชั้น)
  async resetPassword({ account, password }) {
    await delay();
    if (authMock.recentPasswords.includes(password)) throw new AuthApiError(422, "PASSWORD_REUSED");
    const u = key(account).split("@")[0];
    passwords.set(u, password);
    failures.delete(u);
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
