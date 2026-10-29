// ข้อมูลจำลองหน้า B-25 · ส่งข้อมูลระบบงานภายใน DDC (Back Office เดิม) — เสนอเพิ่ม (TOR 7.8.38, 8.3)
// รายการส่งสร้างจากคำขอที่ออกใบรับรองฯ + ใบเสร็จ (ลงนามแล้ว) ใน mocks/requests.js — เลขที่เอกสาร / คำขอ / เลขอ้างอิงชำระมีอยู่จริงทุกรายการ
// ชั่วคราวจนกว่าจะมี API: backend เป็นผู้ส่งผ่าน Web Service และเก็บผลการส่ง
import { banks } from "./banks.js";
import { operators } from "./operators.js";
import { receiptSigners } from "./receipts.js";
import { paymentRefOf, requestDetails, requests, serviceFee } from "./requests.js";
import { staff } from "./users.js";
import { formatDate, formatMoney } from "@/utils/format.js";

export const syncToday = "2026-10-26";
export const syncNow = "2026-10-26T11:30:00";

export const syncDocTypes = {
  certificate: { label: "ใบรับรองฯ", tone: "info" },
  receipt: { label: "ใบเสร็จรับเงิน", tone: "accent" },
};

export const syncStatuses = {
  success: { label: "สำเร็จ", tone: "success" },
  pending: { label: "รอส่ง", tone: "info" },
  error: { label: "ผิดพลาด", tone: "danger" },
};

// สถานะ Web Service ไปยัง Back Office เดิม
export const webService = {
  online: true,
  endpoint: "https://backoffice.ddc.example/ws/PinkformService?wsdl",
  protocol: "SOAP 1.2 · HTTPS (TLS 1.2)",
  lastHeartbeat: "2026-10-26T11:29:30",
  latencyMs: 148,
  queue: 3,
};

const BKK = 7 * 3600 * 1000;
const plus = (iso, sec) => `${new Date(new Date(iso).getTime() + sec * 1000 + BKK).toISOString().slice(0, 19)}+07:00`;
const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));

// ผลการส่งที่ไม่ใช่ "สำเร็จ ครั้งแรก" (key = เลขที่เอกสาร) — ตัวอย่างสถานะ ผิดพลาด / รอส่ง / ส่งซ้ำสำเร็จ
const outcomes = {
  "DDC-PF 69/012847": { status: "pending", attempts: 0, message: "อยู่ในคิว รอส่งรอบถัดไป 11:30" },
  "R69-0104414": { status: "pending", attempts: 0, message: "อยู่ในคิว รอส่งรอบถัดไป 11:30" },
  "DDC-PF 69/012844": { status: "error", attempts: 3, message: "SOAP Fault: ORA-00001 รหัสผู้ประกอบการซ้ำในระบบเดิม" },
  "DDC-PF 69/012840": { status: "success", attempts: 2, message: "ส่งซ้ำสำเร็จ (ครั้งแรก Timeout)" },
  "R69-0104407": { status: "error", attempts: 2, message: "Timeout 30 วินาที — Back Office ไม่ตอบกลับ" },
};

// ค่าที่ส่งไป Back Office (ใช้ใน Dialog ตรวจความถูกต้อง) — ตามรายละเอียดคำขอ / การชำระเงิน
const certificateValues = (r, d) => {
  const first = d.items[0];
  return {
    operator: r.company,
    taxId: operatorByName[r.company]?.taxId ?? d.exporter.taxId,
    product: `${first.hs} · ${first.nameTh}${d.items.length > 1 ? ` และอีก ${d.items.length - 1} รายการ` : ""}`,
    destination: d.consignee.country,
    issuedOn: formatDate(d.issued.at),
    signer: staff.wipawan.name,
  };
};
const receiptValues = (r, d) => ({
  operator: r.company,
  taxId: operatorByName[r.company]?.taxId ?? d.exporter.taxId,
  amount: formatMoney(serviceFee),
  bank: `${banks[d.payment.bankCode]} (${d.payment.bankCode})`,
  paidOn: formatDate(d.payment.paidAt),
  signer: receiptSigners[d.receipt.signer].name,
});

// ใหม่ → เก่า · ส่งหลังออกใบรับรองฯ + ใบเสร็จ ราว 40 วินาที (ใบรับรองฯ ก่อน ใบเสร็จตาม)
let boRef = 88300;
export const syncItems = requests
  .filter((r) => requestDetails[r.ref].issued)
  .flatMap((r) => {
    const d = requestDetails[r.ref];
    const at = plus(d.issued.at, 40);
    const item = (docType, docNo, reference, values) => {
      const o = outcomes[docNo] ?? { status: "success", attempts: 1 };
      boRef += 1;
      return {
        id: docNo,
        at,
        docType,
        docNo,
        reference,
        requestRef: r.ref,
        status: o.status,
        attempts: o.attempts,
        message: o.message ?? `บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-${boRef})`,
        values,
      };
    };
    return [
      item("certificate", d.issued.certificate, r.ref, certificateValues(r, d)),
      item("receipt", d.receipt.no, paymentRefOf(r.ref), receiptValues(r, d)),
    ];
  })
  .sort((a, b) => b.at.localeCompare(a.at) || (a.docType === "certificate" ? -1 : 1));

// ฟิลด์ที่ใช้ตรวจความถูกต้อง เทียบ DDC e-Pinkforms กับ Back Office เดิม
// ระบุค่า Back Office ที่ไม่ตรง (mismatch) ต่อเลขที่เอกสาร — นอกนั้นถือว่าตรงกัน
export const checkFields = {
  certificate: [
    { key: "docNo", label: "เลขที่ใบรับรองฯ" },
    { key: "reference", label: "เลขที่คำขอ" },
    { key: "operator", label: "ผู้ประกอบการ" },
    { key: "taxId", label: "เลขประจำตัวผู้เสียภาษี" },
    { key: "product", label: "สินค้า (HS Code)" },
    { key: "destination", label: "ประเทศปลายทาง" },
    { key: "issuedOn", label: "วันที่ออก" },
    { key: "signer", label: "ผู้ลงนาม" },
  ],
  receipt: [
    { key: "docNo", label: "เลขที่ใบเสร็จ" },
    { key: "reference", label: "เลขที่อ้างอิงการชำระ" },
    { key: "operator", label: "ผู้ชำระเงิน" },
    { key: "taxId", label: "เลขประจำตัวผู้เสียภาษี" },
    { key: "amount", label: "จำนวนเงิน (บาท)" },
    { key: "bank", label: "ธนาคาร" },
    { key: "paidOn", label: "วันที่ชำระ" },
  ],
};

export const mismatches = {
  "DDC-PF 69/012844": { operator: "บจก. อันดามัน ซีฟู้ด", taxId: "—" },
  "R69-0104407": { amount: "—" },
};
