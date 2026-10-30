// ข้อมูลจำลองหน้า D13 · ติดตามการชำระเงิน (ตาม Figma node 19:3539)
// รายการชำระสร้างจากคำขอที่เจ้าหน้าที่อนุมัติแล้ว (requestDetails[ref].payment) — ไม่มีรายการที่อ้างคำขอที่ไม่มีอยู่
// หน้าจออ่านผ่าน usePaymentsStore().all ซึ่งรวมคำสั่งชำระที่เกิดจากการอนุมัติในรอบนี้ด้วย
// ชั่วคราวจนกว่าจะมี API: backend เป็นผู้สร้างคำสั่งชำระเมื่ออนุมัติ และรับผลชำระจากธนาคารผ่าน NSW
import { banks } from "./banks.js";
import { paymentRefOf, requestDetails, requests } from "./requests.js";
import { operators } from "./operators.js";

export { banks };

export const paymentToday = "2026-10-26";

// ธนาคารของคำสั่งชำระที่เกิดจากการอนุมัติในรอบนี้ (คำขอรอพิจารณายังไม่มีข้อมูลธนาคาร)
// ชั่วคราวจนกว่าจะมี API — ธนาคาร / Ref.2 จริงได้จากผลตอบกลับของธนาคารผ่าน NSW
export const defaultBillBankCode = "006";

// สถานะการชำระเงิน → ข้อความ + tone ของ StatusBadge
// cancelled = ยกเลิกคำสั่งชำระเพราะเจ้าหน้าที่ยกเลิกการอนุมัติภายใน 15 นาที (TOR 4.4.2 (3)) — ข้อมูลจำลองยังไม่มีตัวอย่าง เกิดจากการทำงานในรอบนี้
export const paymentStatuses = {
  pending: { label: "รอการชำระเงิน", tone: "warning" },
  paid: { label: "ชำระแล้ว", tone: "success" },
  failed: { label: "ไม่สำเร็จ", tone: "danger" },
  cancelled: { label: "ยกเลิกคำสั่งชำระ", tone: "neutral" },
};

const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));
const requestByRef = Object.fromEntries(requests.map((r) => [r.ref, r]));

// วันที่ที่รายการเกิดผลล่าสุด (ชำระแล้ว = วันที่ชำระ · ไม่สำเร็จ = วันที่ธนาคารแจ้ง · ยกเลิก = วันที่ยกเลิก · รอชำระ = วันที่ส่งคำสั่งชำระ)
// ใช้กับรายงาน / KPI ประจำวัน
export const paymentDayOf = (p) => (p.paidAt ?? p.failedAt ?? p.cancelledAt ?? p.sentAt).slice(0, 10);

// แถวในตาราง B-11 จากคำสั่งชำระของคำขอ — p รูปเดียวกับ decidedDetail().payment (mocks/requests.js)
//   { orderedAt, bankCode, amount, status, paidAt?, failedAt?, failReason?, cancelledAt?, cancelReason?, notification? }
// seq = ครั้งที่สร้างคำสั่งชำระของคำขอนี้ (ครั้งถัดไปเกิดเมื่ออนุมัติใหม่หลังยกเลิกการอนุมัติ) → Ref.2 และเลขที่อ้างอิงต่อท้าย -2, -3
// เลขที่อ้างอิงการชำระ = paymentRefOf(ref) (PAY + เลขหลัง PF) เพื่อให้อ่านคู่กับคำขอได้ง่าย
export function paymentRow(ref, p, seq = 1) {
  const r = requestByRef[ref];
  const d = requestDetails[ref];
  return {
    id: `${paymentRefOf(ref)}${seq > 1 ? `-${seq}` : ""}`,
    sentAt: p.orderedAt,
    company: r.company,
    taxId: operatorByName[r.company]?.taxId ?? d.exporter.taxId,
    requestNo: ref,
    ref1: r.invoice,
    ref2: String(seq).padStart(3, "0"),
    bankCode: p.bankCode,
    amount: p.amount,
    status: p.status,
    ...(p.paidAt ? { paidAt: p.paidAt, receiptNo: d.receipt.no } : {}),
    ...(p.failedAt ? { failedAt: p.failedAt } : {}),
    ...(p.failReason ? { failReason: p.failReason } : {}),
    ...(p.cancelledAt ? { cancelledAt: p.cancelledAt, cancelReason: p.cancelReason } : {}),
    // อีเมลแจ้งผู้ยื่นเมื่อชำระไม่สำเร็จ (G-06 · TOR 7.8.36) — รูปเดียวกับ emailNotice() ใน mocks/requests.js
    ...(p.notification ? { notification: p.notification } : {}),
  };
}

// ใหม่ → เก่า ตามวันที่ส่งคำสั่งชำระ
export const payments = requests
  .filter((r) => requestDetails[r.ref].payment)
  .map((r) => paymentRow(r.ref, requestDetails[r.ref].payment))
  .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
