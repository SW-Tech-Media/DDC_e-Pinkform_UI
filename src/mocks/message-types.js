// ชุดข้อความ ebXML ที่ DDC e-Pinkforms รับ-ส่งผ่าน NSW — ใช้ร่วมกันใน B-17 (ติดตาม ebXML) และ B-04 (บริการที่ขอใช้ผ่าน NSP)
// code = ชื่อข้อความตาม Flow 10 / 11 (docs/1_Flow) · step = หมายเลขข้อความใน Flow 10 · action = eb:Action ใน ebXML Header
// code: null = ยังไม่มีชื่อข้อความใน Flow — ฝั่งธนาคาร (3.1 / 4.1) กำหนดร่วมกับ NSW และธนาคารตาม TOR 10.2
//   ส่วนข้อความขึ้นทะเบียนผู้ใช้บริการ (Flow 6) ยังไม่ได้ระบุชื่อ
// ชั่วคราวจนกว่าจะมี API: ชื่อข้อความที่ใช้จริงกับ NSW รอยืนยัน (Q-10) — backend / ebXML Gateway เป็นเจ้าของชุดนี้
export const messageTypes = {
  DDCPFREQ: { code: "DDCPFREQ", label: "คำขอใบรับรองฯ", service: "HealthCertificate", action: "DDCPFREQ" },
  DDCPFREQ_ACCEPT: { code: "DDCPFREQ_ACCEPT", label: "แจ้งสถานะคำขอ", service: "HealthCertificate", action: "DDCPFREQ_ACCEPT" },
  paymentOrder: { code: null, label: "คำสั่งชำระเงิน Bill Payment (NPMS)", step: "3.1", service: "BillPayment", action: "PaymentOrder" },
  paymentResult: { code: null, label: "ผลการชำระเงิน", step: "4.1", service: "BillPayment", action: "PaymentResult" },
  DDCPINKFORM: { code: "DDCPINKFORM", label: "ใบรับรองฯ (CERTIFICATE)", service: "HealthCertificate", action: "DDCPINKFORM" },
  DDCRECEIPT: { code: "DDCRECEIPT", label: "ใบเสร็จรับเงิน", step: "7", service: "HealthCertificate", action: "DDCRECEIPT" },
  register: { code: null, label: "ขอขึ้นทะเบียนผู้ใช้บริการ", service: "Registration", action: "Register" },
  registerResult: { code: null, label: "ผลการขึ้นทะเบียนผู้ใช้บริการ", service: "Registration", action: "RegisterResult" },
};

// หมายเหตุของข้อความที่ยังไม่มีชื่อ
export const pendingCodeNote = {
  paymentOrder: "ชื่อข้อความกำหนดภายหลัง (TOR 10.2)",
  paymentResult: "ชื่อข้อความกำหนดภายหลัง (TOR 10.2)",
  register: "ชื่อข้อความรอยืนยัน (Q-10)",
  registerResult: "ชื่อข้อความรอยืนยัน (Q-10)",
};

// บริการที่ผู้ประกอบการขอใช้ผ่าน NSP (B-04) = ข้อความที่ NSP รับ-ส่งแทนผู้ประกอบการ (Flow 10 ข้อ 1, 2–5 / 9–10, 7, 8)
export const nspServiceCodes = ["DDCPFREQ", "DDCPFREQ_ACCEPT", "DDCRECEIPT", "DDCPINKFORM"];
