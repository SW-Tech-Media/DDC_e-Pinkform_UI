// ข้อความหน้า B-24 · ติดตามการเชื่อมโยง API (เสนอเพิ่ม — TOR 4.6.1 ส่วน API)

export const apiMonitorText = {
  breadcrumb: [{ title: "ผู้ดูแลระบบ" }, { title: "ติดตามการเชื่อมโยง API" }],
  title: "ติดตามการเชื่อมโยง API",
  description: "Log การเรียก REST (JSON) / SOAP (XML) จาก Partner และจัดการ API Client (API Key / OAuth 2.0)",
  actions: {
    spec: "API Specification",
    specOpened: "เปิดเอกสาร API Specification / Data Dictionary (จำลอง)",
    exportLog: "ส่งออก Log",
    exported: (n) => `ส่งออก Log การเรียก API ${n} รายการแล้ว (จำลอง)`,
    addClient: "สร้าง API Client",
  },
  kpis: {
    calls: "จำนวนเรียกวันนี้",
    successRate: "อัตราสำเร็จ",
    avg: "เวลาตอบเฉลี่ย",
    avgValue: (ms) => `${ms} ms`,
    avgCaption: "มิลลิวินาที ต่อการเรียก",
    errors: "Error วันนี้",
    errorsCaption: "4xx และ 5xx",
  },
  security: {
    title: "เชื่อมต่อผ่าน HTTPS (TLS 1.2 ขึ้นไป) เท่านั้น",
    body: "ยืนยันตัวตนด้วย API Key หรือ OAuth 2.0 (Client Credentials) · รูปแบบข้อมูลและ Error Code อ้างอิงเอกสาร API Specification และ Data Dictionary ฉบับล่าสุด",
  },
  tabs: { logs: "Log การเรียก API", clients: "API Client & Key" },
  filters: {
    search: "Endpoint / ผู้เรียก / Error Code...",
    allMethods: "ทุก Method",
    allStatuses: "ทุกสถานะ",
  },
  logHeaders: [
    { title: "วันเวลา", key: "at" },
    { title: "Method", key: "method" },
    { title: "Endpoint", key: "endpoint" },
    { title: "ผู้เรียก (Client)", key: "client" },
    { title: "สถานะ HTTP", key: "status" },
    { title: "Error Code", key: "errorCode" },
    { title: "เวลาตอบ", key: "ms", align: "end" },
    { title: "จัดการ", key: "actions", align: "center", sortable: false },
  ],
  ms: (n) => `${n.toLocaleString("th-TH")} ms`,
  slow: "ช้า",
  viewSample: "ดู Request / Response",
  noData: "ไม่พบ Log ที่ตรงกับเงื่อนไข",
  sample: {
    title: "Request / Response",
    subtitle: (method, endpoint) => `${method} ${endpoint}`,
    request: "Request",
    response: (status, ms) => `Response · HTTP ${status} · ${ms}`,
    copy: "คัดลอก JSON",
    copied: "คัดลอก Request / Response แล้ว",
  },
  clientHeaders: [
    { title: "ชื่อ Client", key: "name" },
    { title: "ประเภท", key: "type" },
    { title: "Scope", key: "scopes", sortable: false },
    { title: "วันหมดอายุ", key: "expiresOn" },
    { title: "ใช้งานล่าสุด", key: "lastUsed" },
    { title: "สถานะ", key: "status" },
    { title: "จัดการ", key: "actions", align: "center", sortable: false },
  ],
  regenerate: "ออก Key ใหม่",
  revoke: "เพิกถอน",
  confirmRevoke: {
    title: "เพิกถอนสิทธิ์ API Client?",
    message: (name) => `${name} จะเรียก API ไม่ได้ทันที คำขอที่ใช้ Key / Token เดิมจะได้รับ HTTP 401`,
    confirm: "เพิกถอน",
    done: (name) => `เพิกถอนสิทธิ์ ${name} แล้ว`,
  },
  form: {
    title: "สร้าง API Client",
    subtitle: "ระบบจะแสดง Key / Client Secret เพียงครั้งเดียวหลังสร้าง",
    name: "ชื่อ Client / หน่วยงาน",
    namePlaceholder: "เช่น NSP Beta Connect",
    type: "วิธียืนยันตัวตน",
    scopes: "Scope ที่อนุญาต",
    expiresOn: "วันหมดอายุ",
    required: "กรุณากรอกข้อมูล",
    scopeRequired: "เลือกอย่างน้อย 1 Scope",
    submit: "สร้าง Client",
  },
  keyDialog: {
    title: "บันทึก Key ของคุณ",
    subtitleNew: (name) => `สร้าง ${name} แล้ว`,
    subtitleRegen: (name) => `ออก Key ใหม่ให้ ${name} แล้ว · Key เดิมใช้ไม่ได้อีก`,
    warning: "Key นี้จะแสดงเพียงครั้งเดียว กรุณาคัดลอกและเก็บไว้ในที่ปลอดภัย หากทำหายต้องออก Key ใหม่",
    apiKey: "API Key",
    clientId: "Client ID",
    clientSecret: "Client Secret",
    tokenUrl: "Token Endpoint",
    tokenUrlValue: "https://api.ddc-pinkforms.example/oauth2/token",
    copy: "คัดลอก",
    copied: (label) => `คัดลอก ${label} แล้ว`,
    done: "บันทึกแล้ว ปิดหน้าต่าง",
  },
};

// ตัวอย่าง Request / Response (JSON) สำหรับ CodeViewer — สร้างตาม Endpoint และสถานะ
const jsonLines = (obj, indent = 0) => {
  const lines = [];
  const walk = (key, value, level, last) => {
    const prefix = key === null ? "" : `"${key}": `;
    const comma = last ? "" : ",";
    if (value && typeof value === "object") {
      const isArr = Array.isArray(value);
      const entries = isArr ? value.map((v, i) => [null, v, i]) : Object.entries(value);
      lines.push({ text: `${prefix}${isArr ? "[" : "{"}`, indent: level, accent: level === indent });
      entries.forEach(([k, v], i) => walk(isArr ? null : k, v, level + 1, i === entries.length - 1));
      lines.push({ text: `${isArr ? "]" : "}"}${comma}`, indent: level, accent: level === indent });
    } else {
      lines.push({ text: `${prefix}${JSON.stringify(value)}${comma}`, indent: level });
    }
  };
  walk(null, obj, indent, true);
  return lines;
};

// log.ref / log.body มาจาก mocks/api-monitor.js (อ้างเฉพาะเลขที่มีอยู่จริง)
export const buildApiSample = (log) => {
  const request = {
    method: log.method,
    url: `https://api.ddc-pinkforms.example${log.endpoint}`,
    headers: { Authorization: "Bearer eyJhbGciOi…", "Content-Type": "application/json", "X-Request-Id": `req-${log.id}0a7f` },
    ...(log.body && { body: log.body }),
  };
  const ok = log.status < 400;
  const response = ok
    ? { success: true, data: { ...(log.ref && { reference: log.ref }), status: log.status === 201 ? "RECEIVED" : "OK" }, timestamp: log.at }
    : { success: false, error: { code: log.errorCode.split(" · ")[0], message: log.errorCode.split(" · ")[1] }, timestamp: log.at };
  return { request: jsonLines(request), response: jsonLines(response) };
};

export const toJsonText = (lines) => lines.map((l) => `${"  ".repeat(l.indent ?? 0)}${l.text}`).join("\n");
