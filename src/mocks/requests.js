// คำขอใบรับรองฯ ตัวอย่าง (ข้อมูลจาก Figma D07, D09 – D12) — ใช้ร่วมกันหลายหน้าจอ
// status ใช้ key ใน requestStatuses

// สถานะคำขอตาม TOR 4.4.2 (8) — tone = สี StatusBadge, step = ลำดับใน Stepper ของหน้าติดตามสถานะ (D12)
export const requestStatuses = {
  received: { label: "รับข้อมูลใบคำขอ", tone: "info", step: 0 },
  checking: { label: "ตรวจสอบข้อมูลใบคำขอ", tone: "info", step: 1 },
  invalid: { label: "ข้อมูลไม่ถูกต้อง", tone: "danger", final: true },
  pending: { label: "รอพิจารณา", tone: "warning", step: 2 },
  rejected: { label: "เจ้าหน้าที่ไม่อนุมัติ", tone: "danger", final: true },
  approved: { label: "เจ้าหน้าที่อนุมัติ", tone: "success", step: 3 },
  awaitingPayment: { label: "รอการชำระเงิน BILLPAYMENT", tone: "warning", step: 4 },
  paymentFailed: { label: "ชำระเงินไม่สำเร็จ", tone: "danger", final: true },
  paid: { label: "ได้รับการชำระเรียบร้อยแล้ว", tone: "success", step: 5 },
  issued: { label: "ระบบออกเลขที่ใบรับรองและใบเสร็จรับเงิน", tone: "success", step: 6 },
  readyToDeliver: { label: "แจ้งสถานะพร้อมจ่าย", tone: "accent", step: 7 },
  completed: { label: "เสร็จสมบูรณ์", tone: "success", step: 8 },
};

// ขั้นตอนใน Stepper ของ D12 (9 ขั้น)
export const requestSteps = [
  "รับข้อมูลใบคำขอ",
  "ตรวจสอบข้อมูล",
  "อยู่ระหว่างดำเนินการ",
  "เจ้าหน้าที่อนุมัติ",
  "รอการชำระเงิน",
  "ได้รับการชำระแล้ว",
  "ออกเลขที่ใบรับรอง",
  "แจ้งสถานะพร้อมจ่าย",
  "เสร็จสมบูรณ์",
];

// ผลตรวจอัตโนมัติ
export const autoCheck = {
  passed: { label: "ผ่าน", tone: "success" },
  flagged: (n) => ({ label: `ตรวจพบ ${n} รายการ`, tone: "warning" }),
};

const r = (ref, time, invoice, company, brand, country, items, flagged = 0, status = "pending") => ({
  ref,
  submittedAt: `2026-10-26T${time}:00+07:00`,
  invoice,
  company,
  brand,
  country,
  items,
  flagged,
  status,
});

// รายการคำขอ (D09) เรียงตามเวลาที่ยื่น เก่า → ใหม่
export const requests = [
  r("PF6910260003", "08:42", "INV-6910-1024", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "GOLDEN MANGO", "ไต้หวัน", 4, 1),
  r("PF6910260006", "09:10", "INV-6910-1031", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "THAI FRESH", "จีน", 2),
  r("PF6910260009", "09:37", "INV-6910-1038", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "JASMINE STAR", "ญี่ปุ่น", 6, 1),
  r("PF6910260012", "09:51", "INV-6910-1045", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ANDAMAN BLUE", "ฮ่องกง", 3),
  r("PF6910260015", "10:02", "INV-6910-1052", "บริษัท เชียงใหม่ ออร์แกนิค จำกัด", "CM ORGANIC", "มาเลเซีย", 1),
  r("PF6910260018", "10:15", "INV-6910-1059", "บริษัท ทรอปิคอล แพค จำกัด", "TROPIC", "สิงคโปร์", 3),
  r("PF6910260021", "10:26", "INV-6910-1066", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "RB VEGGIE", "เกาหลีใต้", 8, 1),
  r("PF6910260024", "10:31", "INV-6910-1073", "บริษัท มหาชัย โฟรเซ่น จำกัด", "SEA PRIDE", "เวียดนาม", 2),
  r("PF6910260027", "10:44", "INV-6910-1080", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "GOLDEN MANGO", "ไต้หวัน", 5),
  r("PF6910260030", "10:58", "INV-6910-1087", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "THAI FRESH", "จีน", 2),
  r("PF6910260033", "11:06", "INV-6910-1094", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "JASMINE STAR", "ญี่ปุ่น", 3),
  r("PF6910260036", "11:12", "INV-6910-1101", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ANDAMAN BLUE", "ฮ่องกง", 1),
];

// จำนวนตามแท็บสถานะใน D09
export const requestTabCounts = { all: 132, pending: 12, invalid: 3, approved: 96, rejected: 4, awaitingPayment: 7 };

// รายละเอียดคำขอฉบับเต็ม (D10 – D12) — key = Reference No.
export const requestDetails = {
  PF6910260003: {
    ref: "PF6910260003",
    submittedAt: "2026-10-26T08:42:00+07:00",
    via: "NSP: บริษัท ไทยอีดีไอ เซอร์วิส จำกัด",
    signatureValid: true,
    fee: 300,
    exporter: {
      nameTh: "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด",
      nameEn: "Siam Fruit Export Co., Ltd.",
      taxId: "0105556012345",
      branch: "00000",
      businessType: "ผู้ส่งออก",
      brand: "GOLDEN MANGO",
      invoice: "INV-6910-1024",
      invoiceDate: "2026-10-24",
    },
    agent: { name: "บริษัท แหลมฉบัง ชิปปิ้ง จำกัด", taxId: "0205559011223", branch: "00000" },
    consignee: {
      name: "Formosa Fresh Trading Co., Ltd.",
      country: "ไต้หวัน (TW)",
      countryEn: "Taiwan",
      route: "THLCH แหลมฉบัง → TWKHH Kaohsiung",
      portOfLoading: "Laem Chabang (THLCH)",
      transport: "ทางเรือ",
    },
    autoCheckedAt: "2026-10-26T08:42:00+07:00",
    items: [
      {
        nameTh: "มะม่วงน้ำดอกไม้สด",
        nameEn: "Fresh Mango (Nam Dok Mai)",
        hs: "0804.50.20",
        source: "ฉะเชิงเทรา",
        sourceEn: "Chachoengsao",
        producedAt: "2026-10-20",
        qty: "1,200 CTN",
        result: "ok",
      },
      {
        nameTh: "มะม่วงมหาชนกสด",
        nameEn: "Fresh Mango (Mahachanok)",
        hs: "0804.50.20",
        source: "ฉะเชิงเทรา",
        sourceEn: "Chachoengsao",
        producedAt: "2026-10-20",
        qty: "800 CTN",
        result: "ok",
      },
      {
        nameTh: "มังคุดสด",
        nameEn: "Fresh Mangosteen",
        hs: "0804.50.30",
        source: "จันทบุรี",
        sourceEn: "Chanthaburi",
        producedAt: "2026-10-21",
        qty: "650 CTN",
        result: "watch",
      },
      {
        nameTh: "ลำไยอบแห้ง",
        nameEn: "Dried Longan",
        hs: "0813.40.10",
        source: "เชียงใหม่",
        sourceEn: "Chiang Mai",
        producedAt: "2026-10-15",
        qty: "300 CTN",
        result: "ok",
      },
    ],
    outbreakNote: {
      item: 3,
      area: "ต.ท่าช้าง อ.เมืองจันทบุรี",
      reportedAt: "2026-10-12",
      freeAt: "2026-11-02",
    },
    documents: 3,
    // ประวัติสถานะ (D12) ใหม่ → เก่า
    history: [
      {
        status: "readyToDeliver",
        detail: "ส่งใบรับรองฯ และใบเสร็จรับเงินผ่าน NSW → Gateway → NSP สำเร็จ",
        at: "2026-10-26T10:03:12+07:00",
        by: "ระบบ",
      },
      {
        status: "issued",
        label: "ส่งข้อมูลใบรับรองฯ ไปกรมศุลกากร",
        detail: "e-Licensing ตอบรับ (ACK) Message ID 8f2c...a71e",
        at: "2026-10-26T10:02:58+07:00",
        by: "ebXML Gateway",
      },
      {
        status: "issued",
        label: "ออกเลขที่ใบรับรองและใบเสร็จ",
        detail: "ใบรับรองฯ DDC-PF 69/012845 · ใบเสร็จ R69-0104412 ลงนามดิจิทัลแล้ว",
        at: "2026-10-26T10:02:41+07:00",
        by: "ระบบ + PKI",
      },
      {
        status: "paid",
        detail: "ธนาคาร A (006) · 300.00 บาท · ช่องทาง Mobile Banking",
        at: "2026-10-26T10:02:37+07:00",
        by: "ธนาคาร",
      },
      {
        status: "awaitingPayment",
        detail: "สร้างคำสั่งชำระ Ref.1 INV-6910-1024 / Ref.2 001",
        at: "2026-10-26T09:19:03+07:00",
        by: "ระบบ",
      },
      { status: "approved", detail: "ตรวจ Checklist ครบ 6/6 ข้อ", at: "2026-10-26T09:18:47+07:00", by: "สมฤดี ใจดี" },
      {
        status: "received",
        detail: "รับจาก NSW · ลายมือชื่อดิจิทัลและ XML Schema ถูกต้อง",
        at: "2026-10-26T08:42:10+07:00",
        by: "ebXML Gateway",
      },
    ],
    // เวลาของแต่ละขั้นใน Stepper (D12) — index ตาม requestSteps
    stepTimes: ["08:42", "08:42", "09:05", "09:18", "09:19", "10:02", "10:02", "10:03"],
    currentStatus: "readyToDeliver",
    issued: { certificate: "DDC-PF 69/012845", receipt: "R69-0104412" },
  },
};
