// ข้อมูลจำลองหน้า D13 · ติดตามการชำระเงิน (ตาม Figma node 19:3539)
// รายการชำระสร้างจากคำขอที่เจ้าหน้าที่อนุมัติแล้ว (requestDetails[ref].payment) — ไม่มีรายการที่อ้างคำขอที่ไม่มีอยู่
// ชั่วคราวจนกว่าจะมี API: backend เป็นผู้สร้างคำสั่งชำระเมื่ออนุมัติ และรับผลชำระจากธนาคารผ่าน NSW
import { banks } from "./banks.js";
import { requestDetails, requests } from "./requests.js";
import { operators } from "./operators.js";

export { banks };

export const paymentToday = "2026-10-26";

// สถานะการชำระเงิน → ข้อความ + tone ของ StatusBadge
export const paymentStatuses = {
  pending: { label: "รอการชำระเงิน", tone: "warning" },
  paid: { label: "ชำระแล้ว", tone: "success" },
  failed: { label: "ไม่สำเร็จ", tone: "danger" },
};

const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));

// วันที่ที่รายการเกิดผลล่าสุด (ชำระแล้ว = วันที่ชำระ · ไม่สำเร็จ = วันที่ธนาคารแจ้ง · รอชำระ = วันที่ส่งคำสั่งชำระ) — ใช้กับรายงาน / KPI ประจำวัน
export const paymentDayOf = (p) => (p.paidAt ?? p.failedAt ?? p.sentAt).slice(0, 10);

// เลขที่อ้างอิงการชำระในข้อมูลจำลองใช้เลขเดียวกับคำขอ (PAY + เลขหลัง PF) เพื่อให้อ่านคู่กันได้ง่าย
// ใหม่ → เก่า ตามวันที่ส่งคำสั่งชำระ
export const payments = requests
  .filter((r) => requestDetails[r.ref].payment)
  .map((r) => {
    const d = requestDetails[r.ref];
    const p = d.payment;
    return {
      id: `PAY${r.ref.slice(2)}`,
      sentAt: p.orderedAt,
      company: r.company,
      taxId: operatorByName[r.company]?.taxId ?? d.exporter.taxId,
      requestNo: r.ref,
      ref1: r.invoice,
      ref2: "001",
      bankCode: p.bankCode,
      amount: p.amount,
      status: p.status,
      ...(p.paidAt ? { paidAt: p.paidAt, receiptNo: d.receipt.no } : {}),
      ...(p.failedAt ? { failedAt: p.failedAt } : {}),
      ...(p.failReason ? { failReason: p.failReason } : {}),
    };
  })
  .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
