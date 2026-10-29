// คำขอใบรับรองฯ ตัวอย่าง (ข้อมูลจาก Figma D07, D09 – D12) — ใช้ร่วมกันหลายหน้าจอ
// status ใช้ key ใน requestStatuses
import { operators, operatorTypes } from "./operators.js";
import { banks } from "./banks.js";
import { staff } from "./users.js";
import { formatMoney, formatTime } from "@/utils/format.js";

// สถานะคำขอตาม TOR 4.4.2 (8) — tone = สี StatusBadge, step = ลำดับใน Stepper ของหน้าติดตามสถานะ (D12)
// final = สถานะสิ้นสุดที่ไม่อยู่ใน Stepper (atStep = ขั้นที่คำขอหยุดอยู่)
export const requestStatuses = {
  received: { label: "รับข้อมูลใบคำขอ", tone: "info", step: 0 },
  checking: { label: "ตรวจสอบข้อมูลใบคำขอ", tone: "info", step: 1 },
  invalid: { label: "ข้อมูลไม่ถูกต้อง", tone: "danger", final: true, atStep: 1 },
  pending: { label: "รอพิจารณา", tone: "warning", step: 2 },
  rejected: { label: "เจ้าหน้าที่ไม่อนุมัติ", tone: "danger", final: true, atStep: 2 },
  approved: { label: "เจ้าหน้าที่อนุมัติ", tone: "success", step: 3 },
  awaitingPayment: { label: "รอการชำระเงิน BILLPAYMENT", tone: "warning", step: 4 },
  paymentFailed: { label: "ชำระเงินไม่สำเร็จ", tone: "danger", final: true, atStep: 4 },
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

// ค่าบริการต่อคำขอ (1 คำขอ = ใบรับรองฯ 1 ฉบับ) — ใช้ร่วมกันทุกหน้า (รายละเอียดคำขอ / การชำระเงิน / ใบเสร็จ)
// ชั่วคราวจนกว่าจะมี API — อัตราจริงรอยืนยัน (Q-17: คงที่ต่อคำขอ หรือคิดตามจำนวนรายการ) และควรตั้งค่าได้ (G-16)
export const serviceFee = 300;

// when = "HH:mm" (วันที่ 26/10/2569) หรือ "YYYY-MM-DD HH:mm"
// outcome = ผลของคำขอที่พ้นขั้นรอพิจารณาแล้ว (เวลาเป็น "YYYY-MM-DD HH:mm:ss") — ใช้สร้างประวัติสถานะ การชำระเงิน
// ใบเสร็จ และใบรับรองฯ ใน decidedDetail (mocks/payments.js, receipts.js, certificates.js อ่านจากผลนี้ทั้งหมด)
//   อนุมัติ: { by, at, bank, paidAt?, failedAt?, failReason?, cert?, receipt?, signer?, sendFailed?, completedAt? }
//   ไม่อนุมัติ: { by, at, replyCode, reply } · ข้อมูลไม่ถูกต้อง: { at, reason, signatureValid? }
// status เป็นตัวกำหนดว่าคำขอไปถึงขั้นใด: awaitingPayment = มีคำสั่งชำระ · paid = ชำระแล้ว ใบเสร็จรอลงนาม (ยังไม่มีเลขที่ใบรับรอง)
//   issued ขึ้นไป = ออกใบรับรองฯ + ใบเสร็จแล้ว (issued ที่ไม่มี sendFailed = รอส่ง e-Licensing)
const r = (ref, when, invoice, company, brand, country, items, flagged = 0, status = "pending", outcome = null) => ({
  ref,
  submittedAt: `${when.length > 5 ? when.replace(" ", "T") : `2026-10-26T${when}`}:00+07:00`,
  invoice,
  company,
  brand,
  country,
  items,
  flagged,
  status,
  outcome,
});

// รายการคำขอ (D09) เรียงตามเวลาที่ยื่น เก่า → ใหม่ — เป็นแหล่งข้อมูลเดียวของการชำระเงิน / ใบเสร็จ / ใบรับรองฯ
export const requests = [
  r("PF6910150012", "2026-10-15 08:21", "INV-6910-0733", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "THAI FRESH", "จีน", 2, 0, "completed", {
    by: "somrudee", at: "2026-10-15 08:47:30", bank: "006", paidAt: "2026-10-15 09:14:02", cert: "012703", receipt: "R69-0104268", completedAt: "2026-10-15 13:20:00",
  }),
  r("PF6910200033", "2026-10-20 12:40", "INV-6910-0802", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ANDAMAN BLUE", "ฮ่องกง", 1, 0, "completed", {
    by: "somchai", at: "2026-10-20 13:02:11", bank: "014", paidAt: "2026-10-20 13:31:23", cert: "012745", receipt: "R69-0104310", completedAt: "2026-10-21 09:05:00",
  }),
  r("PF6910240071", "2026-10-24 09:58", "INV-6910-0881", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "JASMINE STAR", "ญี่ปุ่น", 2, 0, "completed", {
    by: "somrudee", at: "2026-10-24 10:21:40", bank: "006", paidAt: "2026-10-24 10:48:47", cert: "012788", receipt: "R69-0104353", signer: "finance", completedAt: "2026-10-24 15:30:00",
  }),
  r("PF6910240085", "2026-10-24 13:22", "INV-6910-0890", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "RB VEGGIE", "เกาหลีใต้", 3, 1, "rejected", {
    by: "somchai", at: "2026-10-24 13:58:09", replyCode: "R05", reply: "แหล่งผลิตอยู่ในพื้นที่โรคระบาด",
  }),
  r("PF6910240098", "2026-10-24 15:34", "INV-6910-0904", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "RB VEGGIE", "เกาหลีใต้", 2, 0, "completed", {
    by: "somrudee", at: "2026-10-24 15:52:18", bank: "002", paidAt: "2026-10-24 16:20:29", cert: "012802", receipt: "R69-0104367", completedAt: "2026-10-25 08:40:00",
  }),
  r("PF6910250144", "2026-10-25 10:20", "INV-6910-0936", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "GOLDEN MANGO", "ไต้หวัน", 3, 0, "completed", {
    by: "somrudee", at: "2026-10-25 10:44:52", bank: "006", paidAt: "2026-10-25 11:12:05", cert: "012819", receipt: "R69-0104384", completedAt: "2026-10-25 14:10:00",
  }),
  r("PF6910250151", "2026-10-25 11:46", "INV-6910-0941", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ANDAMAN BLUE", "ฮ่องกง", 2, 0, "rejected", {
    by: "somchai", at: "2026-10-25 12:15:33", replyCode: "R04", reply: "พิกัดศุลกากร / รหัสสถิติไม่ถูกต้อง",
  }),
  r("PF6910250160", "2026-10-25 13:18", "INV-6910-0950", "บริษัท มหาชัย โฟรเซ่น จำกัด", "SEA PRIDE", "เวียดนาม", 1, 0, "completed", {
    by: "somchai", at: "2026-10-25 13:37:05", bank: "014", paidAt: "2026-10-25 14:05:40", cert: "012826", receipt: "R69-0104391", signer: "finance", completedAt: "2026-10-25 16:45:00",
  }),
  r("PF6910250166", "2026-10-25 14:40", "INV-6910-0955", "บริษัท มหาชัย โฟรเซ่น จำกัด", "SEA PRIDE", "เวียดนาม", 2, 0, "invalid", {
    at: "2026-10-25 14:40:12", reason: "XML Schema ไม่ถูกต้อง: ไม่พบ <HSCode> ของสินค้ารายการที่ 2",
  }),
  r("PF6910250172", "2026-10-25 14:52", "INV-6910-0962", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "THAI FRESH", "จีน", 2, 0, "completed", {
    by: "somrudee", at: "2026-10-25 15:10:26", bank: "006", paidAt: "2026-10-25 15:40:14", cert: "012831", receipt: "R69-0104398", signer: "finance", completedAt: "2026-10-26 09:12:00",
  }),
  r("PF6910250176", "2026-10-25 15:28", "INV-6910-0968", "บริษัท ทรอปิคอล แพค จำกัด", "TROPIC", "สิงคโปร์", 2, 0, "paymentFailed", {
    by: "somchai", at: "2026-10-25 15:49:37", bank: "002", failedAt: "2026-10-25 16:30:05",
  }),
  r("PF6910250181", "2026-10-25 16:05", "INV-6910-0985", "บริษัท ทรอปิคอล แพค จำกัด", "TROPIC", "สิงคโปร์", 2, 0, "readyToDeliver", {
    by: "somrudee", at: "2026-10-25 16:31:48", bank: "014", paidAt: "2026-10-26 08:37:26", cert: "012838", receipt: "R69-0104405",
  }),
  r("PF6910250185", "2026-10-25 16:22", "INV-6910-0991", "บริษัท เชียงใหม่ ออร์แกนิค จำกัด", "CM ORGANIC", "มาเลเซีย", 1, 0, "issued", {
    by: "somchai", at: "2026-10-25 16:40:03", bank: "006", paidAt: "2026-10-26 08:56:08", cert: "012840", receipt: "R69-0104407", sendFailed: true,
  }),
  r("PF6910250190", "2026-10-25 16:48", "INV-6910-0996", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "RB VEGGIE", "เกาหลีใต้", 4, 0, "awaitingPayment", {
    by: "somrudee", at: "2026-10-25 17:06:21", bank: "014",
  }),
  r("PF6910260001", "08:05", "INV-6910-1003", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "THAI FRESH", "จีน", 1, 0, "invalid", {
    at: "2026-10-26 08:05:11", reason: "ลายมือชื่อดิจิทัลไม่ถูกต้อง (ใบรับรองของผู้ลงนามหมดอายุ)", signatureValid: false,
  }),
  r("PF6910260002", "08:19", "INV-6910-1010", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "GOLDEN MANGO", "ไต้หวัน", 2, 0, "awaitingPayment", {
    by: "somrudee", at: "2026-10-26 08:36:44", bank: "006",
  }),
  r("PF6910260003", "08:42", "INV-6910-1024", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "GOLDEN MANGO", "ไต้หวัน", 4, 1),
  r("PF6910260006", "09:10", "INV-6910-1031", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "THAI FRESH", "จีน", 2, 0, "paid", {
    by: "somrudee", at: "2026-10-26 09:31:12", bank: "014", paidAt: "2026-10-26 10:52:14", receipt: "R69-0104415",
  }),
  r("PF6910260009", "09:37", "INV-6910-1038", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "JASMINE STAR", "ญี่ปุ่น", 6, 1),
  r("PF6910260012", "09:51", "INV-6910-1045", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ANDAMAN BLUE", "ฮ่องกง", 3, 0, "completed", {
    by: "somrudee", at: "2026-10-26 10:06:15", bank: "006", paidAt: "2026-10-26 10:18:40", cert: "012844", receipt: "R69-0104411", completedAt: "2026-10-26 10:48:00",
  }),
  r("PF6910260015", "10:02", "INV-6910-1052", "บริษัท เชียงใหม่ ออร์แกนิค จำกัด", "CM ORGANIC", "มาเลเซีย", 1, 0, "awaitingPayment", {
    by: "somchai", at: "2026-10-26 10:12:05", bank: "002",
  }),
  r("PF6910260018", "10:15", "INV-6910-1059", "บริษัท ทรอปิคอล แพค จำกัด", "TROPIC", "สิงคโปร์", 3, 0, "issued", {
    by: "somchai", at: "2026-10-26 10:24:30", bank: "002", paidAt: "2026-10-26 10:41:30", cert: "012847", receipt: "R69-0104414",
  }),
  r("PF6910260021", "10:26", "INV-6910-1066", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "RB VEGGIE", "เกาหลีใต้", 8, 1),
  r("PF6910260024", "10:31", "INV-6910-1073", "บริษัท มหาชัย โฟรเซ่น จำกัด", "SEA PRIDE", "เวียดนาม", 2, 0, "paymentFailed", {
    by: "somchai", at: "2026-10-26 10:41:20", bank: "006", failedAt: "2026-10-26 10:49:05", failReason: "ยอดเงินในบัญชีไม่เพียงพอ (รหัส 51)",
  }),
  r("PF6910260027", "10:44", "INV-6910-1080", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "GOLDEN MANGO", "ไต้หวัน", 5, 0, "awaitingPayment", {
    by: "somrudee", at: "2026-10-26 10:54:10", bank: "014",
  }),
  r("PF6910260030", "10:58", "INV-6910-1087", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "THAI FRESH", "จีน", 2),
  r("PF6910260033", "11:06", "INV-6910-1094", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "JASMINE STAR", "ญี่ปุ่น", 3),
  r("PF6910260036", "11:12", "INV-6910-1101", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ANDAMAN BLUE", "ฮ่องกง", 1),
];

// สินค้าตัวอย่างของแต่ละบริษัท — ใช้สร้างรายละเอียดคำขอ และตัวอย่างใบรับรองฯ ของรายการที่ไม่มีข้อมูลฉบับเต็ม
const p = (nameTh, nameEn, hs, source, sourceEn, qty) => ({ nameTh, nameEn, hs, source, sourceEn, qty });
export const catalogue = {
  "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด": [
    p("มะม่วงน้ำดอกไม้สด", "Fresh Mango (Nam Dok Mai)", "0804.50.20", "ฉะเชิงเทรา", "Chachoengsao", "1,000 CTN"),
    p("มังคุดสด", "Fresh Mangosteen", "0804.50.30", "จันทบุรี", "Chanthaburi", "500 CTN"),
    p("ลำไยอบแห้ง", "Dried Longan", "0813.40.10", "เชียงใหม่", "Chiang Mai", "300 CTN"),
    p("ส้มโอทองดี", "Fresh Pomelo (Thong Dee)", "0805.40.00", "นครปฐม", "Nakhon Pathom", "450 CTN"),
    p("ทุเรียนหมอนทองสด", "Fresh Durian (Monthong)", "0810.60.00", "จันทบุรี", "Chanthaburi", "600 CTN"),
  ],
  "บริษัท ไทยเฟรช ฟู้ด จำกัด": [
    p("ทุเรียนหมอนทองสด", "Fresh Durian (Monthong)", "0810.60.00", "จันทบุรี", "Chanthaburi", "900 CTN"),
    p("มะพร้าวน้ำหอม", "Aromatic Coconut", "0801.19.10", "ราชบุรี", "Ratchaburi", "1,500 CTN"),
  ],
  "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด": [
    p("ข้าวหอมมะลิ", "Thai Hom Mali Rice", "1006.30.30", "สุรินทร์", "Surin", "2,000 BAG"),
    p("ข้าวกล้องหอมมะลิ", "Brown Hom Mali Rice", "1006.20.10", "ร้อยเอ็ด", "Roi Et", "800 BAG"),
    p("ข้าวเหนียวเขี้ยวงู", "Thai Glutinous Rice (Khiao Ngu)", "1006.30.40", "เชียงราย", "Chiang Rai", "600 BAG"),
    p("ข้าวไรซ์เบอร์รี่", "Riceberry Rice", "1006.30.99", "นครปฐม", "Nakhon Pathom", "400 BAG"),
    p("ข้าวหอมปทุมธานี", "Pathum Thani Fragrant Rice", "1006.30.30", "ปทุมธานี", "Pathum Thani", "1,000 BAG"),
    p("ข้าวขาว 100%", "Thai White Rice 100%", "1006.30.99", "ตาก", "Tak", "1,500 BAG"),
  ],
  "บริษัท อันดามัน ซีฟู้ด จำกัด": [
    p("กุ้งขาวแช่แข็ง", "Frozen Vannamei Shrimp", "0306.17.19", "สุราษฎร์ธานี", "Surat Thani", "600 CTN"),
    p("ปลาหมึกแช่แข็ง", "Frozen Squid", "0307.43.10", "ภูเก็ต", "Phuket", "400 CTN"),
    p("เนื้อปูม้าพาสเจอร์ไรส์", "Pasteurized Blue Swimming Crab Meat", "1605.10.90", "ระนอง", "Ranong", "200 CTN"),
  ],
  "บริษัท เชียงใหม่ ออร์แกนิค จำกัด": [p("ผักสลัดออร์แกนิก", "Organic Lettuce", "0705.11.00", "เชียงใหม่", "Chiang Mai", "250 CTN")],
  "บริษัท ทรอปิคอล แพค จำกัด": [
    p("สับปะรดกระป๋อง", "Canned Pineapple", "2008.20.10", "ประจวบคีรีขันธ์", "Prachuap Khiri Khan", "1,200 CTN"),
    p("ข้าวโพดหวานกระป๋อง", "Canned Sweet Corn", "2005.80.00", "กาญจนบุรี", "Kanchanaburi", "700 CTN"),
    p("เงาะสอดไส้สับปะรดกระป๋อง", "Canned Rambutan Stuffed with Pineapple", "2008.99.90", "สุราษฎร์ธานี", "Surat Thani", "400 CTN"),
  ],
  "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้": [
    p("พริกสด", "Fresh Chili", "0709.60.10", "ราชบุรี", "Ratchaburi", "200 CTN"),
    p("กะเพราสด", "Fresh Holy Basil", "1211.90.99", "นครปฐม", "Nakhon Pathom", "120 CTN"),
    p("โหระพาสด", "Fresh Sweet Basil", "1211.90.99", "นครปฐม", "Nakhon Pathom", "120 CTN"),
    p("มะเขือเปราะ", "Fresh Thai Eggplant", "0709.30.00", "ราชบุรี", "Ratchaburi", "180 CTN"),
    p("ถั่วฝักยาว", "Fresh Yard-long Bean", "0708.20.00", "ราชบุรี", "Ratchaburi", "160 CTN"),
    p("ตะไคร้สด", "Fresh Lemongrass", "1211.90.99", "สุพรรณบุรี", "Suphan Buri", "150 CTN"),
    p("ข่าสด", "Fresh Galangal", "0910.99.00", "ราชบุรี", "Ratchaburi", "140 CTN"),
    p("ใบมะกรูด", "Fresh Kaffir Lime Leaves", "1211.90.99", "นครปฐม", "Nakhon Pathom", "90 CTN"),
  ],
  "บริษัท มหาชัย โฟรเซ่น จำกัด": [
    p("ปลาทูน่าแช่แข็ง", "Frozen Tuna Loin", "0304.87.00", "สมุทรสาคร", "Samut Sakhon", "500 CTN"),
    p("กุ้งแวนนาไมนึ่งแช่แข็ง", "Frozen Cooked Vannamei Shrimp", "1605.21.00", "สมุทรสาคร", "Samut Sakhon", "350 CTN"),
  ],
};

export const consignees = {
  ไต้หวัน: ["Formosa Fresh Trading Co., Ltd.", "Taiwan (TW)", "Taiwan", "THLCH แหลมฉบัง → TWKHH Kaohsiung"],
  ญี่ปุ่น: ["Tokyo Rice Wholesale K.K.", "Japan (JP)", "Japan", "THLCH แหลมฉบัง → JPTYO Tokyo"],
  ฮ่องกง: ["Ocean Mart (HK) Ltd.", "Hong Kong (HK)", "Hong Kong", "THLCH แหลมฉบัง → HKHKG Hong Kong"],
  มาเลเซีย: ["KL Organic Hub Sdn. Bhd.", "Malaysia (MY)", "Malaysia", "THSDO สะเดา → MYKUL Kuala Lumpur"],
  สิงคโปร์: ["Lion City Foods Pte. Ltd.", "Singapore (SG)", "Singapore", "THLCH แหลมฉบัง → SGSIN Singapore"],
  จีน: ["Shanghai Fresh Import Co., Ltd.", "China (CN)", "China", "THLCH แหลมฉบัง → CNSHA Shanghai"],
  เวียดนาม: ["Saigon Seafood JSC", "Vietnam (VN)", "Vietnam", "THBKK กรุงเทพ → VNSGN Ho Chi Minh"],
  เกาหลีใต้: ["Seoul Green Market Co., Ltd.", "South Korea (KR)", "South Korea", "THLCH แหลมฉบัง → KRPUS Busan"],
};

// แหล่งผลิตในพื้นที่โรคระบาด (ตรงกับ mocks/outbreak-areas.js) — ใช้กับรายการที่ตรวจพบของคำขอที่ flagged
const outbreakSources = [
  { source: "ตาก", sourceEn: "Tak", area: "ต.ท่าสายลวด อ.แม่สอด", reportedAt: "2026-10-08", freeAt: "2026-10-29" },
  { source: "ระนอง", sourceEn: "Ranong", area: "ต.ปากน้ำ อ.เมืองระนอง", reportedAt: "2026-10-21", freeAt: "2026-11-11" },
];
const agents = [
  { name: "บริษัท แหลมฉบัง ชิปปิ้ง จำกัด", taxId: "0205559011223", branch: "00000" },
  { name: "บริษัท สยาม ชิปปิ้ง เอเจนซี่ จำกัด", taxId: "0105565098812", branch: "00001" },
];
const nsps = ["NSP: บริษัท ไทยอีดีไอ เซอร์วิส จำกัด", "NSP 1 · Alpha Network", "NSP 2 · Beta Connect"];
const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));
const shiftDays = (iso, n) => new Date(new Date(iso).getTime() - n * 86400000).toISOString().slice(0, 10);

// รายละเอียดคำขอที่สร้างจากรายการคำขอ — คำขอที่รอพิจารณาไม่มีประวัติสถานะ / Stepper ฉบับเต็ม (หน้า D12 ใช้ประวัติอย่างง่ายแทน)
function generatedDetail(req, i, flaggedIndex) {
  const op = operatorByName[req.company];
  const goods = catalogue[req.company];
  const [name, country, countryEn, route] = consignees[req.country];
  const outbreak = req.flagged ? outbreakSources[flaggedIndex % outbreakSources.length] : null;
  const items = Array.from({ length: req.items }, (_, n) => {
    const watch = outbreak && n === req.items - 1;
    return {
      ...goods[n % goods.length],
      ...(watch ? { source: outbreak.source, sourceEn: outbreak.sourceEn } : {}),
      producedAt: shiftDays(req.submittedAt, 3 + (n % 3)),
      result: watch ? "watch" : "ok",
    };
  });
  return {
    ref: req.ref,
    submittedAt: req.submittedAt,
    via: nsps[i % nsps.length],
    signatureValid: true,
    fee: serviceFee,
    exporter: {
      nameTh: req.company,
      nameEn: op.nameEn,
      taxId: op.taxId,
      branch: op.branch,
      businessType: operatorTypes[op.type].label,
      brand: req.brand,
      invoice: req.invoice,
      invoiceDate: shiftDays(req.submittedAt, 2),
    },
    agent: agents[i % agents.length],
    consignee: { name, country, countryEn, route, portOfLoading: route.split(" → ")[0], transport: "ทางเรือ" },
    autoCheckedAt: req.submittedAt,
    items,
    ...(outbreak ? { outbreakNote: { item: items.length, area: outbreak.area, reportedAt: outbreak.reportedAt, freeAt: outbreak.freeAt } } : {}),
    documents: 3,
    ...(req.outcome ? decidedDetail(req) : {}),
  };
}

// เวลาทั้งหมดเก็บเป็นเวลาไทย "YYYY-MM-DDTHH:mm:ss+07:00" — slice(0, 10) จึงได้วันที่ตามเวลาไทยเสมอ (ใช้กรองรายการตามวัน)
const at = (s) => `${s.replace(" ", "T")}+07:00`;
const BKK = 7 * 3600 * 1000;
const plus = (iso, s) => `${new Date(new Date(iso).getTime() + s * 1000 + BKK).toISOString().slice(0, 19)}+07:00`;
const reached = (req, key) => (requestStatuses[req.status].step ?? -1) >= requestStatuses[key].step;

// คำขอที่พ้นขั้นรอพิจารณาแล้ว: ผลการพิจารณา (decision) + ประวัติสถานะ (ใหม่ → เก่า) + เวลาใน Stepper
// + คำสั่งชำระ (payment) / ใบเสร็จ (receipt) / ใบรับรองฯ (issued) ตามขั้นที่คำขอไปถึง
function decidedDetail(req) {
  const o = req.outcome;
  const log = [{ status: "received", detail: "รับจาก NSW · ลายมือชื่อดิจิทัลและ XML Schema ถูกต้อง", at: plus(req.submittedAt, 10), by: "ebXML Gateway" }];
  const add = (status, detail, time, by, label) => log.push({ status, ...(label ? { label } : {}), detail, at: time, by });
  let decision;
  let payment = null;
  let receipt = null;
  let issued = null;

  if (req.status === "invalid") {
    log[0].detail = "รับจาก NSW";
    add("invalid", `${o.reason} · แจ้งผู้ประกอบการผ่าน NSW`, at(o.at), "ebXML Gateway");
    decision = { type: "invalid", at: at(o.at), by: "ebXML Gateway", note: o.reason };
  } else {
    const by = staff[o.by].name;
    const decidedAt = at(o.at);
    add("checking", req.flagged ? `ตรวจสอบอัตโนมัติ · พบ ${req.flagged} รายการที่ต้องตรวจสอบ` : "ตรวจสอบอัตโนมัติ · ผ่านทุกรายการ", plus(req.submittedAt, 14), "ระบบ");
    add("pending", "เจ้าหน้าที่เปิดพิจารณาคำขอ", plus(decidedAt, -540), by, "อยู่ระหว่างดำเนินการ");
    if (req.status === "rejected") {
      add("rejected", `ข้อความตอบกลับ ${o.replyCode} – ${o.reply}`, decidedAt, by);
      decision = { type: "rejected", at: decidedAt, by, replyCode: o.replyCode, note: "" };
    } else {
      const bank = `${banks[o.bank]} (${o.bank})`;
      const orderedAt = plus(decidedAt, 16);
      add("approved", "ตรวจ Checklist ครบ 6/6 ข้อ", decidedAt, by);
      add("awaitingPayment", `สร้างคำสั่งชำระ Ref.1 ${req.invoice} / Ref.2 001`, orderedAt, "ระบบ");
      payment = { orderedAt, bankCode: o.bank, amount: serviceFee, status: "pending" };
      if (req.status === "paymentFailed") {
        add("paymentFailed", `${bank} · ชำระไม่สำเร็จ · แจ้งผู้ประกอบการผ่าน NSW`, at(o.failedAt), "ธนาคาร");
        Object.assign(payment, { status: "failed", failedAt: at(o.failedAt), ...(o.failReason ? { failReason: o.failReason } : {}) });
      }
      if (reached(req, "paid")) {
        const paidAt = at(o.paidAt);
        add("paid", `${bank} · ${formatMoney(serviceFee)} บาท · ช่องทาง Mobile Banking`, paidAt, "ธนาคาร");
        Object.assign(payment, { status: "paid", paidAt });
        // ใบเสร็จออกพร้อมการรับชำระ — คำขอที่ยังอยู่ขั้น "ชำระแล้ว" คือใบเสร็จรอลงนามดิจิทัล
        receipt = { no: o.receipt, issuedAt: plus(paidAt, 4), signer: o.signer ?? "wipawan", signed: reached(req, "issued") };
      }
      if (reached(req, "issued")) {
        const issuedAt = plus(at(o.paidAt), 4);
        const eLicensing = o.sendFailed ? "failed" : req.status === "issued" ? "pending" : "sent";
        add("issued", `ใบรับรองฯ DDC-PF 69/${o.cert} · ใบเสร็จ ${o.receipt} ลงนามดิจิทัลแล้ว`, issuedAt, "ระบบ + PKI", "ออกเลขที่ใบรับรองและใบเสร็จ");
        const sendDetail = {
          failed: "e-Licensing ไม่ตอบรับ (Timeout) · รอส่งใหม่อัตโนมัติ",
          pending: "อยู่ในคิวส่งข้อมูลไป e-Licensing",
          sent: "e-Licensing ตอบรับ (ACK)",
        }[eLicensing];
        add("issued", sendDetail, plus(issuedAt, 17), "ebXML Gateway", "ส่งข้อมูลใบรับรองฯ ไปกรมศุลกากร");
        issued = { certificate: `DDC-PF 69/${o.cert}`, receipt: o.receipt, at: issuedAt, eLicensing };
      }
      if (reached(req, "readyToDeliver")) {
        add("readyToDeliver", "ส่งใบรับรองฯ และใบเสร็จรับเงินผ่าน NSW → Gateway → NSP สำเร็จ", plus(at(o.paidAt), 35), "ระบบ");
      }
      if (req.status === "completed") add("completed", "ผู้ประกอบการรับใบรับรองฯ และใบเสร็จรับเงินแล้ว", at(o.completedAt), "NSP");
      decision = { type: "approved", at: decidedAt, by, replyCode: "R01", note: "" };
    }
  }

  // เวลาของแต่ละขั้นใน Stepper — เวลาแรกที่ไปถึงขั้นนั้น
  const stepTimes = [];
  log.forEach((e) => {
    const step = requestStatuses[e.status].step;
    if (step !== undefined && !stepTimes[step]) stepTimes[step] = formatTime(e.at);
  });
  return {
    signatureValid: o.signatureValid ?? true,
    decision,
    history: log.reverse(),
    stepTimes: Array.from({ length: requestSteps.length }, (_, n) => stepTimes[n] ?? ""),
    ...(o.bank ? { bankCode: o.bank } : {}),
    ...(payment ? { payment } : {}),
    ...(receipt ? { receipt } : {}),
    ...(issued ? { issued } : {}),
  };
}

// รายละเอียดคำขอฉบับเต็ม (D10 – D12) — key = Reference No.
// PF6910260003 เขียนไว้ครบตาม Figma D10 (คำขอรอพิจารณา) ส่วนคำขออื่นสร้างจาก requests
// Figma D12 ใช้เลขเดียวกันในสถานะ "แจ้งสถานะพร้อมจ่าย" — Prototype ยึดสถานะรอพิจารณาตาม D10 ให้ทุกหน้าตรงกัน
// ตัวอย่าง D12 ที่มีประวัติครบดูที่ PF6910250181 (พร้อมจ่าย) / PF6910260012 (เสร็จสมบูรณ์)
const figmaDetails = {
  PF6910260003: {
    ref: "PF6910260003",
    submittedAt: "2026-10-26T08:42:00+07:00",
    via: "NSP: บริษัท ไทยอีดีไอ เซอร์วิส จำกัด",
    signatureValid: true,
    fee: serviceFee,
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
  },
};

let flaggedCount = 0;
export const requestDetails = {
  ...Object.fromEntries(requests.map((r, i) => [r.ref, generatedDetail(r, i, r.flagged ? flaggedCount++ : 0)])),
  ...figmaDetails,
};
