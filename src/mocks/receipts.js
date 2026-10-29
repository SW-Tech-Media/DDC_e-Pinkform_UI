// ข้อมูลจำลองหน้า B-12 · ใบเสร็จรับเงิน (TOR 4.4.4 (2)(3)) — เลขที่อ้างอิง / Ref. / ธนาคาร ตาม mocks/payments.js
// เลขผู้เสียภาษี / ชื่ออังกฤษ ตาม mocks/operators.js · status ใช้ key ใน receiptStatuses · signer ใช้ key ใน receiptSigners
import { operators } from "./operators.js";
import { staff } from "./users.js";

export const receiptToday = "2026-10-26";

export const receiptStatuses = {
  signed: { label: "ลงนามแล้ว", tone: "success" },
  pending: { label: "รอลงนาม", tone: "warning" },
  cancelled: { label: "ยกเลิก", tone: "neutral" },
};

// ผู้มีอำนาจลงนาม + ใบรับรองลายมือชื่อดิจิทัล (serial ตาม mocks/pki.js)
export const receiptSigners = {
  wipawan: { name: staff.wipawan.name, position: "ผู้อำนวยการกองโรคติดต่อทั่วไป", serial: "7B:11:E4:5D" },
  finance: { name: "สุนันทา ศรีวงศ์", position: "หัวหน้ากลุ่มงานการเงินและบัญชี", serial: "7B:11:E4:6A" },
};

export const receiptKpis = [
  { key: "today", icon: "fas fa-file-invoice-dollar", tone: "teal", label: "ใบเสร็จที่ออกวันนี้", value: 41, caption: "ลงนามดิจิทัลแล้ว 40 ฉบับ" },
  { key: "amount", icon: "far fa-credit-card", tone: "green", label: "ยอดเงินวันนี้ (บาท)", money: 12600, caption: "ตรงกับยอดรับชำระ" },
  { key: "month", icon: "far fa-calendar", tone: "blue", label: "ใบเสร็จเดือนนี้", value: 1286, caption: "ยอดรวม 385,800.00 บาท" },
  { key: "pending", icon: "far fa-clock", tone: "amber", label: "รอลงนาม", value: 1, caption: "ลงนามอัตโนมัติภายใน 5 นาที" },
];

export const receiptFee = 300; // ค่าธรรมเนียมต่อใบรับรองฯ (บาท)

const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));

const rc = (receiptNo, issuedAt, reference, company, requestNo, ref1, ref2, bankCode, amount, signer, status = "signed", certificateNo = "") => ({
  id: receiptNo,
  receiptNo,
  issuedAt,
  reference,
  company,
  companyEn: operatorByName[company]?.nameEn ?? "",
  taxId: operatorByName[company]?.taxId ?? "",
  branch: operatorByName[company]?.branch ?? "00000",
  requestNo,
  ref1,
  ref2,
  bankCode,
  amount,
  signer,
  status,
  certificateNo,
});

// ใหม่ → เก่า
export const receipts = [
  rc("R69-0104415", "2026-10-26T11:02:18", "PAY6910260043", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "PF6910260006", "INV-6910-1031", "001", "014", 300, "wipawan", "pending"),
  rc("R69-0104414", "2026-10-26T10:21:30", "PAY6910260037", "บริษัท ทรอปิคอล แพค จำกัด", "PF6910260018", "INV-6910-1059", "001", "002", 300, "wipawan", "signed", "DDC-PF 69/012847"),
  rc("R69-0104412", "2026-10-26T10:02:41", "PAY6910260028", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "PF6910260003", "INV-6910-1024", "001", "006", 300, "wipawan", "signed", "DDC-PF 69/012845"),
  rc("R69-0104411", "2026-10-26T09:58:40", "PAY6910260034", "บริษัท อันดามัน ซีฟู้ด จำกัด", "PF6910260012", "INV-6910-1045", "001", "006", 300, "wipawan", "signed", "DDC-PF 69/012844"),
  rc("R69-0104410", "2026-10-26T09:44:30", "PAY6910260031", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "PF6910260009", "INV-6910-1038", "002", "014", 900, "wipawan", "signed", "DDC-PF 69/012843"),
  rc("R69-0104407", "2026-10-26T08:55:20", "PAY6910260022", "บริษัท เชียงใหม่ ออร์แกนิค จำกัด", "PF6910250185", "INV-6910-0991", "001", "002", 600, "wipawan", "signed", "DDC-PF 69/012840"),
  rc("R69-0104405", "2026-10-26T08:36:20", "PAY6910260019", "บริษัท ทรอปิคอล แพค จำกัด", "PF6910250181", "INV-6910-0985", "003", "014", 300, "wipawan", "signed", "DDC-PF 69/012838"),
  rc("R69-0104398", "2026-10-25T15:39:52", "PAY6910250166", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "PF6910250172", "INV-6910-0962", "001", "006", 600, "finance", "signed", "DDC-PF 69/012831"),
  rc("R69-0104395", "2026-10-25T14:58:03", "PAY6910250163", "บริษัท มหาชัย โฟรเซ่น จำกัด", "PF6910250164", "INV-6910-0955", "001", "006", 300, "finance", "cancelled"),
  rc("R69-0104391", "2026-10-25T14:05:21", "PAY6910250158", "บริษัท มหาชัย โฟรเซ่น จำกัด", "PF6910250160", "INV-6910-0950", "001", "002", 300, "finance", "signed", "DDC-PF 69/012826"),
  rc("R69-0104384", "2026-10-25T11:11:47", "PAY6910250139", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "PF6910250144", "INV-6910-0936", "001", "014", 900, "wipawan", "signed", "DDC-PF 69/012819"),
  rc("R69-0104367", "2026-10-24T16:20:10", "PAY6910240094", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "PF6910240098", "INV-6910-0904", "001", "002", 600, "wipawan", "signed", "DDC-PF 69/012802"),
  rc("R69-0104353", "2026-10-24T10:48:29", "PAY6910240068", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "PF6910240071", "INV-6910-0881", "001", "006", 600, "finance", "signed", "DDC-PF 69/012788"),
];
