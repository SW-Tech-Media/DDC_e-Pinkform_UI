// ข้อมูลจำลองหน้า D15 · ผู้ใช้งานและสิทธิ์ (ตาม Figma node 20:4630)
import { adminNav } from "@/content/navigation.js";

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

// เมนูในตารางสิทธิ์ = ทุกเมนูใน Sidebar (content/navigation.js) ผูกด้วย key เดียวกัน (TOR 4.1.10)
// fixed = เมนูที่ทุกบทบาทเห็นเสมอ แก้สิทธิ์ไม่ได้ (หน้าหลัก — ปลายทางของปุ่ม "กลับหน้าหลัก" ในหน้าไม่มีสิทธิ์)
export const permissionMenus = adminNav.flatMap((section) =>
  section.items.map((item) => ({ key: item.key, label: item.title, group: section.group, fixed: item.key === "home" }))
);
export const permissionActions = [
  { key: "view", label: "ดู" },
  { key: "create", label: "เพิ่ม" },
  { key: "edit", label: "แก้ไข" },
  { key: "delete", label: "ลบ" },
  { key: "approve", label: "อนุมัติ" },
];

// แม่แบบสิทธิ์ — สตริง 5 หลักต่อเมนู ตามลำดับ ดู/เพิ่ม/แก้ไข/ลบ/อนุมัติ (1 = มีสิทธิ์) · เมนูที่ไม่ระบุ = ไม่มีสิทธิ์
// สมมติฐานรอลูกค้ายืนยัน (Q-15): สิทธิ์รายเมนูของแต่ละกลุ่มงาน และความต่างของ Admin กับ Super Admin
// ชั่วคราวจนกว่าจะมี API — ระบบจริง backend เป็นเจ้าของสิทธิ์และตรวจทุกคำขอ หน้าจอใช้เพื่อซ่อนเมนู/ปุ่มเท่านั้น
const templates = {
  // ฝ่ายบริการ: รับ-พิจารณาคำขอ, THNSW, พื้นที่โรคระบาด, เนื้อหาเว็บไซต์และแบบสอบถาม
  service: {
    operators: "11101", thnsw: "10001", requests: "10101", tracking: "10000", certificates: "10000",
    payments: "10000", receipts: "10000", outbreak: "11110", masterData: "10000", reports: "10000",
    content: "11110", surveys: "11110",
  },
  // ฝ่ายการเงิน: ติดตามการชำระเงิน / ใบเสร็จ ดูงานบริการได้อย่างเดียว
  finance: {
    operators: "10000", requests: "10000", tracking: "10000", certificates: "10000",
    payments: "11101", receipts: "11100", outbreak: "10000", masterData: "10000", reports: "10000",
  },
  // ผู้มีอำนาจลงนาม: ดูและอนุมัติคำขอ ดูใบรับรองฯ และรายงาน
  signer: {
    operators: "10000", thnsw: "10000", requests: "10001", tracking: "10000", certificates: "10000",
    payments: "10000", outbreak: "10000", reports: "10000",
  },
  // Admin (IT): ข้อมูลหลัก ผู้ใช้งาน ระบบเชื่อมโยง ดูงานบริการ/การเงินได้อย่างเดียว ไม่อนุมัติคำขอ
  admin: {
    operators: "11110", thnsw: "10000", requests: "10000", tracking: "10000", certificates: "10000",
    payments: "10000", receipts: "10000", outbreak: "11110", masterData: "11110", reports: "10000",
    visitors: "10000", content: "10000", surveys: "10000", users: "11100", ebxml: "11100",
    pki: "11110", cpa: "11110", api: "10000", backofficeSync: "11100", auditLog: "10000",
  },
  // Super Admin: ทุกเมนู ทุกการกระทำ
  superadmin: Object.fromEntries(permissionMenus.map((m) => [m.key, "11111"])),
};

export const permissionTemplate = (group, role) => {
  const tpl = role === "user" ? templates[group] : templates[role];
  return Object.fromEntries(
    permissionMenus.map((m) => [m.key, [...(m.fixed ? "10000" : tpl?.[m.key] ?? "00000")].map((b) => b === "1")])
  );
};

// สถานะบัญชี (G-11 · Flow 4.1) คำนวณใน stores/users.js statusOf() ตามลำดับ:
//   active = false → ปิดใช้งาน (ผู้ดูแลปิดเอง) · ถูกล็อกใน mocks/auth.js authAccounts → ระงับ (กรอกรหัสผ่านผิดครบ 5 ครั้ง)
//   emailVerified = false → รอยืนยันอีเมล (ยังไม่กดลิงก์ / ยังไม่ตั้งรหัสผ่าน + PIN) · อื่น ๆ → ใช้งาน
// verificationSentAt = เวลาที่ส่งลิงก์ยืนยันอีเมลล่าสุด (ลิงก์ใช้ครั้งเดียว อายุ 24 ชั่วโมง — authMock.verifyAccount.linkHours)
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
  emailVerified: true,
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
  u(14, "อรทัย จันทร์เพ็ญ", "orathai.c", "service", "user", false, true, null, { emailVerified: false, verificationSentAt: "2026-10-24T16:10:00+07:00" }),
  u(15, "ชัยวัฒน์ พรหมมา", "chaiwat.p", "service", "user", true, true, "2026-10-24T10:32:00"),
  u(16, "พรทิพย์ อินทร์แก้ว", "pornthip.i", "service", "user", true, false, "2026-09-30T09:00:00"),
  u(17, "สุนิสา รุ่งเรือง", "sunisa.r", "finance", "user", true, true, "2026-10-26T09:47:00"),
  u(18, "ธีรพงษ์ มีสุข", "teerapong.m", "finance", "user", true, true, "2026-10-25T16:15:00"),
  u(19, "นภัสสร ใจงาม", "napatsorn.j", "finance", "user", true, true, "2026-10-24T13:28:00"),
  u(20, "เกศินี บุญเรือง", "kesinee.b", "finance", "user", false, true, null, { emailVerified: false, verificationSentAt: "2026-10-20T10:00:00+07:00" }),
  u(21, "ประเสริฐ วัฒนกุล", "prasert.w", "signer", "user", true, true, "2026-10-26T07:58:00"),
  u(22, "รัชนี ศรีสวัสดิ์", "ratchanee.s", "signer", "user", true, true, "2026-10-23T15:36:00"),
  u(23, "สมศักดิ์ เจริญผล", "somsak.c", "signer", "user", true, true, "2026-10-22T11:11:00"),
  u(24, "ภานุวัฒน์ แก้วใส", "panuwat.k", "it", "admin", true, true, "2026-10-26T10:50:00"),
  u(25, "ศุภชัย นาคสวัสดิ์", "supachai.n", "it", "admin", true, true, "2026-10-25T18:20:00"),
  u(26, "ดวงใจ พึ่งบุญ", "duangjai.p", "it", "user", true, true, "2026-10-25T09:40:00"),
  u(27, "วีระพงษ์ สายทอง", "weerapong.s", "service", "user", true, true, "2026-10-23T14:05:00"),
  u(28, "มาลัย ทองประเสริฐ", "malai.t", "service", "user", false, false, "2026-07-15T10:20:00", { twoFactor: false }),
].map((x) => ({ ...x, permissions: permissionTemplate(x.group === "it" && x.role === "user" ? "service" : x.group, x.role) }));

// ประวัติการจัดการผู้ใช้ (TOR 4.1.12) — ใหม่ → เก่า
export const userHistory = [
  { id: 1, at: "2026-10-26T10:42:00", actor: "ธนกร ศรีสุข", action: "แก้ไขสิทธิ์", target: "สมฤดี ใจดี", detail: "เพิ่มสิทธิ์อนุมัติ เมนูคำขอใบรับรองฯ" },
  { id: 8, at: "2026-10-26T09:58:12", actor: "ระบบ", action: "ระงับบัญชี", target: "ชัยวัฒน์ พรหมมา", detail: "กรอกรหัสผ่านผิดครบ 5 ครั้ง" },
  { id: 2, at: "2026-10-26T09:15:00", actor: "ธนกร ศรีสุข", action: "รีเซ็ต PIN", target: "จิราพร บุญมา", detail: "ส่งอีเมลให้ตั้ง PIN ใหม่" },
  { id: 3, at: "2026-10-25T16:02:00", actor: "ผู้ดูแลระบบสูงสุด", action: "เปลี่ยนบทบาท", target: "ศุภชัย นาคสวัสดิ์", detail: "User → Admin" },
  { id: 4, at: "2026-10-25T11:30:00", actor: "ธนกร ศรีสุข", action: "เพิ่มผู้ใช้งาน", target: "วีระพงษ์ สายทอง", detail: "กลุ่มงานฝ่ายบริการ · บทบาท User" },
  { id: 5, at: "2026-10-24T14:18:00", actor: "ธนกร ศรีสุข", action: "ผูกใบรับรอง Signer", target: "รัชนี ศรีสวัสดิ์", detail: "CN=Ratchanee Srisawat (Authorized Signer)" },
  { id: 6, at: "2026-10-20T10:05:00", actor: "ผู้ดูแลระบบสูงสุด", action: "ปิดใช้งานบัญชี", target: "อนุชา แก้วมณี", detail: "ไม่ได้ใช้งานเกิน 60 วัน" },
  { id: 7, at: "2026-10-18T09:00:00", actor: "ธนกร ศรีสุข", action: "ปิดใช้งานบัญชี", target: "มาลัย ทองประเสริฐ", detail: "โอนย้ายหน่วยงาน" },
];

export const usersNow = "2026-10-26T11:30:00";
