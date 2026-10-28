// ผู้ประกอบการตัวอย่าง (Figma D08) — ใช้กับหน้าทะเบียนผู้ประกอบการ และใช้หาเลขผู้เสียภาษี / ชื่ออังกฤษ ของคำขอใน D09
// type: key ใน operatorTypes · service: key ใน operatorServices · access: key ใน operatorAccess

export const operatorTypes = {
  exporter: { label: "ผู้ส่งออก" },
  agent: { label: "ตัวแทนออกของ" },
  counter: { label: "Counter Service" },
};

export const operatorServices = {
  certificate: { label: "ใบรับรองฯ" },
  onBehalf: { label: "ยื่นแทนผู้ส่งออก" },
};

export const operatorAccess = {
  active: { label: "ใช้งาน", tone: "success" },
  suspended: { label: "ระงับชั่วคราว", tone: "danger" },
};

const o = (taxId, branch, nameTh, nameEn, type, service, nswId, access, lastRequestAt) => ({
  id: `${taxId}-${branch}`,
  taxId,
  branch,
  nameTh,
  nameEn,
  type,
  service,
  nswId,
  access,
  lastRequestAt,
});

export const operators = [
  o("0105556012345", "00000", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "Siam Fruit Export Co., Ltd.", "exporter", "certificate", "NSW6400123", "active", "2026-10-24"),
  o("0105561098765", "00000", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "Thai Fresh Food Co., Ltd.", "exporter", "certificate", "NSW6401034", "active", "2026-10-25"),
  o("0105549033211", "00000", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "Golden Rice Trading Co., Ltd.", "exporter", "certificate", "NSW6401945", "active", "2026-10-26"),
  o("0835558004412", "00002", "บริษัท อันดามัน ซีฟู้ด จำกัด", "Andaman Seafood Co., Ltd.", "exporter", "certificate", "NSW6402856", "active", "2026-10-19"),
  o("0505563007788", "00000", "บริษัท เชียงใหม่ ออร์แกนิค จำกัด", "Chiang Mai Organic Co., Ltd.", "exporter", "certificate", "NSW6403767", "active", "2026-10-26"),
  o("0115560021140", "00000", "บริษัท ทรอปิคอล แพค จำกัด", "Tropical Pack Co., Ltd.", "agent", "onBehalf", "NSW6404678", "active", "2026-10-26"),
  o("0703554000981", "00000", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "Ratchaburi Veggie Ltd., Part.", "exporter", "certificate", "NSW6405589", "suspended", "2026-09-02"),
  o("0745557006623", "00000", "บริษัท มหาชัย โฟรเซ่น จำกัด", "Mahachai Frozen Co., Ltd.", "counter", "onBehalf", "NSW6406500", "active", "2026-10-22"),
];

// KPI ด้านบนของ D08
export const operatorKpis = {
  registered: { value: 1236, exporters: 1018 },
  agents: { value: 184, pairs: 2481 },
  pendingThnsw: { value: 5 },
  suspended: { value: 12 },
};

// ตัวนับแท็บ (จำนวนทั้งระบบ — ตารางแสดงเฉพาะตัวอย่าง)
export const operatorTabCounts = { operators: 1420 };

// รายการรอพิจารณาอนุมัติ THNSW (B-04) — ข้อมูลใหม่จาก NSW ที่ยังไม่อนุมัติ
const t = (profileId, nswId, taxId, branch, nameTh, nameEn, type, receivedAt) => ({
  id: nswId,
  profileId,
  nswId,
  taxId,
  branch,
  nameTh,
  nameEn,
  type,
  receivedAt,
  decision: null, // null = รอพิจารณา · approved · rejected
});

export const thnswPending = [
  t("PRF-690412", "NSW6406611", "0105567012458", "00000", "บริษัท บางกอก ฟรุ๊ตตี้ จำกัด", "Bangkok Fruity Co., Ltd.", "exporter", "2026-10-26T09:12:00+07:00"),
  t("PRF-690418", "NSW6406627", "0215566004321", "00000", "บริษัท ระยอง ซีฟู้ด เทรด จำกัด", "Rayong Seafood Trade Co., Ltd.", "exporter", "2026-10-26T09:48:00+07:00"),
  t("PRF-690421", "NSW6406634", "0105565098812", "00001", "บริษัท สยาม ชิปปิ้ง เอเจนซี่ จำกัด", "Siam Shipping Agency Co., Ltd.", "agent", "2026-10-26T10:05:00+07:00"),
  t("PRF-690427", "NSW6406648", "0505568001275", "00000", "บริษัท ล้านนา ฟาร์ม จำกัด", "Lanna Farm Co., Ltd.", "exporter", "2026-10-26T10:37:00+07:00"),
  t("PRF-690430", "NSW6406652", "0105568033490", "00000", "บริษัท อีซี่ เคาน์เตอร์ เซอร์วิส จำกัด", "Easy Counter Service Co., Ltd.", "counter", "2026-10-26T11:02:00+07:00"),
];

// ประวัติการแก้ไขข้อมูลผู้ประกอบการ (ใหม่ → เก่า)
export const operatorHistory = [
  {
    id: "h6",
    at: "2026-10-26T10:12:00+07:00",
    taxId: "0703554000981",
    company: "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้",
    field: "สิทธิการเข้าใช้งาน",
    from: "ใช้งาน",
    to: "ระงับชั่วคราว",
    by: "สมฤดี ใจดี",
  },
  {
    id: "h5",
    at: "2026-10-25T15:40:00+07:00",
    taxId: "0115560021140",
    company: "บริษัท ทรอปิคอล แพค จำกัด",
    field: "ประเภทบริการ",
    from: "ใบรับรองฯ",
    to: "ยื่นแทนผู้ส่งออก",
    by: "สมชาย ระวังภัย",
  },
  {
    id: "h4",
    at: "2026-10-24T11:05:00+07:00",
    taxId: "0835558004412",
    company: "บริษัท อันดามัน ซีฟู้ด จำกัด",
    field: "สาขา",
    from: "00000",
    to: "00002",
    by: "สมฤดี ใจดี",
  },
  {
    id: "h3",
    at: "2026-10-22T09:30:00+07:00",
    taxId: "0745557006623",
    company: "บริษัท มหาชัย โฟรเซ่น จำกัด",
    field: "อนุมัติ THNSW",
    from: "รอพิจารณา",
    to: "อนุมัติ",
    by: "สมฤดี ใจดี",
  },
  {
    id: "h2",
    at: "2026-10-20T14:18:00+07:00",
    taxId: "0505563007788",
    company: "บริษัท เชียงใหม่ ออร์แกนิค จำกัด",
    field: "ชื่อบริษัท (Eng)",
    from: "Chiangmai Organic Co., Ltd.",
    to: "Chiang Mai Organic Co., Ltd.",
    by: "ธนกร ศรีสุข",
  },
  {
    id: "h1",
    at: "2026-10-18T08:55:00+07:00",
    taxId: "0105549033211",
    company: "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด",
    field: "NSW Register ID",
    from: "NSW6401944",
    to: "NSW6401945",
    by: "สมชาย ระวังภัย",
  },
];
