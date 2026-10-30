// ข้อความอีเมลแจ้งผู้ยื่นอัตโนมัติ (G-06 · TOR 7.8.32 ข้อมูลไม่ถูกต้อง / ไม่อนุมัติ, 7.8.36 ชำระไม่สำเร็จ)
// ใช้สร้างร่องรอยการส่งอีเมลในประวัติสถานะ (B-06, B-09), กล่องผลการพิจารณา (B-06) และรายละเอียดการชำระ (B-11)
// เนื้อหาจริงของแม่แบบอีเมลรอยืนยันกับลูกค้า (เสนอให้ Admin แก้ไขได้ที่ B-15) — ที่นี่เป็นหัวเรื่อง + สรุปเนื้อหาที่ระบบบันทึกไว้
import { formatMoney } from "@/utils/format.js";

const tag = "[DDC e-Pinkforms]";

export const emailText = {
  // ป้ายในประวัติสถานะ (StatusHistoryTable event "emailed")
  event: { label: "ส่งอีเมลแจ้งผู้ยื่นแล้ว", tone: "info" },
  by: "ระบบ (อีเมลอัตโนมัติ)",
  historyDetail: (to) => `ส่งอีเมลถึง ${to} สำเร็จ`,
  // ป้ายฟิลด์ (B-06 กล่องผลการพิจารณา, B-11 รายละเอียดการชำระ, StatusHistoryTable)
  fields: { to: "ผู้รับ", at: "เวลาที่ส่ง", subject: "หัวเรื่อง", summary: "สรุปเนื้อหา", status: "ผลการส่ง" },
  sectionTitle: "การแจ้งผู้ยื่นทางอีเมล",
  sent: "ส่งสำเร็จ",
  sentLine: (to, at) => `ส่งอีเมลแจ้งผู้ยื่นแล้ว ถึง ${to} เมื่อ ${at}`,

  // kind = invalid | rejected | paymentFailed
  subjects: {
    invalid: (ref) => `${tag} คำขอ ${ref} ข้อมูลไม่ถูกต้อง กรุณาแก้ไขและยื่นใหม่`,
    rejected: (ref) => `${tag} แจ้งผลการพิจารณา: ไม่อนุมัติคำขอ ${ref}`,
    paymentFailed: (ref) => `${tag} การชำระเงินค่าบริการไม่สำเร็จ คำขอ ${ref}`,
  },
  summaries: {
    invalid: ({ ref, invoice, reason }) =>
      `คำขอ ${ref} (Invoice ${invoice}) ไม่ผ่านการตรวจสอบข้อมูล: ${reason} · กรุณาแก้ไขและยื่นคำขอใหม่ผ่าน NSW`,
    rejected: ({ ref, invoice, reason, note }) =>
      `คำขอ ${ref} (Invoice ${invoice}) ไม่ได้รับการอนุมัติ เหตุผล: ${reason}${note ? ` · ${note}` : ""} · แก้ไขแล้วยื่นคำขอใหม่ผ่าน NSW`,
    paymentFailed: ({ ref, invoice, bank, amount }) =>
      `${bank} แจ้งผลการชำระค่าบริการ ${formatMoney(amount)} บาท ของคำขอ ${ref} (Invoice ${invoice}) ไม่สำเร็จ · ระบบปฏิเสธการออกใบรับรองฯ ของคำขอนี้`,
  },
};
