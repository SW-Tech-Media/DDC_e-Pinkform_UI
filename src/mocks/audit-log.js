// ข้อมูลจำลองหน้า B-19 · ประวัติการใช้งาน (Audit Log) — TOR 4.1.15
// user = key ใน staff (mocks/users.js) · action = key ใน auditActions (content/audit-log.js)
// changes: [{ field, before, after }] — before = null คือเพิ่มใหม่ / after = null คือถูกลบ
// รายการของเมนูคำขอ / การชำระเงิน / ใบเสร็จ อ้างคำขอและเวลาเดียวกับ mocks/requests.js (ผลการพิจารณาใน outcome)
// การกระทำในรอบนี้บันทึกผ่าน stores/audit.js — หน้าจออ่านจาก useAuditStore().all
import { requestStatuses } from "./requests.js";
import { receipts } from "./receipts.js";

export const auditRetention = { minDays: 90, maxYears: 2, oldest: "2026-07-28T00:02:11+07:00", total: 184_362 };

// เครื่องที่ผู้ใช้แต่ละคนใช้ (ใช้กับ Log ที่บันทึกในรอบนี้ด้วย)
export const auditDevices = {
  somrudee: { ip: "10.20.31.45", device: "Windows 11 · Chrome 130", host: "DDC-SV-PC045" },
  somchai: { ip: "10.20.31.52", device: "Windows 11 · Edge 130", host: "DDC-SV-PC052" },
  prapaporn: { ip: "10.20.40.18", device: "Windows 10 · Chrome 130", host: "DDC-FN-PC018" },
  thanakorn: { ip: "10.20.10.7", device: "macOS 15 · Chrome 130", host: "DDC-IT-MB007" },
  wipawan: { ip: "10.20.5.3", device: "iPadOS 18 · Safari", host: "DDC-DIR-IPAD03" },
  superadmin: { ip: "10.20.10.2", device: "Windows 11 · Chrome 130", host: "DDC-IT-PC002" },
};

// การเปลี่ยนสถานะคำขอ (ป้ายสถานะตาม requestStatuses)
const S = (key) => requestStatuses[key].label;
const approved = (reply = "R01 – อนุมัติ ข้อมูลถูกต้องครบถ้วน") => [
  { field: "สถานะคำขอ", before: S("pending"), after: S("awaitingPayment") },
  { field: "ข้อความตอบกลับ", before: null, after: reply },
];
const rejected = (reply) => [
  { field: "สถานะคำขอ", before: S("pending"), after: S("rejected") },
  { field: "ข้อความตอบกลับ", before: null, after: reply },
];
const receiptsOn = (day) => receipts.filter((r) => r.issuedAt.startsWith(day)).length;

const log = (at, user, menu, action, target, changes = [], extra = {}) => ({
  at,
  user,
  ...auditDevices[user],
  menu,
  action,
  target,
  changes,
  ...extra,
});

// ใหม่ → เก่า · Log ID เรียงตามเวลา (เก่าสุด = AL00001) — Log ที่บันทึกในรอบนี้ใช้เลขถัดไป
export const auditLogs = [
  log("2026-10-26T14:12:08+07:00", "thanakorn", "masterData", "update", "รหัสข้อความตอบกลับ R05", [
    { field: "ข้อความตอบกลับ", before: "แหล่งผลิตอยู่ในเขตโรคระบาด", after: "แหล่งผลิตอยู่ในพื้นที่โรคระบาด" },
    { field: "คำอธิบาย", before: "ตำบลแหล่งผลิตอยู่ในพื้นที่โรคระบาด", after: "ตำบลแหล่งผลิตอยู่ในพื้นที่โรคระบาดและยังไม่ครบ 21 วัน" },
  ]),
  log("2026-10-26T13:58:41+07:00", "somchai", "outbreak", "create", "ต.มหาชัย อ.เมืองสมุทรสาคร", [
    { field: "ตำบล", before: null, after: "มหาชัย (740101)" },
    { field: "คำอธิบาย", before: null, after: "รายงานผู้ป่วยอหิวาตกโรค 2 ราย (กองระบาดวิทยา)" },
    { field: "วันที่เกิดโรค", before: null, after: "2026-10-24" },
  ]),
  log("2026-10-26T11:20:15+07:00", "somrudee", "thnsw", "reject", "PRF-690415 บริษัท ฟาสต์ เทรด ทู ยู จำกัด", [
    { field: "สถานะ", before: "รอพิจารณา", after: "ไม่อนุมัติ" },
    { field: "เหตุผล", before: null, after: "ใบรับรองลายมือชื่อดิจิทัลหมดอายุ" },
  ]),
  log("2026-10-26T10:48:02+07:00", "somchai", "thnsw", "approve", "PRF-690405 บริษัท มหาชัย ซีฟู้ด เอ็กซ์เพรส จำกัด", [
    { field: "สถานะ", before: "รอพิจารณา", after: "อนุมัติแล้ว" },
    { field: "สิทธิ์การเข้าใช้งาน", before: null, after: "ใช้งาน" },
    { field: "ประเภทบริการ", before: null, after: "ใบรับรองฯ" },
  ]),
  log("2026-10-26T10:12:30+07:00", "somrudee", "operators", "update", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", [
    { field: "สิทธิ์การเข้าใช้งาน", before: "ใช้งาน", after: "ระงับชั่วคราว" },
  ]),
  log("2026-10-26T10:54:10+07:00", "somrudee", "requests", "approve", "PF6910260027 บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", [
    ...approved(),
    { field: "คำสั่งชำระเงิน", before: null, after: "PAY6910260027 (Ref.1 INV-6910-1080)" },
  ]),
  log("2026-10-26T10:41:20+07:00", "somchai", "requests", "approve", "PF6910260024 บริษัท มหาชัย โฟรเซ่น จำกัด", [
    ...approved(),
    { field: "คำสั่งชำระเงิน", before: null, after: "PAY6910260024 (Ref.1 INV-6910-1073)" },
  ]),
  log("2026-10-26T09:31:12+07:00", "somrudee", "requests", "approve", "PF6910260006 บริษัท ไทยเฟรช ฟู้ด จำกัด", [
    ...approved(),
    { field: "คำสั่งชำระเงิน", before: null, after: "PAY6910260006 (Ref.1 INV-6910-1031)" },
  ]),
  log("2026-10-26T09:05:12+07:00", "thanakorn", "users", "resetPin", "สมชาย ระวังภัย (somchai.r)", [
    { field: "PIN", before: "ตั้งแล้ว", after: "รอตั้ง PIN ใหม่" },
  ]),
  log("2026-10-26T08:58:03+07:00", "prapaporn", "receipts", "export", `ใบเสร็จรับเงิน 25/10/2569 (${receiptsOn("2026-10-25")} รายการ)`),
  log("2026-10-26T08:42:10+07:00", "somrudee", "login", "login", "เข้าสู่ระบบ (Username + PIN)"),
  log("2026-10-26T08:37:44+07:00", "somchai", "login", "loginFailed", "PIN ไม่ถูกต้อง (ครั้งที่ 2 / 5)", [], { ip: "10.20.31.52" }),
  log("2026-10-25T17:31:20+07:00", "thanakorn", "users", "update", "สิทธิ์ผู้ใช้ สมฤดี ใจดี", [
    { field: "เมนู ข้อมูลหลักอื่น ๆ", before: "ดู", after: "ดู / แก้ไข" },
    { field: "เมนู รายงานสรุป", before: "ไม่มีสิทธิ์", after: "ดู" },
  ]),
  log("2026-10-25T16:42:51+07:00", "prapaporn", "payments", "view", "Ref.1 INV-6910-0968 (ดูรายละเอียดการชำระเงินไม่สำเร็จ PAY6910250176)"),
  log("2026-10-25T16:05:09+07:00", "thanakorn", "masterData", "create", "รหัสประเทศ KR", [
    { field: "รหัสประเทศ", before: null, after: "KR" },
    { field: "ชื่อประเทศ", before: null, after: "เกาหลีใต้ (Korea, Republic of)" },
  ]),
  log("2026-10-25T15:40:27+07:00", "somchai", "operators", "update", "บริษัท ทรอปิคอล แพค จำกัด", [
    { field: "ประเภทบริการ", before: "ใบรับรองฯ", after: "ยื่นแทนผู้ส่งออก" },
  ]),
  log("2026-10-25T11:18:36+07:00", "thanakorn", "masterData", "delete", "รหัสหน่วยหีบห่อ BL", [
    { field: "รหัส", before: "BL", after: null },
    { field: "ชื่อหน่วยหีบห่อ", before: "Bale (มัด)", after: null },
  ]),
  log("2026-10-25T12:15:33+07:00", "somchai", "requests", "reject", "PF6910250151 บริษัท อันดามัน ซีฟู้ด จำกัด", rejected("R04 – พิกัดศุลกากร / รหัสสถิติไม่ถูกต้อง")),
  log("2026-10-25T11:12:09+07:00", "wipawan", "receipts", "sign", "ใบเสร็จ R69-0104384 / ใบรับรองฯ DDC-PF 69/012819 (PF6910250144)"),
  log("2026-10-24T16:47:02+07:00", "thanakorn", "ebxml", "resend", "Message ID MSG-20261024-1645-DDCPFRES-0091", [
    { field: "สถานะการส่ง", before: "Retry 3/5", after: "ส่งสำเร็จ" },
  ]),
  log("2026-10-24T11:05:40+07:00", "somrudee", "operators", "update", "บริษัท อันดามัน ซีฟู้ด จำกัด", [
    { field: "สาขา", before: "00000", after: "00002" },
  ]),
  log("2026-10-23T09:12:18+07:00", "thanakorn", "masterData", "update", "ข้อมูลหน่วยงาน DDC", [
    { field: "CA Alias", before: "ddc-pinkforms-signer-2025", after: "ddc-pinkforms-signer-2026" },
  ]),
  log("2026-10-22T17:55:00+07:00", "prapaporn", "login", "logout", "ออกจากระบบ"),
].sort((a, b) => b.at.localeCompare(a.at)).map((l, i, all) => ({ id: `AL${String(all.length - i).padStart(5, "0")}`, ...l }));
