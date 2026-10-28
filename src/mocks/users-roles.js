// ข้อมูลจำลองหน้า D15 · ผู้ใช้งานและสิทธิ์ (ตาม Figma node 20:4630)

export const groups = {
  service: "ฝ่ายบริการ",
  finance: "ฝ่ายการเงิน",
  it: "เทคโนโลยีสารสนเทศ",
  signer: "ผู้มีอำนาจลงนาม",
};

export const roles = {
  user: { label: "User", tone: "info", description: "ใช้งานเมนูตามกลุ่มงาน ดู/บันทึกข้อมูลตามสิทธิ์ที่ได้รับ" },
  admin: { label: "Admin", tone: "accent", description: "จัดการข้อมูลหลัก ผู้ใช้งาน และติดตามระบบเชื่อมโยง" },
  superadmin: { label: "Super Admin", tone: "danger", description: "สิทธิ์สูงสุด กำหนดบทบาทและสิทธิ์ของผู้ดูแลระบบทั้งหมด" },
};

// เมนูในตารางสิทธิ์ และการกระทำ (คอลัมน์)
export const permissionMenus = [
  { key: "requests", label: "คำขอใบรับรองฯ" },
  { key: "operators", label: "ทะเบียนผู้ประกอบการ" },
  { key: "tracking", label: "ติดตามสถานะคำขอ" },
  { key: "payments", label: "ติดตามการชำระเงิน" },
  { key: "outbreak", label: "พื้นที่โรคระบาด" },
  { key: "masterData", label: "ข้อมูลหลักอื่น ๆ" },
  { key: "reports", label: "รายงานสรุป" },
  { key: "users", label: "ผู้ใช้งานและสิทธิ์" },
];
export const permissionActions = [
  { key: "view", label: "ดู" },
  { key: "create", label: "เพิ่ม" },
  { key: "edit", label: "แก้ไข" },
  { key: "delete", label: "ลบ" },
  { key: "approve", label: "อนุมัติ" },
];

// แม่แบบสิทธิ์ — สตริง 5 หลักต่อเมนู ตามลำดับ ดู/เพิ่ม/แก้ไข/ลบ/อนุมัติ (1 = มีสิทธิ์)
const templates = {
  service: { requests: "10101", operators: "11101", tracking: "10000", payments: "10000", outbreak: "11110", masterData: "10000", reports: "10000", users: "00000" },
  finance: { requests: "10000", operators: "10000", tracking: "10000", payments: "11101", outbreak: "10000", masterData: "10000", reports: "10000", users: "00000" },
  signer: { requests: "10001", operators: "10000", tracking: "10000", payments: "10000", outbreak: "10000", masterData: "00000", reports: "10000", users: "00000" },
  admin: { requests: "10000", operators: "11110", tracking: "10000", payments: "10000", outbreak: "11110", masterData: "11110", reports: "10000", users: "11100" },
  superadmin: { requests: "11111", operators: "11111", tracking: "11111", payments: "11111", outbreak: "11111", masterData: "11111", reports: "11111", users: "11111" },
};

export const permissionTemplate = (group, role) => {
  const tpl = role === "user" ? templates[group] : templates[role];
  return Object.fromEntries(Object.entries(tpl).map(([menu, bits]) => [menu, [...bits].map((b) => b === "1")]));
};

const u = (id, name, username, group, role, pinSet, active, lastActive, extra = {}) => ({
  id,
  name,
  username,
  email: `${username}@ddc.example`,
  group,
  role,
  pinSet,
  active,
  lastActive,
  twoFactor: true,
  signer: group === "signer" || group === "service",
  ...extra,
});

// 7 รายการแรกตาม Figma และรายการอื่นรวม 28 คน
export const users = [
  u(1, "สมฤดี ใจดี", "somrudee.j", "service", "user", true, true, "2026-10-26T11:24:00"),
  u(2, "สมชาย ระวังภัย", "somchai.r", "service", "user", true, true, "2026-10-26T11:20:00"),
  u(3, "ประภาพร มั่นคง", "prapaporn.m", "finance", "user", true, true, "2026-10-26T10:05:00"),
  u(4, "ธนกร ศรีสุข", "thanakorn.s", "it", "admin", true, true, "2026-10-26T09:12:00"),
  u(5, "วิภาวรรณ ทองดี", "wipawan.t", "signer", "user", true, true, "2026-10-25T16:40:00"),
  u(6, "ผู้ดูแลระบบสูงสุด", "superadmin", "it", "superadmin", true, true, "2026-10-24T08:55:00"),
  u(7, "อนุชา แก้วมณี", "anucha.k", "service", "user", false, false, "2026-08-02T13:10:00", { twoFactor: false }),
  u(8, "กมลวรรณ สุขประเสริฐ", "kamonwan.s", "service", "user", true, true, "2026-10-26T08:41:00"),
  u(9, "จิราพร บุญมา", "jiraporn.b", "service", "user", true, true, "2026-10-26T08:30:00"),
  u(10, "ณัฐพล วงศ์ใหญ่", "nattapon.w", "service", "user", true, true, "2026-10-25T17:02:00"),
  u(11, "ปิยะนุช ศรีวงศ์", "piyanuch.s", "service", "user", true, true, "2026-10-25T15:48:00"),
  u(12, "วรวุฒิ ทองคำ", "worawut.t", "service", "user", true, true, "2026-10-25T14:20:00"),
  u(13, "ศิริพร แสงทอง", "siriporn.s", "service", "user", true, true, "2026-10-25T11:05:00"),
  u(14, "อรทัย จันทร์เพ็ญ", "orathai.c", "service", "user", false, true, "2026-10-24T16:10:00"),
  u(15, "ชัยวัฒน์ พรหมมา", "chaiwat.p", "service", "user", true, true, "2026-10-24T10:32:00"),
  u(16, "พรทิพย์ อินทร์แก้ว", "pornthip.i", "service", "user", true, false, "2026-09-30T09:00:00"),
  u(17, "สุนิสา รุ่งเรือง", "sunisa.r", "finance", "user", true, true, "2026-10-26T09:47:00"),
  u(18, "ธีรพงษ์ มีสุข", "teerapong.m", "finance", "user", true, true, "2026-10-25T16:15:00"),
  u(19, "นภัสสร ใจงาม", "napatsorn.j", "finance", "user", true, true, "2026-10-24T13:28:00"),
  u(20, "เกศินี บุญเรือง", "kesinee.b", "finance", "user", false, true, "2026-10-20T10:00:00"),
  u(21, "ประเสริฐ วัฒนกุล", "prasert.w", "signer", "user", true, true, "2026-10-26T07:58:00"),
  u(22, "รัชนี ศรีสวัสดิ์", "ratchanee.s", "signer", "user", true, true, "2026-10-23T15:36:00"),
  u(23, "สมศักดิ์ เจริญผล", "somsak.c", "signer", "user", true, true, "2026-10-22T11:11:00"),
  u(24, "ภานุวัฒน์ แก้วใส", "panuwat.k", "it", "admin", true, true, "2026-10-26T10:50:00"),
  u(25, "ศุภชัย นาคสวัสดิ์", "supachai.n", "it", "admin", true, true, "2026-10-25T18:20:00"),
  u(26, "ดวงใจ พึ่งบุญ", "duangjai.p", "it", "user", true, true, "2026-10-25T09:40:00"),
  u(27, "วีระพงษ์ สายทอง", "weerapong.s", "service", "user", true, true, "2026-10-23T14:05:00"),
  u(28, "มาลัย ทองประเสริฐ", "malai.t", "service", "user", false, false, "2026-07-15T10:20:00", { twoFactor: false }),
].map((x) => ({ ...x, permissions: permissionTemplate(x.group === "it" && x.role === "user" ? "service" : x.group, x.role) }));

// ประวัติการจัดการผู้ใช้ (TOR 4.1.12)
export const userHistory = [
  { id: 1, at: "2026-10-26T10:42:00", actor: "ธนกร ศรีสุข", action: "แก้ไขสิทธิ์", target: "สมฤดี ใจดี", detail: "เพิ่มสิทธิ์อนุมัติ เมนูคำขอใบรับรองฯ" },
  { id: 2, at: "2026-10-26T09:15:00", actor: "ธนกร ศรีสุข", action: "รีเซ็ต PIN", target: "จิราพร บุญมา", detail: "ส่งอีเมลให้ตั้ง PIN ใหม่" },
  { id: 3, at: "2026-10-25T16:02:00", actor: "ผู้ดูแลระบบสูงสุด", action: "เปลี่ยนบทบาท", target: "ศุภชัย นาคสวัสดิ์", detail: "User → Admin" },
  { id: 4, at: "2026-10-25T11:30:00", actor: "ธนกร ศรีสุข", action: "เพิ่มผู้ใช้งาน", target: "วีระพงษ์ สายทอง", detail: "กลุ่มงานฝ่ายบริการ · บทบาท User" },
  { id: 5, at: "2026-10-24T14:18:00", actor: "ธนกร ศรีสุข", action: "ผูกใบรับรอง Signer", target: "รัชนี ศรีสวัสดิ์", detail: "CN=Ratchanee Srisawat (Authorized Signer)" },
  { id: 6, at: "2026-10-20T10:05:00", actor: "ผู้ดูแลระบบสูงสุด", action: "ระงับผู้ใช้งาน", target: "อนุชา แก้วมณี", detail: "ไม่ได้ใช้งานเกิน 60 วัน" },
  { id: 7, at: "2026-10-18T09:00:00", actor: "ธนกร ศรีสุข", action: "ระงับผู้ใช้งาน", target: "มาลัย ทองประเสริฐ", detail: "โอนย้ายหน่วยงาน" },
];

export const usersNow = "2026-10-26T11:30:00";
