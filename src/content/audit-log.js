// ข้อความหน้า B-19 · ประวัติการใช้งาน (Audit Log) — TOR 4.1.15 (Figma ยังไม่มี — ออกแบบตามสไตล์ D15/D16)
import { formatNumber } from "@/utils/format.js";

export const auditText = {
  breadcrumb: [{ title: "ผู้ดูแลระบบ" }, { title: "ประวัติการใช้งาน (Audit Log)" }],
  title: "ประวัติการใช้งาน (Audit Log)",
  description: "บันทึกว่าใครทำอะไร จากเครื่องใด เมื่อไร และข้อมูลก่อน – หลังแก้ไข สำหรับตรวจสอบย้อนหลัง",
  exportCsv: "ส่งออก CSV",
  exported: (n) => `ส่งออกไฟล์ CSV ${formatNumber(n)} รายการแล้ว`,
  csvFile: (date) => `audit-log-${date}.csv`,

  retention: {
    title: "ระบบเก็บ Log ไม่น้อยกว่า 90 วัน",
    body: (oldest, total) =>
      `ขยายได้สูงสุด 2 ปีเมื่อมีคำสั่ง (TOR 4.1.15) · ข้อมูลเก่าสุด ${oldest} · ทั้งหมด ${formatNumber(total)} รายการ · Log แก้ไขหรือลบไม่ได้`,
  },

  filters: {
    user: "ผู้ใช้",
    action: "ประเภทการกระทำ",
    menu: "เมนู",
    date: "ช่วงวันที่",
    datePlaceholder: "ทุกวัน",
    ip: "IP Address",
    ipPlaceholder: "เช่น 10.20.31",
    all: "ทั้งหมด",
  },

  headers: [
    { title: "วันเวลา", key: "at", sortable: false },
    { title: "ผู้ใช้", key: "user", sortable: false },
    { title: "IP / เครื่อง", key: "ip", sortable: false },
    { title: "เมนู", key: "menu", sortable: false },
    { title: "การกระทำ", key: "action", sortable: false },
    { title: "รายการ", key: "target", sortable: false },
    { title: "", key: "view", align: "center", sortable: false },
  ],
  resultCount: (n) => `พบ ${formatNumber(n)} รายการ`,
  view: "ดูรายละเอียด",
  changed: (n) => `แก้ไข ${n} ฟิลด์`,
  noData: "ไม่พบประวัติที่ตรงกับเงื่อนไข",
  timeSuffix: "น.",

  // tone: StatusBadge
  actions: {
    login: { label: "เข้าสู่ระบบ", tone: "info" },
    loginFailed: { label: "เข้าสู่ระบบไม่สำเร็จ", tone: "danger" },
    logout: { label: "ออกจากระบบ", tone: "neutral" },
    view: { label: "ดูข้อมูล", tone: "neutral" },
    create: { label: "เพิ่ม", tone: "success" },
    update: { label: "แก้ไข", tone: "warning" },
    delete: { label: "ลบ", tone: "danger" },
    approve: { label: "อนุมัติ", tone: "success" },
    reject: { label: "ไม่อนุมัติ", tone: "danger" },
    undoApprove: { label: "ยกเลิกการอนุมัติ", tone: "warning" },
    sign: { label: "ลงนาม", tone: "accent" },
    resend: { label: "ส่งข้อความซ้ำ", tone: "info" },
    resetPin: { label: "รีเซ็ต PIN", tone: "warning" },
    accountLocked: { label: "ระงับบัญชี", tone: "danger" },
    unlock: { label: "ปลดล็อกบัญชี", tone: "success" },
    resendVerification: { label: "ส่งลิงก์ยืนยันอีเมลใหม่", tone: "info" },
    setPassword: { label: "ตั้งรหัสผ่าน", tone: "info" },
    resetPassword: { label: "รีเซ็ตรหัสผ่าน", tone: "warning" },
    export: { label: "ส่งออกข้อมูล", tone: "neutral" },
  },

  menus: {
    login: "เข้าสู่ระบบ",
    operators: "ทะเบียนผู้ประกอบการ",
    thnsw: "พิจารณาอนุมัติ THNSW",
    requests: "คำขอใบรับรองฯ",
    payments: "ติดตามการชำระเงิน",
    receipts: "ใบเสร็จรับเงิน",
    outbreak: "พื้นที่โรคระบาด",
    masterData: "ข้อมูลหลักอื่น ๆ",
    users: "ผู้ใช้งานและสิทธิ์",
    ebxml: "ติดตาม ebXML",
  },

  detail: {
    title: "รายละเอียดประวัติการใช้งาน",
    subtitle: (id) => `Log ID ${id}`,
    fields: {
      at: "วันเวลา",
      user: "ผู้ใช้",
      ip: "IP Address",
      host: "ชื่อเครื่อง",
      device: "ระบบปฏิบัติการ / เบราว์เซอร์",
      menu: "เมนู",
      action: "การกระทำ",
      target: "รายการ",
    },
    diffTitle: "ข้อมูลก่อน – หลังแก้ไข",
    field: "ฟิลด์",
    before: "ข้อมูลเดิม",
    after: "ข้อมูลใหม่",
    empty: "–",
    noChanges: "รายการนี้ไม่มีการเปลี่ยนแปลงข้อมูล",
  },

  csv: {
    headers: ["Log ID", "วันเวลา", "ผู้ใช้", "Username", "IP Address", "ชื่อเครื่อง", "อุปกรณ์", "เมนู", "การกระทำ", "รายการ", "ฟิลด์ที่แก้ไข", "ข้อมูลเดิม", "ข้อมูลใหม่"],
  },
};
