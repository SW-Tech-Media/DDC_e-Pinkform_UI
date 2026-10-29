// ข้อมูลจำลองหน้า B-24 · ติดตามการเชื่อมโยง API (เสนอเพิ่ม — TOR 4.6.1 ส่วน API)

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

const l = (id, time, method, endpoint, client, status, ms, errorCode = "") => ({
  id,
  at: `${apiToday}T${time}`,
  method,
  endpoint,
  client,
  status,
  ms,
  errorCode,
});

export const apiLogs = [
  l(1, "11:29:41", "POST", "/api/v1/requests", "NSW Gateway", 201, 214),
  l(2, "11:29:12", "GET", "/api/v1/requests/PF6910260031/status", "Counter Service Co.", 200, 64),
  l(3, "11:28:57", "POST", "/api/v1/payments/notify", "ธนาคาร A (006)", 200, 158),
  l(4, "11:28:30", "GET", "/api/v1/certificates/DDC-PF 69/012845", "e-Licensing", 200, 92),
  l(5, "11:27:48", "POST", "/api/v1/requests", "NSP Alpha Network", 400, 41, "E1002 · XML Schema ไม่ถูกต้อง"),
  l(6, "11:27:05", "GET", "/api/v1/outbreak-areas", "Counter Service Co.", 200, 38),
  l(7, "11:26:33", "POST", "/api/v1/payments/notify", "ธนาคาร B (014)", 503, 30012, "E5003 · Upstream Timeout"),
  l(8, "11:25:50", "GET", "/api/v1/requests/PF6910260018/status", "NSW Gateway", 200, 57),
  l(9, "11:25:14", "POST", "/api/v1/requests", "Partner ทดสอบ (Sandbox)", 401, 12, "E4010 · API Key ไม่ถูกต้อง"),
  l(10, "11:24:39", "PUT", "/api/v1/requests/PF6910260025/documents", "NSP Alpha Network", 200, 386),
  l(11, "11:23:58", "GET", "/api/v1/certificates/DDC-PF 69/012799", "e-Licensing", 404, 29, "E4040 · ไม่พบเลขที่ใบรับรอง"),
  l(12, "11:23:21", "POST", "/api/v1/requests", "NSW Gateway", 201, 198),
  l(13, "11:22:47", "GET", "/api/v1/receipts/R69-0104412", "ธนาคาร A (006)", 200, 71),
  l(14, "11:21:30", "POST", "/api/v1/requests", "NSP Alpha Network", 500, 1204, "E5000 · Internal Server Error"),
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
    lastUsed: "2026-10-26T11:29:41",
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
