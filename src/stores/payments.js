// คำสั่งชำระเงิน (Bill Payment) ของ B-11 — รวมข้อมูลจำลองกับคำสั่งชำระที่เกิดจากการอนุมัติ / ยกเลิกการอนุมัติในรอบนี้
// ชั่วคราวจนกว่าจะมี API (BR: Flow 7 ขั้น 6–7, TOR 7.8.34): backend สร้างคำสั่งชำระลงนาม DDC ส่งธนาคารผ่าน NSW ทันทีที่อนุมัติ
// และยกเลิกคำสั่งชำระเมื่อยกเลิกการอนุมัติภายใน 15 นาที (TOR 4.4.2 (3)) — หน้าจอเพียงอ่านผลจาก GET /payments
import { defineStore } from "pinia";
import { defaultBillBankCode, paymentRow, payments as seedPayments } from "@/mocks/payments.js";
import { requestDetails, serviceFee } from "@/mocks/requests.js";

export const usePaymentsStore = defineStore("payments", {
  // orders[ref] = คำสั่งชำระที่สร้างในรอบนี้ ใหม่ → เก่า — รูปเดียวกับ decidedDetail().payment + seq
  state: () => ({ orders: {} }),
  getters: {
    // ทุกรายการในตาราง B-11 ใหม่ → เก่า ตามวันที่ส่งคำสั่งชำระ
    all: (state) => {
      const session = Object.entries(state.orders).flatMap(([ref, list]) => list.map((p) => paymentRow(ref, p, p.seq)));
      return [...session, ...seedPayments].sort((a, b) => b.sentAt.localeCompare(a.sentAt));
    },
    // คำสั่งชำระล่าสุดของคำขอ (แถวในตาราง B-11) — null = ไม่มี
    latestOf() {
      return (ref) => this.all.find((p) => p.requestNo === ref) ?? null;
    },
  },
  actions: {
    // สร้างคำสั่งชำระเมื่ออนุมัติ — คืนแถวของ B-11
    createOrder(ref, orderedAt) {
      const list = (this.orders[ref] ??= []);
      const seq = list.length + (requestDetails[ref]?.payment ? 2 : 1);
      const order = { orderedAt, bankCode: requestDetails[ref]?.bankCode ?? defaultBillBankCode, amount: serviceFee, status: "pending", seq };
      list.unshift(order);
      return paymentRow(ref, order, seq);
    },
    // ยกเลิกคำสั่งชำระที่ยังรอชำระของคำขอ (ยกเลิกการอนุมัติ) — คืนแถวก่อนยกเลิก หรือ null ถ้าไม่มี
    cancelOrder(ref, cancelledAt, reason) {
      const order = this.orders[ref]?.find((p) => p.status === "pending");
      if (!order) return null;
      const before = paymentRow(ref, order, order.seq);
      Object.assign(order, { status: "cancelled", cancelledAt, cancelReason: reason });
      return before;
    },
  },
});
