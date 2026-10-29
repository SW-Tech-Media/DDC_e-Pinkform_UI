// สถานะการเข้าสู่ระบบของ Prototype (จำลอง ไม่มี backend)
// มี 2 ส่วน:
// - persona = ผู้ใช้ที่แสดงบน Topbar ตาม Figma แต่ละหน้า (หน้าจอเรียก signInAs) ใช้เมื่อยังไม่ได้เลือกบัญชี
// - account = บัญชีที่ใช้ตรวจสิทธิ์เมนู (TOR 4.1.10, 4.4.7) — ได้จากการเข้าสู่ระบบด้วย PIN หรือเมนูสาธิตบทบาทบน Topbar
//   ยังไม่เลือก = Super Admin เพื่อให้เปิดทุกหน้าจอจากหน้ารวมหน้าจอได้ (โหมดตาม Figma)
// ชั่วคราวจนกว่าจะมี API: ระบบจริงรับสิทธิ์จาก backend หลังเข้าสู่ระบบ (ไม่เก็บ token / ข้อมูลส่วนบุคคลใน localStorage)
import { defineStore } from "pinia";
import { staff } from "@/mocks/users.js";
import { roles } from "@/mocks/users-roles.js";
import { useUsersStore } from "@/stores/users.js";

const FIGMA_ACCOUNT = "superadmin";
const ACTIONS = ["view", "create", "edit", "delete", "approve"];
const staffByUsername = Object.fromEntries(Object.values(staff).map((s) => [s.username, s]));

export const useSessionStore = defineStore("session", {
  state: () => ({
    persona: staff.somrudee,
    accountUsername: FIGMA_ACCOUNT,
    // true = เลือกบัญชีแล้ว (เข้าสู่ระบบ / สลับบทบาท) — Topbar แสดงบัญชีนี้แทน persona ตาม Figma
    pinned: false,
    pendingUsername: "",
    pinAttemptsLeft: 5,
  }),
  getters: {
    account: (state) => useUsersStore().byUsername(state.accountUsername),
    // ผู้ใช้ที่แสดงบน Topbar และใช้เป็นชื่อผู้ดำเนินการในหน้าต่าง ๆ
    user() {
      if (!this.pinned || !this.account) return this.persona;
      const a = this.account;
      return staffByUsername[a.username] ?? { name: a.name, username: a.username, initials: a.name.slice(0, 2), role: roles[a.role].label };
    },
    // can("payments") = ดูเมนูได้ · can("users", "edit") = แก้ไขในเมนูได้ — ใช้ซ่อนเมนู/ปุ่ม backend เป็นผู้ตรวจจริง
    can() {
      return (menu, action = "view") => {
        const row = this.account?.active ? this.account.permissions[menu] : null;
        return !!row?.[ACTIONS.indexOf(action)];
      };
    },
  },
  actions: {
    startLogin(username) {
      this.pendingUsername = username;
      this.pinAttemptsLeft = 5;
    },
    // หน้าจอเลือก persona ให้ตรงกับ Figma (เช่น หน้าการเงินใช้ประภาพร) — ไม่มีผลเมื่อเลือกบัญชีแล้ว
    signInAs(key) {
      if (this.pinned) return;
      this.persona = staff[key] ?? staff.somrudee;
    },
    // เข้าสู่ระบบสำเร็จ / สลับบทบาทสาธิต — สิทธิ์เมนูตามบัญชีนี้ (บัญชีที่ไม่มีในรายชื่อ = ไม่เปลี่ยน)
    useAccount(username) {
      if (!useUsersStore().byUsername(username)) return false;
      Object.assign(this, { accountUsername: username, pinned: true });
      return true;
    },
    // กลับโหมดตาม Figma
    resetAccount() {
      Object.assign(this, { accountUsername: FIGMA_ACCOUNT, pinned: false });
    },
  },
});
