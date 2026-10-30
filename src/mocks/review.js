// ข้อมูลจำลองของหน้าจอ D10 – D12 (เสริมจาก mocks/requests.js ซึ่งเป็นข้อมูลคำขอหลัก)
import { requestDetails, requests } from "./requests.js";

// Checklist ก่อนอนุมัติ 6 ข้อ (TOR 4.4.2) — checked = ค่าเริ่มต้นตาม Figma D10 (4 / 6)
export const checklistItems = [
  { id: "operator", label: "ข้อมูลผู้ประกอบการตรงกับที่ลงทะเบียน", checked: true },
  { id: "goods", label: "ชื่อสินค้าและลักษณะนามถูกต้อง", checked: true },
  { id: "hs", label: "พิกัดศุลกากรและรหัสสถิติถูกต้อง", checked: true },
  { id: "source", label: "แหล่งผลิตไม่อยู่ในพื้นที่โรคระบาด", checked: false },
  { id: "date", label: "วัน เดือน ปี ที่ผลิตถูกต้อง", checked: true },
  { id: "scope", label: "ข้อความในคำขออยู่ในขอบเขตที่กรมฯ รับรอง", checked: false },
];

// ข้อความตอบกลับผู้ประกอบการ (Master Data) — type: approve | reject
export const replyMessages = [
  { code: "R01", text: "อนุมัติ ข้อมูลถูกต้องครบถ้วน", type: "approve" },
  { code: "R02", text: "ข้อมูลผู้ประกอบการไม่ตรงกับที่ลงทะเบียน", type: "reject" },
  { code: "R03", text: "ชื่อสินค้าหรือลักษณะนามไม่ถูกต้อง", type: "reject" },
  { code: "R04", text: "พิกัดศุลกากร / รหัสสถิติไม่ถูกต้อง", type: "reject" },
  { code: "R05", text: "แหล่งผลิตอยู่ในพื้นที่โรคระบาด", type: "reject" },
  { code: "R06", text: "วัน เดือน ปี ที่ผลิตไม่ถูกต้อง", type: "reject" },
  { code: "R07", text: "ข้อความเกินขอบเขตที่กรมฯ รับรอง", type: "reject" },
  { code: "R08", text: "เอกสารประกอบไม่ครบถ้วน", type: "reject" },
];

// ค่าเริ่มต้นของข้อความตอบกลับใน Figma D10
export const defaultReplyCode = "R05";

// เอกสารประกอบคำขอ (แท็บ "เอกสารประกอบ")
export const requestDocuments = {
  PF6910260003: [
    { id: "inv", name: "Commercial Invoice INV-6910-1024.pdf", type: "Invoice", size: "248 KB", icon: "far fa-file-pdf", at: "2026-10-26T08:41:52+07:00" },
    { id: "pkl", name: "Packing List PL-6910-1024.pdf", type: "Packing List", size: "186 KB", icon: "far fa-file-pdf", at: "2026-10-26T08:41:55+07:00" },
    { id: "src", name: "หนังสือรับรองแหล่งผลิต (GAP).jpg", type: "หนังสือรับรองแหล่งผลิต", size: "1.2 MB", icon: "far fa-file-image", at: "2026-10-26T08:41:58+07:00" },
  ],
};

// คำขออื่นใช้เอกสารชุดมาตรฐาน 3 ไฟล์ตามเลข Invoice
const addSeconds = (iso, s) => new Date(new Date(iso).getTime() + s * 1000).toISOString();
for (const r of requests) {
  if (requestDocuments[r.ref]) continue;
  const no = r.invoice.replace("INV-", "");
  requestDocuments[r.ref] = [
    { id: "inv", name: `Commercial Invoice ${r.invoice}.pdf`, type: "Invoice", size: "231 KB", icon: "far fa-file-pdf", at: addSeconds(r.submittedAt, -18) },
    { id: "pkl", name: `Packing List PL-${no}.pdf`, type: "Packing List", size: "174 KB", icon: "far fa-file-pdf", at: addSeconds(r.submittedAt, -15) },
    { id: "src", name: "หนังสือรับรองแหล่งผลิต (GAP).jpg", type: "หนังสือรับรองแหล่งผลิต", size: "1.1 MB", icon: "far fa-file-image", at: addSeconds(r.submittedAt, -12) },
  ];
}

// ประวัติสถานะ ณ ขณะที่คำขอรอพิจารณา (D10) — ใหม่ → เก่า (event = key ใน reviewText.history.events)
export const reviewHistory = {
  PF6910260003: [
    { event: "opened", detail: "เจ้าหน้าที่เปิดพิจารณาคำขอ", at: "2026-10-26T09:05:21+07:00", by: "สมฤดี ใจดี" },
    { event: "autoCheck", detail: "ตรวจสอบอัตโนมัติ · พบ 1 รายการที่ต้องตรวจสอบ (แหล่งผลิตรายการที่ 3)", at: "2026-10-26T08:42:14+07:00", by: "ระบบ" },
    { status: "received", detail: "รับจาก NSW · ลายมือชื่อดิจิทัลและ XML Schema ถูกต้อง", at: "2026-10-26T08:42:10+07:00", by: "ebXML Gateway" },
  ],
};

// คำขอที่มีผลแล้วใช้ประวัติสถานะฉบับเต็มจากรายละเอียดคำขอ
for (const r of requests) {
  if (reviewHistory[r.ref]) continue;
  if (requestDetails[r.ref].decision) {
    reviewHistory[r.ref] = requestDetails[r.ref].history;
    continue;
  }
  const flagged = requestDetails[r.ref]?.outbreakNote;
  reviewHistory[r.ref] = [
    {
      event: "autoCheck",
      detail: flagged
        ? `ตรวจสอบอัตโนมัติ · พบ ${r.flagged} รายการที่ต้องตรวจสอบ (แหล่งผลิตรายการที่ ${flagged.item})`
        : "ตรวจสอบอัตโนมัติ · ผ่านทุกรายการ",
      at: addSeconds(r.submittedAt, 14),
      by: "ระบบ",
    },
    { status: "received", detail: "รับจาก NSW · ลายมือชื่อดิจิทัลและ XML Schema ถูกต้อง", at: addSeconds(r.submittedAt, 10), by: "ebXML Gateway" },
  ];
}

// ข้อมูลการชำระ / ใบรับรองที่ออกแล้ว (ใช้ในตารางรายการติดตามสถานะ D12) และเอกสารที่ออกแล้ว — สร้างจากรายละเอียดคำขอ
export const trackingExtras = {};
export const issuedDocuments = {};

// คำขอที่สร้างคำสั่งชำระ / ออกใบรับรองแล้ว
for (const r of requests) {
  const d = requestDetails[r.ref];
  if (!d.bankCode) continue;
  trackingExtras[r.ref] = { bankCode: d.bankCode, certificate: d.issued?.certificate ?? "" };
  if (d.issued) {
    issuedDocuments[r.ref] = [
      { id: "cert", title: "ใบรับรองฯ (PDF / XML)", number: d.issued.certificate, icon: "fas fa-award", tone: "pink", formats: ["PDF", "XML"] },
      { id: "receipt", title: "ใบเสร็จรับเงิน", number: d.issued.receipt, icon: "fas fa-file-invoice-dollar", tone: "teal", formats: ["PDF"] },
    ];
  }
}

// ระยะเวลาที่ยกเลิกการอนุมัติได้ (นาที) — TOR 4.4.2 (3)
export const undoWindowMinutes = 15;

// ประวัติอย่างง่ายของคำขอที่ไม่มีข้อมูลฉบับเต็ม (สร้างจากสถานะใน requests)
export function simpleHistory(req) {
  return [
    {
      status: "pending",
      label: "อยู่ระหว่างดำเนินการ",
      detail: "รอเจ้าหน้าที่พิจารณาคำขอ",
      at: addSeconds(req.submittedAt, 60),
      by: "ระบบ",
    },
    {
      status: "checking",
      detail: req.flagged ? `ตรวจสอบอัตโนมัติ · พบ ${req.flagged} รายการที่ต้องตรวจสอบ` : "ตรวจสอบอัตโนมัติ · ผ่าน",
      at: addSeconds(req.submittedAt, 14),
      by: "ระบบ",
    },
    {
      status: "received",
      detail: "รับจาก NSW · ลายมือชื่อดิจิทัลและ XML Schema ถูกต้อง",
      at: addSeconds(req.submittedAt, 10),
      by: "ebXML Gateway",
    },
  ];
}
