// ข้อมูลจำลองหน้า B-24 · ติดตามการเชื่อมโยง API (เสนอเพิ่ม — TOR 4.6.1 ส่วน API)
import { paymentRefOf, requestDetails, requests, serviceFee } from "./requests.js";

export const apiToday = "2026-10-26";
export const apiNow = "2026-10-26T11:30:00";

export const apiStats = { calls: 4812, successRate: "99.2%", avgMs: 182, errors: 38 };

export const httpMethods = ["GET", "POST", "PUT"];

// กลุ่มสถานะ HTTP → tone ของ StatusBadge
export const httpClasses = {
  "2xx": { label: "2xx สำเร็จ", tone: "success" },
  "4xx": { label: "4xx Client Error", tone: "warning" },
  "5xx": { label: "5xx Server Error", tone: "danger" },
};
export const httpClass = (code) => `${String(code)[0]}xx`;

// ref = เลขที่ที่ Endpoint อ้างถึง (คำขอ / ใบรับรองฯ / ใบเสร็จ / เลขอ้างอิงชำระ) — ใช้เฉพาะเลขที่มีอยู่จริงใน mocks/requests.js
// ยกเว้นรายการ 404 ที่ตั้งใจค้นเลขที่ไม่มีอยู่ · body = ข้อมูลใน Request (POST / PUT)
const l = (id, time, method, endpoint, client, status, ms, errorCode = "", extra = {}) => ({
  id,
  at: `${apiToday}T${time}`,
  method,
  endpoint,
  client,
  status,
  ms,
  errorCode,
  ...extra,
});

const detailOf = (ref) => requestDetails[ref];
const certOf = (ref) => detailOf(ref).issued.certificate;
const receiptOf = (ref) => detailOf(ref).receipt.no;
// แจ้งผลชำระผ่าน API ทางเลือก (เสนอเพิ่ม) — ช่องทางหลักคือข้อความผลการชำระเงินผ่าน NSW (Flow 10 ข้อ 4.1)
const notify = (ref) => ({
  ref: paymentRefOf(ref),
  body: { paymentRef: paymentRefOf(ref), ref1: requests.find((r) => r.ref === ref).invoice, ref2: "001", amount: serviceFee, currency: "THB", status: "PAID" },
});
// ยื่นคำขอผ่าน API ทางเลือก — ไม่สำเร็จจึงไม่มีเลขคำขอ
const submit = { body: { invoiceNo: "INV-6910-1108", applicantTaxId: "0105556012345", items: 2, destination: "TW" } };

export const apiLogs = [
  l(1, "11:29:12", "GET", "/api/v1/requests/PF6910260036/status", "Counter Service Co.", 200, 64, "", { ref: "PF6910260036" }),
  // ธนาคารแจ้งผลซ้ำของรายการที่ชำระแล้ว — ระบบตอบ 200 โดยไม่บันทึกซ้ำ (idempotent)
  l(2, "11:28:57", "POST", "/api/v1/payments/notify", "ธนาคาร A (006)", 200, 158, "", notify("PF6910260012")),
  l(3, "11:28:30", "GET", `/api/v1/certificates/${certOf("PF6910260018")}`, "e-Licensing", 200, 92, "", { ref: certOf("PF6910260018") }),
  l(4, "11:27:48", "POST", "/api/v1/requests", "NSP Alpha Network", 400, 41, "E1002 · XML Schema ไม่ถูกต้อง", submit),
  l(5, "11:27:05", "GET", "/api/v1/outbreak-areas", "Counter Service Co.", 200, 38),
  // คำขอ PF6910260027 จึงยังรอการชำระเงิน (ธนาคารจะแจ้งซ้ำ หรือผลมาทาง NSW)
  l(6, "11:26:33", "POST", "/api/v1/payments/notify", "ธนาคาร B (014)", 503, 30012, "E5003 · Upstream Timeout", notify("PF6910260027")),
  l(7, "11:25:50", "GET", "/api/v1/requests/PF6910260018/status", "NSW Gateway", 200, 57, "", { ref: "PF6910260018" }),
  l(8, "11:25:14", "POST", "/api/v1/requests", "Partner ทดสอบ (Sandbox)", 401, 12, "E4010 · API Key ไม่ถูกต้อง", submit),
  l(9, "11:24:39", "PUT", "/api/v1/requests/PF6910260033/documents", "NSP Alpha Network", 200, 386, "", {
    ref: "PF6910260033",
    body: { requestNo: "PF6910260033", documents: [{ type: "INVOICE", file: "INV-6910-1094.pdf" }] },
  }),
  l(10, "11:23:58", "GET", "/api/v1/certificates/DDC-PF 69/012799", "e-Licensing", 404, 29, "E4040 · ไม่พบเลขที่ใบรับรอง", { ref: "DDC-PF 69/012799" }),
  l(11, "11:22:47", "GET", `/api/v1/receipts/${receiptOf("PF6910260012")}`, "ธนาคาร A (006)", 200, 71, "", { ref: receiptOf("PF6910260012") }),
  l(12, "11:21:30", "POST", "/api/v1/requests", "NSP Alpha Network", 500, 1204, "E5000 · Internal Server Error", submit),
  l(13, "11:18:05", "GET", "/api/v1/requests/PF6910260030/status", "NSW Gateway", 200, 61, "", { ref: "PF6910260030" }),
  l(14, "11:16:40", "GET", "/api/v1/outbreak-areas", "NSP Alpha Network", 200, 41),
];

export const clientTypes = {
  apiKey: { label: "API Key", tone: "info" },
  oauth: { label: "OAuth 2.0", tone: "accent" },
};

export const clientStatuses = {
  active: { label: "ใช้งาน", tone: "success" },
  expiring: { label: "ใกล้หมดอายุ", tone: "warning" },
  revoked: { label: "เพิกถอน", tone: "danger" },
};

export const apiScopes = ["requests:write", "requests:read", "certificates:read", "payments:notify", "receipts:read", "outbreak:read"];

export const apiClients = [
  {
    id: 1,
    name: "NSW Gateway",
    type: "oauth",
    clientId: "nsw-gw-01",
    scopes: ["requests:write", "requests:read", "certificates:read"],
    expiresOn: "2027-09-30",
    status: "active",
    lastUsed: "2026-10-26T11:25:50",
  },
  {
    id: 2,
    name: "e-Licensing",
    type: "oauth",
    clientId: "customs-elic",
    scopes: ["certificates:read"],
    expiresOn: "2027-03-31",
    status: "active",
    lastUsed: "2026-10-26T11:28:30",
  },
  {
    id: 3,
    name: "ธนาคาร A (006)",
    type: "apiKey",
    clientId: "pk_live_006_••••7a21",
    scopes: ["payments:notify", "receipts:read"],
    expiresOn: "2027-01-31",
    status: "active",
    lastUsed: "2026-10-26T11:28:57",
  },
  {
    id: 4,
    name: "ธนาคาร B (014)",
    type: "apiKey",
    clientId: "pk_live_014_••••c90e",
    scopes: ["payments:notify", "receipts:read"],
    expiresOn: "2026-11-15",
    status: "expiring",
    lastUsed: "2026-10-26T11:26:33",
  },
  {
    id: 5,
    name: "NSP Alpha Network",
    type: "apiKey",
    clientId: "pk_live_nspa_••••41bd",
    scopes: ["requests:write", "requests:read"],
    expiresOn: "2027-06-30",
    status: "active",
    lastUsed: "2026-10-26T11:27:48",
  },
  {
    id: 6,
    name: "Counter Service Co.",
    type: "apiKey",
    clientId: "pk_live_cs_••••08f3",
    scopes: ["requests:read", "outbreak:read"],
    expiresOn: "2027-04-30",
    status: "active",
    lastUsed: "2026-10-26T11:29:12",
  },
  {
    id: 7,
    name: "Partner ทดสอบ (Sandbox)",
    type: "apiKey",
    clientId: "pk_test_sbx_••••ee12",
    scopes: ["requests:write"],
    expiresOn: "2026-12-31",
    status: "revoked",
    lastUsed: "2026-10-26T11:25:14",
  },
];
