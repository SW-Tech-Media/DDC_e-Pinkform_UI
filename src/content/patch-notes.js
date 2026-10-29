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
    version: "0.3.0",
    date: "2026-10-29",
    title: "หน้าจอครบตาม Flow และ TOR",
    changes: [
      { type: "added", text: "Portal: ข่าวประชาสัมพันธ์ + รายละเอียดข่าว (P-04), กฎหมายและคู่มือ (P-05), แบบสอบถามความพึงพอใจ (P-06), นโยบายคุกกี้ / ความเป็นส่วนตัว (P-07)" },
      { type: "added", text: "ลืม PIN / ตั้ง PIN ใหม่ผ่านลิงก์อีเมล (B-01.4) เชื่อมจากหน้า PIN และบัญชีถูกล็อก" },
      { type: "added", text: "พิจารณาอนุมัติ THNSW (B-04), ข้อมูลใบรับรองฯ (B-10), ใบเสร็จรับเงิน (B-12), รายงานสรุป ส่งออก CSV (B-13)" },
      { type: "added", text: "ข้อมูลหลัก 14 ชุด (B-15), Audit Log พร้อมข้อมูลก่อน–หลังแก้ไข (B-19), รายงานผู้เข้าชมเว็บไซต์ (B-20)" },
      { type: "added", text: "หน้าที่เสนอเพิ่มตาม TOR: จัดการเนื้อหาเว็บไซต์ (B-21), จัดการแบบสอบถามและผล (B-22), ตั้งค่า CPA (B-23), ติดตาม API (B-24), ส่งข้อมูลระบบงานภายใน DDC (B-25)" },
      { type: "added", text: "เมนู Sidebar ใหม่: รายงานผู้เข้าชม, กลุ่มเว็บไซต์ประชาสัมพันธ์, ตั้งค่า CPA, ติดตาม API, ส่งข้อมูลระบบงานภายใน (ไอคอนจาก Figma)" },
      { type: "changed", text: "รวม Component ที่ซ้ำกันเป็นของกลาง: AppDialog, ConfirmDialog, DateField, SegmentedControl, TableIconButton, CodeViewer, SecondaryButton และ utils/csv.js" },
      { type: "fixed", text: "ข้อมูลจำลองการชำระเงินให้ตรงกับคำขอ ใบเสร็จ และทะเบียนผู้ประกอบการ; ลิงก์คู่มือ / นโยบายความเป็นส่วนตัวเปิดแท็บที่ถูกต้อง" },
    ],
  },
  {
    version: "0.2.1",
    date: "2026-10-29",
    title: "ปรับ Sidebar ให้ตรง Figma",
    changes: [
      { type: "changed", text: "Sidebar หลังบ้านใช้ขนาดและระยะตาม Figma (Web/Sidebar): เมนูสูง 44, มุม md, ระยะห่างเมนู 2, หัวกลุ่มเยื้อง 32" },
      { type: "changed", text: "เมนูที่เปิดอยู่แสดงแถบชมพูชิดขอบ Sidebar พื้นสว่างขึ้นและตัวหนา ตาม State Active ใน Figma" },
      { type: "changed", text: "ไอคอนเมนูและโลโก้ใช้ไอคอนเส้นจาก Figma (Icon/*) แทน Font Awesome" },
      { type: "changed", text: "โลโก้ใน Sidebar ใช้ขนาด Small (ชื่อ 16, คำบรรยายบรรทัดเดียว)" },
      { type: "added", text: "Component SvgIcon และ SidebarItem" },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-10-28",
    title: "หน้าจอ Prototype ตาม Figma ครบทุก Flow",
    changes: [
      { type: "added", text: "หน้ารวมหน้าจอ (/prototype) จัดกลุ่มตาม Flow พร้อมรหัส Figma และรหัสหน้าจอ" },
      { type: "added", text: "Portal: หน้าแรก (D01), Dashboard สถิติ (D02), ตรวจสอบพื้นที่โรคระบาด (D03) และมุมมองมือถือ (S01, S02)" },
      { type: "added", text: "เข้าสู่ระบบ 2 ชั้น: Username / Password (D04), PIN แป้นสุ่มตำแหน่ง + ล็อกเมื่อผิด 5 ครั้ง (D05), ตั้ง PIN พร้อมตรวจเงื่อนไข (D06)" },
      { type: "added", text: "หน้าหลักเจ้าหน้าที่ (D07), ทะเบียนผู้ประกอบการ + อนุมัติ THNSW (D08)" },
      { type: "added", text: "คำขอใบรับรองฯ พร้อมตัวกรองและแท็บสถานะ (D09) และหน้าไม่พบข้อมูล (D18)" },
      { type: "added", text: "พิจารณาคำขอ: Checklist, ข้อความตอบกลับ, Preview ใบรับรองฯ TH/EN และยืนยันอนุมัติ (D10, D11)" },
      { type: "added", text: "ติดตามสถานะคำขอ 9 ขั้นตอน พร้อมประวัติสถานะและเอกสารที่ออกแล้ว (D12)" },
      { type: "added", text: "ติดตามการชำระเงิน (D13), ข้อมูลพื้นที่โรคระบาด (D14), ผู้ใช้งานและสิทธิ์ (D15), ติดตาม ebXML (D16), ใบรับรอง PKI (D17)" },
      {
        type: "added",
        text: "ฟังก์ชันตาม TOR ที่ Figma ยังไม่มี: ยกเลิกการอนุมัติภายใน 15 นาที, Pop-up ยืนยันไม่อนุมัติ, แก้ไขข้อมูลคำขอ, ค้นหาเลขที่ใบรับรอง/ใบสีชมพู, ตารางรายการติดตามสถานะ, ตั้งค่า CPA",
      },
      { type: "added", text: "Layout และ Component กลาง: Portal / เข้าสู่ระบบ / หลังบ้าน, ตาราง, KPI, กราฟ, Stepper, ตัวกรอง ฯลฯ" },
      { type: "changed", text: "แก้ปัญหาในดีไซน์: ตารางพื้นที่โรคระบาด (D03) แสดงคอลัมน์สถานะครบ, ปุ่มยืนยันอนุมัติใช้ไม่ได้ถ้า Checklist ยังไม่ครบ" },
      { type: "added", text: "หน้าที่ยังไม่มีใน Figma แสดงเป็นหน้า “ยังไม่มีดีไซน์” และระบุไว้ในหน้ารวมหน้าจอ" },
    ],
  },
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
