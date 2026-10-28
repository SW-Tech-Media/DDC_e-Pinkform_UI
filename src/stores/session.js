// สถานะการเข้าสู่ระบบของ Prototype (จำลอง ไม่มี backend)
import { defineStore } from "pinia";
import { staff } from "@/mocks/users.js";

export const useSessionStore = defineStore("session", {
  state: () => ({
    // ผู้ใช้ที่แสดงบน Topbar — หน้าจอแต่ละหน้าเปลี่ยนได้ตาม Figma (เช่น หน้าการเงินใช้ประภาพร)
    user: staff.somrudee,
    pendingUsername: "",
    pinAttemptsLeft: 5,
  }),
  actions: {
    startLogin(username) {
      this.pendingUsername = username;
      this.pinAttemptsLeft = 5;
    },
    signInAs(key) {
      this.user = staff[key] ?? staff.somrudee;
    },
  },
});
