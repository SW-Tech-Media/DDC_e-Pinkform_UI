// ข้อมูลจำลองหน้า B-12 · ใบเสร็จรับเงิน (TOR 4.4.4 (2)(3))
// ใบเสร็จสร้างจากคำขอที่ได้รับการชำระแล้ว (requestDetails[ref].receipt) — เลขที่อ้างอิง / Ref. / ธนาคาร / จำนวนเงิน ตรงกับ mocks/payments.js
// เลขผู้เสียภาษี / ชื่ออังกฤษ ตาม mocks/operators.js · status ใช้ key ใน receiptStatuses · signer ใช้ key ใน receiptSigners
import { operators } from "./operators.js";
import { payments } from "./payments.js";
import { requestDetails, serviceFee } from "./requests.js";
import { staff } from "./users.js";

export const receiptToday = "2026-10-26";

// cancelled = ยกเลิก (ชำระซ้ำ คืนเงิน) — ยังไม่มีตัวอย่าง รอยืนยันว่ามีกรณีนี้หรือไม่ (Q-07)
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

export const receiptFee = serviceFee; // ค่าธรรมเนียมต่อใบรับรองฯ (บาท)

const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));

// ใหม่ → เก่า
export const receipts = payments
  .filter((p) => p.status === "paid")
  .map((p) => {
    const d = requestDetails[p.requestNo];
    const op = operatorByName[p.company];
    return {
      id: d.receipt.no,
      receiptNo: d.receipt.no,
      issuedAt: d.receipt.issuedAt,
      reference: p.id,
      company: p.company,
      companyEn: op?.nameEn ?? "",
      taxId: op?.taxId ?? "",
      branch: op?.branch ?? "00000",
      requestNo: p.requestNo,
      ref1: p.ref1,
      ref2: p.ref2,
      bankCode: p.bankCode,
      amount: p.amount,
      signer: d.receipt.signer,
      status: d.receipt.signed ? "signed" : "pending",
      certificateNo: d.issued?.certificate ?? "",
    };
  })
  .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
