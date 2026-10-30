// รายชื่อผู้ใช้งานและสิทธิ์ (B-16) — เก็บใน store เพื่อให้สิทธิ์ที่แก้ในหน้าผู้ใช้งานมีผลกับเมนูของ session ทันที
// ชั่วคราวจนกว่าจะมี API: ระบบจริงโหลดจาก /users และบันทึกผ่าน API โดย backend ตรวจสิทธิ์ผู้แก้ไข (TOR 4.1.10, 4.4.7)
// สถานะบัญชี (G-11 · Flow 4.1): ใช้งาน / รอยืนยันอีเมล / ระงับ (กรอกรหัสผ่านผิดครบ 5 ครั้ง) / ปิดใช้งาน
// สถานะ "ระงับ" อ่านจาก authAccounts ใน mocks/auth.js ตัวเดียวกับที่ B-01 นับรหัสผิด — ระงับที่ B-01 แล้วเห็นใน B-16 ทันที
import { defineStore } from "pinia";
import { userHistory, users as seedUsers } from "@/mocks/users-roles.js";
import { authAccounts, authMock } from "@/mocks/auth.js";
import { usersApi } from "@/api/users.js";
import { usersText } from "@/content/users-roles.js";
import { nowThaiIso } from "@/utils/format.js";

// คัดลอกลึก (structuredClone ใช้กับ reactive proxy ไม่ได้)
const deep = (o) => JSON.parse(JSON.stringify(o));
const t = usersText.log;

export const useUsersStore = defineStore("users", {
  state: () => ({
    list: seedUsers.map((u) => ({ ...u, permissions: deep(u.permissions) })),
    history: userHistory.map((h) => ({ ...h })),
  }),
  getters: {
    byUsername: (state) => (username) => state.list.find((u) => u.username === username),
    // ข้อมูลการระงับ { failures, lockedAt } — null = ไม่ถูกระงับ
    // ชั่วคราวจนกว่าจะมี API: ระบบจริงได้ status / lockedAt มากับรายการผู้ใช้จาก GET /users
    lockOf: () => (username) => {
      const failures = authAccounts.failures[username] ?? 0;
      return failures >= authMock.maxAttempts ? { failures, lockedAt: authAccounts.lockedAt[username] ?? null } : null;
    },
    // key ใน usersText.status — ปิดใช้งานมาก่อน (ผู้ดูแลปิดเอง) แล้วจึงระงับ / รอยืนยันอีเมล
    statusOf() {
      return (u) => {
        if (!u.active) return "disabled";
        if (this.lockOf(u.username)) return "locked";
        if (!u.emailVerified) return "pendingVerification";
        return "active";
      };
    },
  },
  actions: {
    // ประวัติการจัดการผู้ใช้ (TOR 4.1.12) — ใหม่ → เก่า · actor = ชื่อผู้ดำเนินการ ("ระบบ" เมื่อระบบระงับเอง)
    addHistory(actor, action, target, detail) {
      this.history.unshift({ id: Date.now() + Math.random(), at: nowThaiIso(), actor, action, target, detail });
    },
    // ปลดล็อกบัญชีที่ถูกระงับ (Flow 4 "ผิดเกิน 5 ครั้ง → ติดต่อผู้ดูแลระบบ") — throw เมื่อ API ไม่สำเร็จ ให้หน้าจอแสดง error + ลองใหม่
    async unlock(user, actor) {
      await usersApi.unlock(user.username);
      this.addHistory(actor, t.unlock, user.name, t.unlockDetail);
    },
    // ส่งลิงก์ยืนยันอีเมลใหม่ให้บัญชีที่รอยืนยัน (Flow 4.1 ขั้น 2 — ลิงก์ใช้ครั้งเดียว อายุ 24 ชม. ลิงก์เดิมถูกยกเลิก)
    async resendVerification(user, actor) {
      const res = await usersApi.resendVerification(user.username, user.email);
      const target = this.byUsername(user.username);
      if (target) target.verificationSentAt = res.sentAt;
      this.addHistory(actor, t.resend, user.name, t.resendDetail(res.email));
      return res;
    },
  },
});
