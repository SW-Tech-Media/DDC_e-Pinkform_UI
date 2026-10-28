// ข้อมูลจำลองหน้า D16 · ติดตามการรับ-ส่งข้อความ ebXML (ตาม Figma node 22:4793)

export const ebxmlToday = "2026-10-26";
export const ebxmlNow = "2026-10-26T11:24:30";
export const maxRetry = 5;

export const ebxmlStats = { received: 312, sent: 298, successRate: "99.6%" };

export const directions = {
  in: { label: "รับ", tone: "info" },
  out: { label: "ส่ง", tone: "accent" },
};

export const docTypes = [
  "คำขอใบรับรองฯ",
  "ACK (Acknowledgment)",
  "คำสั่งชำระเงิน",
  "ผลการชำระเงิน",
  "ใบรับรองฯ",
  "ใบรับรองฯ + ใบเสร็จรับเงิน",
  "ขอขึ้นทะเบียนผู้ใช้บริการ",
];

// สถานะของแต่ละครั้งที่ส่ง (ประวัติ Queue / Retry)
export const attemptStatuses = {
  success: { label: "สำเร็จ", tone: "success" },
  timeout: { label: "Timeout", tone: "danger" },
  scheduled: { label: "รอ", tone: "neutral" },
  waitAck: { label: "รอ ACK", tone: "info" },
  rejected: { label: "Signature ไม่ผ่าน", tone: "danger" },
};

const m = (o) => ({ date: ebxmlToday, ...o });

export const messages = [
  m({
    id: "a91f2c7e-4b1d-4e0a-9c55-7d2e8f1a03bd",
    short: "a91f2c7e...03bd",
    time: "11:24:08",
    docType: "คำขอใบรับรองฯ",
    direction: "in",
    route: "NSW → DDC",
    routeLabel: "คำขอใบรับรองฯ จาก NSW",
    reference: "PF6910260031",
    signature: true,
    status: "success",
    header: { from: "THNSW", to: "DDC-PINKFORMS", cpaId: "NSW_DDC_CPA_v2", service: "HealthCertificate", action: "Request" },
    attempts: [{ time: "11:24:08", label: "รับข้อความ", status: "success" }],
  }),
  m({
    id: "77c0e1aa-02f3-4d8b-b6a1-5c9e3d7b9f12",
    short: "77c0e1aa...9f12",
    time: "11:23:51",
    docType: "ACK (Acknowledgment)",
    direction: "out",
    route: "DDC → NSW",
    routeLabel: "ACK → NSW",
    reference: "PF6910260030",
    signature: true,
    status: "success",
    header: { from: "DDC-PINKFORMS", to: "THNSW", cpaId: "NSW_DDC_CPA_v2", service: "urn:oasis:names:tc:ebxml-msg:service", action: "Acknowledgment" },
    attempts: [{ time: "11:23:51", label: "ส่งครั้งที่ 1", status: "success" }],
  }),
  m({
    id: "5b3d8e90-7a2c-4f61-8e0d-91b4c6a2c4a1",
    short: "5b3d8e90...c4a1",
    time: "11:22:30",
    docType: "คำสั่งชำระเงิน",
    direction: "out",
    route: "DDC → ธนาคาร B (014)",
    routeLabel: "คำสั่งชำระเงิน → ธนาคาร B",
    reference: "PAY6910260040",
    signature: true,
    status: "retry",
    retry: 2,
    header: { from: "DDC-PINKFORMS", to: "BANK-014", cpaId: "DDC_BANK014_CPA_v2", service: "PaymentOrder", action: "Submit" },
    attempts: [
      { time: "11:22:30", label: "ส่งครั้งที่ 1", status: "timeout" },
      { time: "11:23:30", label: "ส่งครั้งที่ 2", status: "timeout" },
      { time: "11:25:30", label: "ส่งครั้งที่ 3 (กำหนดการ)", status: "scheduled" },
    ],
  }),
  m({
    id: "e04b6d21-5f8a-4c37-a2e9-3b7d1c0e7a88",
    short: "e04b6d21...7a88",
    time: "11:20:14",
    docType: "ผลการชำระเงิน",
    direction: "in",
    route: "ธนาคาร A (006) → DDC",
    routeLabel: "ผลการชำระเงิน จากธนาคาร A",
    reference: "PAY6910260034",
    signature: true,
    status: "success",
    header: { from: "BANK-006", to: "DDC-PINKFORMS", cpaId: "DDC_BANK006_CPA_v2", service: "PaymentResult", action: "Notify" },
    attempts: [{ time: "11:20:14", label: "รับข้อความ", status: "success" }],
  }),
  m({
    id: "c3a9f0b4-1d6e-4a92-8f3c-6e2b5a8d1e5d",
    short: "c3a9f0b4...1e5d",
    time: "11:20:02",
    docType: "ใบรับรองฯ",
    direction: "out",
    route: "DDC → e-Licensing",
    routeLabel: "ใบรับรองฯ → e-Licensing",
    reference: "PF6910260018",
    signature: true,
    status: "waitAck",
    header: { from: "DDC-PINKFORMS", to: "E-LICENSING", cpaId: "DDC_ELIC_CPA_v1", service: "HealthCertificate", action: "Issue" },
    attempts: [
      { time: "11:20:02", label: "ส่งครั้งที่ 1", status: "success" },
      { time: "11:20:02", label: "รอการตอบรับ (ACK)", status: "waitAck" },
    ],
  }),
  m({
    id: "0f81a2c6-9b4e-4d05-a7f1-2c8e6d3fb930",
    short: "0f81a2c6...b930",
    time: "11:19:47",
    docType: "ใบรับรองฯ + ใบเสร็จรับเงิน",
    direction: "out",
    route: "DDC → NSW → NSP",
    routeLabel: "ใบรับรองฯ + ใบเสร็จ → NSW",
    reference: "PF6910260012",
    signature: true,
    status: "success",
    header: { from: "DDC-PINKFORMS", to: "THNSW", cpaId: "NSW_DDC_CPA_v2", service: "HealthCertificate", action: "IssueWithReceipt" },
    attempts: [{ time: "11:19:47", label: "ส่งครั้งที่ 1", status: "success" }],
  }),
  m({
    id: "9d2e7b14-6c0a-4f83-b5d2-8a1e4c9f6f07",
    short: "9d2e7b14...6f07",
    time: "11:18:33",
    docType: "คำขอใบรับรองฯ",
    direction: "in",
    route: "NSW → DDC",
    routeLabel: "คำขอใบรับรองฯ จาก NSW",
    reference: "PF6910260029",
    signature: false,
    status: "error",
    header: { from: "THNSW", to: "DDC-PINKFORMS", cpaId: "NSW_DDC_CPA_v2", service: "HealthCertificate", action: "Request" },
    attempts: [{ time: "11:18:33", label: "รับข้อความ", status: "rejected" }],
  }),
  m({
    id: "2a6c4f88-3e7b-4d19-9a0c-5f2d8b1ed215",
    short: "2a6c4f88...d215",
    time: "11:17:09",
    docType: "ขอขึ้นทะเบียนผู้ใช้บริการ",
    direction: "in",
    route: "NSW → DDC",
    routeLabel: "ขอขึ้นทะเบียน จาก NSW",
    reference: "REG6910260007",
    signature: true,
    status: "success",
    header: { from: "THNSW", to: "DDC-PINKFORMS", cpaId: "NSW_DDC_CPA_v2", service: "Registration", action: "Register" },
    attempts: [{ time: "11:17:09", label: "รับข้อความ", status: "success" }],
  }),
];

// ข้อมูล CPA (Collaboration Protocol Agreement) สำหรับ Dialog ตั้งค่า CPA (TOR 4.6.1 (1))
export const cpas = [
  { id: "NSW_DDC_CPA_v2", partner: "THNSW", endpoint: "https://gw.nsw.example/ebms", retries: 5, interval: 60, signature: true, encryption: true },
  { id: "DDC_BANK014_CPA_v2", partner: "BANK-014", endpoint: "https://ebms.bank-b.example/inbound", retries: 5, interval: 60, signature: true, encryption: true },
  { id: "DDC_BANK006_CPA_v2", partner: "BANK-006", endpoint: "https://ebms.bank-a.example/inbound", retries: 5, interval: 60, signature: true, encryption: true },
  { id: "DDC_ELIC_CPA_v1", partner: "E-LICENSING", endpoint: "https://elicensing.example/ebms", retries: 3, interval: 120, signature: true, encryption: false },
];
