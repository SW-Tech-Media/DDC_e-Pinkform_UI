// รายชื่อผู้ใช้งานและสิทธิ์ (B-16) — เก็บใน store เพื่อให้สิทธิ์ที่แก้ในหน้าผู้ใช้งานมีผลกับเมนูของ session ทันที
// ชั่วคราวจนกว่าจะมี API: ระบบจริงโหลดจาก /users และบันทึกผ่าน API โดย backend ตรวจสิทธิ์ผู้แก้ไข (TOR 4.1.10, 4.4.7)
import { defineStore } from "pinia";
import { userHistory, users as seedUsers } from "@/mocks/users-roles.js";

// คัดลอกลึก (structuredClone ใช้กับ reactive proxy ไม่ได้)
const deep = (o) => JSON.parse(JSON.stringify(o));

export const useUsersStore = defineStore("users", {
  state: () => ({
    list: seedUsers.map((u) => ({ ...u, permissions: deep(u.permissions) })),
    history: userHistory.map((h) => ({ ...h })),
  }),
  getters: {
    byUsername: (state) => (username) => state.list.find((u) => u.username === username),
  },
});
