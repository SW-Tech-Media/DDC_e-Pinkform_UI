// ข้อมูลจำลองหน้า B-04 · พิจารณาอนุมัติ THNSW (เสริมจาก thnswPending ใน mocks/operators.js — ห้ามแก้ไฟล์นั้น)
// รายการรอพิจารณามาจาก operators.js แล้วเติมรายละเอียดคำขอขึ้นทะเบียนจาก NSW (บริษัท / NSP / ผลตรวจ ebXML)
import { thnswPending } from "./operators.js";
import { messageTypes, nspServiceCodes } from "./message-types.js";

export const thnswToday = "2026-10-26";
export const thnswNow = "2026-10-26T14:20:00+07:00";

// ผู้ให้บริการ NSP ที่ผู้ประกอบการเลือกใช้ส่งข้อมูลผ่าน NSW
export const nspProviders = {
  netbay: { name: "บริษัท เน็ตเบย์ จำกัด (มหาชน)", code: "NSP-NETBAY" },
  tradesiam: { name: "บริษัท เทรดสยาม จำกัด", code: "NSP-TRADESIAM" },
  inet: { name: "บริษัท อินเทอร์เน็ตประเทศไทย จำกัด (มหาชน)", code: "NSP-INET" },
  cat: { name: "บริษัท โทรคมนาคมแห่งชาติ จำกัด (มหาชน)", code: "NSP-NT" },
};

// บริการ (ข้อความ ebXML) ที่ขอใช้ผ่าน NSP — key = ชื่อข้อความตาม Flow 10 / 11 ชุดเดียวกับหน้า B-17 (mocks/message-types.js)
// ชั่วคราวจนกว่าจะมี API: ชื่อข้อความที่ใช้จริงกับ NSW รอยืนยัน (Q-10)
const serviceLabels = {
  DDCPFREQ: "ยื่นคำขอใบรับรองฯ",
  DDCPFREQ_ACCEPT: "รับสถานะคำขอ (ผลพิจารณา / แจ้งชำระ / ปิดคำขอ)",
  DDCRECEIPT: "รับใบเสร็จรับเงิน",
  DDCPINKFORM: "รับใบรับรองฯ อิเล็กทรอนิกส์",
};
export const nspServices = Object.fromEntries(nspServiceCodes.map((code) => [messageTypes[code].code, serviceLabels[code]]));

const check = (signature, schema, extra = {}) => ({
  signature: {
    pass: signature,
    issuer: "Thai Digital ID CA (TDID)",
    serial: extra.serial ?? "4F:21:9A:0C:7E:13",
    validTo: extra.validTo ?? "2028-03-31",
    note: extra.signatureNote ?? "",
  },
  schema: { pass: schema, version: "DDC-REG-1.2.xsd", note: extra.schemaNote ?? "" },
  messageId: extra.messageId,
});

// รายละเอียดคำขอขึ้นทะเบียน (key = NSW Register ID)
const details = {
  NSW6406611: {
    registeredOn: "2018-05-14",
    capital: "5,000,000",
    address: "99/12 ถนนพระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพมหานคร 10150",
    contact: { name: "นางสาวพิมพ์ชนก วงศ์ไทย", email: "export@bkkfruity.co.th", phone: "02-415-7788" },
    nsp: [{ provider: "netbay", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT", "DDCPINKFORM"], since: "2026-10-25" }],
    checks: check(true, true, { messageId: "NSW-REG-20261026-0911-6611" }),
  },
  NSW6406627: {
    registeredOn: "2021-02-03",
    capital: "10,000,000",
    address: "45 หมู่ 3 ตำบลเนินพระ อำเภอเมืองระยอง จังหวัดระยอง 21000",
    contact: { name: "นายวีระพงษ์ ทะเลงาม", email: "admin@rayongseafood.co.th", phone: "038-611-245" },
    nsp: [{ provider: "tradesiam", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT"], since: "2026-10-24" }],
    checks: check(true, true, { serial: "3A:88:01:B2:5D:90", messageId: "NSW-REG-20261026-0947-6627" }),
  },
  NSW6406634: {
    registeredOn: "2015-09-21",
    capital: "2,000,000",
    address: "1/88 ถนนเจริญกรุง แขวงยานนาวา เขตสาทร กรุงเทพมหานคร 10120",
    contact: { name: "นายธีรวัฒน์ แสงทอง", email: "customs@siamshipping.co.th", phone: "02-676-3400" },
    nsp: [
      { provider: "netbay", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT"], since: "2026-10-20" },
      { provider: "inet", services: ["DDCRECEIPT", "DDCPINKFORM"], since: "2026-10-22" },
    ],
    checks: check(true, true, { serial: "7C:02:E4:19:AB:61", messageId: "NSW-REG-20261026-1004-6634" }),
  },
  NSW6406648: {
    registeredOn: "2025-11-11",
    capital: "1,000,000",
    address: "212 หมู่ 5 ตำบลแม่เหียะ อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50100",
    contact: { name: "นางอรวรรณ คำแสน", email: "lannafarm.export@gmail.com", phone: "053-121-998" },
    nsp: [{ provider: "cat", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT", "DDCPINKFORM"], since: "2026-10-26" }],
    checks: check(true, true, {
      serial: "1B:6F:3C:D0:22:7A",
      validTo: "2026-12-15",
      signatureNote: "ใบรับรองลายมือชื่อจะหมดอายุภายใน 50 วัน",
      messageId: "NSW-REG-20261026-1036-6648",
    }),
  },
  NSW6406652: {
    registeredOn: "2024-07-01",
    capital: "3,000,000",
    address: "77/5 ถนนวิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900",
    contact: { name: "นายณัฐพล ศรีอ่อน", email: "ops@easycounter.co.th", phone: "02-019-5566" },
    nsp: [{ provider: "inet", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT"], since: "2026-10-26" }],
    checks: check(true, false, {
      serial: "62:D9:0E:41:F3:08",
      schemaNote: "ไม่พบ element <ContactEmail> ในส่วน Registrant (บรรทัด 48)",
      messageId: "NSW-REG-20261026-1101-6652",
    }),
  },
};

// รายการรอพิจารณา = thnswPending + รายละเอียด
export const thnswRequests = thnswPending.map((p) => ({ ...p, ...details[p.nswId] }));

// รายการที่พิจารณาแล้ว (อนุมัติ / ไม่อนุมัติ) — access / service = สิทธิ์และประเภทบริการที่กำหนดตอนอนุมัติ
const decided = (base, decision, decidedAt, decidedBy, extra) => ({
  ...base,
  decision,
  decidedAt,
  decidedBy,
  ...extra,
});
const req = (profileId, nswId, taxId, branch, nameTh, nameEn, type, receivedAt, more) => ({
  id: nswId,
  profileId,
  nswId,
  taxId,
  branch,
  nameTh,
  nameEn,
  type,
  receivedAt,
  ...more,
});

export const thnswDecided = [
  decided(
    req("PRF-690401", "NSW6406588", "0105566045812", "00000", "บริษัท สุวรรณภูมิ ออร์คิด จำกัด", "Suvarnabhumi Orchid Co., Ltd.", "exporter", "2026-10-25T15:22:00+07:00", {
      registeredOn: "2023-03-08",
      capital: "4,000,000",
      address: "18 หมู่ 7 ตำบลราชาเทวะ อำเภอบางพลี จังหวัดสมุทรปราการ 10540",
      contact: { name: "นางสาวสุภาวดี ทองคำ", email: "export@svborchid.co.th", phone: "02-134-2290" },
      nsp: [{ provider: "netbay", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT", "DDCPINKFORM"], since: "2026-10-24" }],
      checks: check(true, true, { serial: "0D:44:A7:31:9E:02", messageId: "NSW-REG-20261025-1521-6588" }),
    }),
    "approved",
    "2026-10-26T09:05:00+07:00",
    "สมฤดี ใจดี",
    { access: "active", service: "certificate" }
  ),
  decided(
    req("PRF-690405", "NSW6406595", "0745565010236", "00000", "บริษัท มหาชัย ซีฟู้ด เอ็กซ์เพรส จำกัด", "Mahachai Seafood Express Co., Ltd.", "exporter", "2026-10-25T16:10:00+07:00", {
      registeredOn: "2022-06-17",
      capital: "8,000,000",
      address: "55/9 หมู่ 2 ตำบลท่าทราย อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000",
      contact: { name: "นายสมบัติ ปลาทอง", email: "info@mhcseafood.co.th", phone: "034-810-772" },
      nsp: [{ provider: "tradesiam", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT"], since: "2026-10-23" }],
      checks: check(true, true, { serial: "5E:19:B3:70:C4:2F", messageId: "NSW-REG-20261025-1609-6595" }),
    }),
    "approved",
    "2026-10-26T10:48:00+07:00",
    "สมชาย ระวังภัย",
    { access: "active", service: "certificate" }
  ),
  decided(
    req("PRF-690388", "NSW6406561", "0105564077120", "00003", "บริษัท แหลมฉบัง โลจิสติกส์ จำกัด", "Laem Chabang Logistics Co., Ltd.", "agent", "2026-10-24T11:40:00+07:00", {
      registeredOn: "2021-08-30",
      capital: "6,000,000",
      address: "300/12 หมู่ 3 ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 20230",
      contact: { name: "นางสาวกมลชนก ศรีวงศ์", email: "broker@lcblogistics.co.th", phone: "038-490-115" },
      nsp: [{ provider: "netbay", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT"], since: "2026-10-21" }],
      checks: check(true, true, { serial: "29:7B:EE:04:16:D8", messageId: "NSW-REG-20261024-1139-6561" }),
    }),
    "approved",
    "2026-10-25T13:15:00+07:00",
    "สมฤดี ใจดี",
    { access: "active", service: "onBehalf" }
  ),
  decided(
    req("PRF-690372", "NSW6406540", "0905562003318", "00000", "บริษัท หาดใหญ่ รับเบอร์ แอนด์ ฟรุ๊ต จำกัด", "Hat Yai Rubber & Fruit Co., Ltd.", "exporter", "2026-10-23T08:55:00+07:00", {
      registeredOn: "2019-01-22",
      capital: "12,000,000",
      address: "141 ถนนกาญจนวนิช ตำบลคอหงส์ อำเภอหาดใหญ่ จังหวัดสงขลา 90110",
      contact: { name: "นายอับดุลเลาะ หมัดสะและ", email: "export@hyrf.co.th", phone: "074-212-860" },
      nsp: [{ provider: "cat", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT", "DDCPINKFORM"], since: "2026-10-20" }],
      checks: check(true, true, { serial: "48:C2:5A:9F:01:E3", messageId: "NSW-REG-20261023-0854-6540" }),
    }),
    "approved",
    "2026-10-24T10:02:00+07:00",
    "สมชาย ระวังภัย",
    { access: "active", service: "certificate" }
  ),
  decided(
    req("PRF-690415", "NSW6406619", "0105568040021", "00000", "บริษัท ฟาสต์ เทรด ทู ยู จำกัด", "Fast Trade 2 U Co., Ltd.", "agent", "2026-10-26T09:30:00+07:00", {
      registeredOn: "2025-12-01",
      capital: "1,000,000",
      address: "8/2 ซอยลาดพร้าว 71 แขวงสะพานสอง เขตวังทองหลาง กรุงเทพมหานคร 10310",
      contact: { name: "นายภาคิน ทองมา", email: "fasttrade2u@hotmail.com", phone: "08-1234-5521" },
      nsp: [{ provider: "inet", services: ["DDCPFREQ"], since: "2026-10-26" }],
      checks: check(false, true, {
        serial: "11:00:9C:7D:EA:45",
        validTo: "2026-09-30",
        signatureNote: "ใบรับรองลายมือชื่อหมดอายุแล้ว (30/09/2569)",
        messageId: "NSW-REG-20261026-0929-6619",
      }),
    }),
    "rejected",
    "2026-10-26T11:20:00+07:00",
    "สมฤดี ใจดี",
    { reason: "ใบรับรองลายมือชื่อดิจิทัลหมดอายุ กรุณาต่ออายุใบรับรองแล้วส่งคำขอขึ้นทะเบียนใหม่ผ่าน NSW" }
  ),
  decided(
    req("PRF-690396", "NSW6406577", "0215560008874", "00000", "บริษัท ระยอง ฟรุ๊ต แลนด์ จำกัด", "Rayong Fruit Land Co., Ltd.", "exporter", "2026-10-24T14:05:00+07:00", {
      registeredOn: "2017-04-12",
      capital: "3,500,000",
      address: "9 หมู่ 1 ตำบลตะพง อำเภอเมืองระยอง จังหวัดระยอง 21000",
      contact: { name: "นางมาลัย สวนผล", email: "fruitland.ry@gmail.com", phone: "038-655-101" },
      nsp: [{ provider: "tradesiam", services: ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT"], since: "2026-10-22" }],
      checks: check(true, true, { serial: "6A:3E:10:BC:57:94", messageId: "NSW-REG-20261024-1404-6577" }),
    }),
    "rejected",
    "2026-10-25T09:40:00+07:00",
    "สมชาย ระวังภัย",
    { reason: "ขึ้นทะเบียนซ้ำ — เลขประจำตัวผู้เสียภาษีและสาขานี้มีในทะเบียนผู้ประกอบการแล้ว" }
  ),
];

