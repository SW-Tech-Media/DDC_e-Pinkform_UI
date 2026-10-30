// ชั้น API ผู้ใช้งาน (B-16 · G-11 วงจรบัญชีผู้ใช้ — Flow 4, 4.1 · TOR 4.1.10, 4.1.12)
// หน้าจอ / store เรียกผ่านไฟล์นี้เท่านั้น — VITE_API_MODE=mock (ค่าเริ่มต้น) จำลองใน browser · http = เรียก backend จริง
// รูป response / error code เป็นข้อเสนอ รอ docs/api/openapi.yaml (backend-developer) แล้วปรับให้ตรง
//
// error ทุกกรณี throw UsersApiError { status, code } — NETWORK (0) · NOT_LOCKED (409) · ALREADY_VERIFIED (409) · FORBIDDEN (403)
import { authAccounts, authMock } from "@/mocks/auth.js";
import { usersText } from "@/content/users-roles.js";
import { useAuditStore } from "@/stores/audit.js";
import { useUsersStore } from "@/stores/users.js";
import { nowThaiIso } from "@/utils/format.js";

export class UsersApiError extends Error {
  constructor(status, code) {
    super(code);
    Object.assign(this, { status, code });
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
    throw new UsersApiError(0, "NETWORK");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new UsersApiError(res.status, json.code ?? "UNKNOWN");
  return json;
};

// ---------- โหมด mock ----------
// ชั่วคราวจนกว่าจะมี API: backend ตรวจสิทธิ์ users.edit, ล้างตัวนับรหัสผิด, ส่งอีเมล และบันทึก Audit Log เอง (TOR 4.1.15)
// ผู้ใช้ "offline.demo" ไม่มีในรายชื่อ — ใช้ authMock.offlineUsername จำลองระบบขัดข้องเหมือนหน้า B-01
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const a = usersText.audit;
const target = (username) => {
  const u = useUsersStore().byUsername(username);
  return a.account(u?.name ?? username, username);
};

const mock = {
  async unlock(username) {
    await delay();
    if (username === authMock.offlineUsername) throw new UsersApiError(0, "NETWORK");
    const failures = authAccounts.failures[username] ?? 0;
    if (failures < authMock.maxAttempts) throw new UsersApiError(409, "NOT_LOCKED");
    delete authAccounts.failures[username];
    delete authAccounts.lockedAt[username];
    useAuditStore().record("users", "unlock", target(username), [
      { field: a.status, before: usersText.status.locked.label, after: usersText.status.active.label },
      { field: a.attempts, before: a.attemptsValue(failures, authMock.maxAttempts), after: a.attemptsValue(0, authMock.maxAttempts) },
    ]);
    return { username, status: "active" };
  },

  // ส่งลิงก์ใหม่ไปที่อีเมลของบัญชี (ระบบจริงอ่านอีเมลจากฐานข้อมูล ไม่รับจากหน้าจอ — mock รับมาเพื่อแสดงผลเท่านั้น)
  async resendVerification(username, email) {
    await delay();
    if (username === authMock.offlineUsername) throw new UsersApiError(0, "NETWORK");
    const sentAt = nowThaiIso();
    useAuditStore().record("users", "resendVerification", target(username), [{ field: a.email, before: null, after: email }]);
    return { username, email, sentAt, expiresInHours: authMock.verifyAccount.linkHours };
  },
};

const httpApi = {
  unlock: (username) => http("POST", `/users/${encodeURIComponent(username)}/unlock`),
  resendVerification: (username) => http("POST", `/users/${encodeURIComponent(username)}/email-verification`),
};

export const usersApi = HTTP ? httpApi : mock;
