// ประวัติการใช้งาน (Audit Log, B-19) — รวมข้อมูลจำลองกับการกระทำที่บันทึกในรอบนี้ (อนุมัติ / ไม่อนุมัติ / ยกเลิกการอนุมัติ / แก้ไขคำขอ)
// ชั่วคราวจนกว่าจะมี API (TOR 4.1.15): backend เป็นผู้บันทึก Log ทุกการกระทำ พร้อม IP / ชื่อเครื่องจริง และห้ามแก้ไข/ลบ
// หน้าจอไม่ต้องเรียก record() เมื่อต่อ API แล้ว — B-19 อ่านจาก GET /audit-logs
import { defineStore } from "pinia";
import { auditDevices, auditLogs } from "@/mocks/audit-log.js";
import { staff } from "@/mocks/users.js";
import { useSessionStore } from "@/stores/session.js";
import { nowThaiIso } from "@/utils/format.js";

const staffKeyByUsername = Object.fromEntries(Object.entries(staff).map(([k, s]) => [s.username, k]));
const unknownDevice = { ip: "–", device: "–", host: "–" };

export const useAuditStore = defineStore("audit", {
  state: () => ({ entries: [] }), // ใหม่ → เก่า
  getters: {
    all: (state) => [...state.entries, ...auditLogs],
  },
  actions: {
    // menu = key ใน auditText.menus · action = key ใน auditText.actions · changes: [{ field, before, after }]
    // user = key ใน staff — บัญชีที่ไม่อยู่ใน staff เก็บชื่อไว้ใน actor
    record(menu, action, target, changes = []) {
      const u = useSessionStore().user;
      const key = staffKeyByUsername[u.username];
      this.entries.unshift({
        id: `AL${String(auditLogs.length + this.entries.length + 1).padStart(5, "0")}`,
        at: nowThaiIso(),
        user: key ?? u.username,
        ...(key ? {} : { actor: { name: u.name, username: u.username } }),
        ...(auditDevices[key] ?? unknownDevice),
        menu,
        action,
        target,
        changes,
      });
    },
  },
});
