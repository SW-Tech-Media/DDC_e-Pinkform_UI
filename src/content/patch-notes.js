// Patch Notes — เพิ่มเวอร์ชันใหม่ไว้บนสุดของ patchNotes เสมอ (เวอร์ชันแรกในรายการคือเวอร์ชันปัจจุบัน)
// type: added | changed | fixed | removed

export const changeTypes = {
  added: { label: "เพิ่ม", tone: "success" },
  changed: { label: "ปรับปรุง", tone: "info" },
  fixed: { label: "แก้ไข", tone: "warning" },
  removed: { label: "นำออก", tone: "danger" },
};

export const patchNotesText = {
  button: "Patch Notes",
  title: "Patch Notes",
  subtitle: "รายละเอียดการเปลี่ยนแปลงของ Prototype แต่ละเวอร์ชัน",
  latest: "ล่าสุด",
  close: "ปิด",
};

export const patchNotes = [
  {
    version: "0.1.0",
    date: "2026-10-28",
    title: "เริ่มต้น Prototype",
    changes: [
      { type: "added", text: "หน้าแรก Prototype พร้อมการ์ดเลือก “เข้า Prototype ระบบ” และ “คู่มือ Design System”" },
      { type: "added", text: "ปุ่ม Patch Notes แสดงรายละเอียดการเปลี่ยนแปลงแต่ละเวอร์ชัน" },
      {
        type: "added",
        text: "Design Token จาก Figma: สี, ฟอนต์ Noto Sans Thai, Type Scale, Spacing, Radius, Elevation",
      },
      { type: "added", text: "โครงโปรเจกต์ Vue 3 + Vuetify 3 + Vite ตาม flamework.md" },
      { type: "added", text: "MCP server สำหรับให้ AI อ่านเอกสารระบบ (npm run mcp:dev)" },
    ],
  },
];
