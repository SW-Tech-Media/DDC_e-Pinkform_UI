// ข้อมูลจำลองหน้า D17 · จัดการใบรับรองอิเล็กทรอนิกส์ (PKI) (ตาม Figma node 22:5813)

export const pkiToday = "2026-10-26";
export const pkiNow = "2026-10-26T11:20:00";
export const nearExpiryDays = 30;

// ประเภทใบรับรอง → แท็บ (organization แสดงเฉพาะแท็บ "ทั้งหมด")
export const certCategories = ["signer", "partner", "ssl"];

export const certificates = [
  {
    id: 1,
    subject: "CN=DDC e-Pinkforms Organization",
    type: "Organization (ลงนามระบบ)",
    category: "organization",
    issuer: "Sub-CA ตัวอย่าง A",
    serial: "4F:2A:91:0C",
    validFrom: "2026-03-14",
    expiresOn: "2028-03-14",
    ocsp: "good",
    keyUsage: "Digital Signature, Non-Repudiation",
    fingerprint: "A1:3C:9E:52:…:7D:04",
  },
  {
    id: 2,
    subject: "CN=Wipawan Thongdee (Authorized Signer)",
    type: "Signer (ผู้มีอำนาจลงนาม)",
    category: "signer",
    issuer: "Sub-CA ตัวอย่าง A",
    serial: "7B:11:E4:5D",
    validFrom: "2024-11-16",
    expiresOn: "2026-11-16",
    ocsp: "good",
    keyUsage: "Digital Signature, Non-Repudiation",
    fingerprint: "5E:88:0B:C1:…:2A:9F",
  },
  {
    id: 3,
    subject: "CN=Finance Officer Signer",
    type: "Signer (ใบเสร็จรับเงิน)",
    category: "signer",
    issuer: "Sub-CA ตัวอย่าง A",
    serial: "7B:11:E4:6A",
    validFrom: "2024-11-20",
    expiresOn: "2026-11-20",
    ocsp: "good",
    keyUsage: "Digital Signature",
    fingerprint: "C4:17:6D:E0:…:51:3B",
  },
  {
    id: 4,
    subject: "CN=gw-ebms.ddc.example",
    type: "SSL Certificate (ebMS Gateway)",
    category: "ssl",
    issuer: "Public SSL CA",
    serial: "02:9C:44:A1",
    validFrom: "2026-06-30",
    expiresOn: "2027-06-30",
    ocsp: "good",
    keyUsage: "Server Authentication",
    fingerprint: "0D:B2:7A:19:…:E6:C8",
  },
  {
    id: 5,
    subject: "CN=pki.ddc.example",
    type: "SSL Certificate (PKI Server)",
    category: "ssl",
    issuer: "Public SSL CA",
    serial: "02:9C:44:A2",
    validFrom: "2026-06-30",
    expiresOn: "2027-06-30",
    ocsp: "good",
    keyUsage: "Server Authentication",
    fingerprint: "9F:40:C3:8B:…:12:D7",
  },
  {
    id: 6,
    subject: "CN=Thailand NSW Gateway",
    type: "Partner (NSW)",
    category: "partner",
    issuer: "Partner CA",
    serial: "11:0E:7F:3B",
    validFrom: "2026-01-09",
    expiresOn: "2028-01-09",
    ocsp: "good",
    keyUsage: "Digital Signature, Key Encipherment",
    fingerprint: "73:AE:05:D9:…:6B:F1",
  },
  {
    id: 7,
    subject: "CN=Bank 014 ePayment",
    type: "Partner (ธนาคาร)",
    category: "partner",
    issuer: "Partner CA",
    serial: "5E:A0:2D:90",
    validFrom: "2025-05-27",
    expiresOn: "2027-05-27",
    ocsp: "good",
    keyUsage: "Digital Signature, Key Encipherment",
    fingerprint: "E2:5C:91:4F:…:08:A3",
  },
];

// วันเวลาที่ระบบส่งอีเมลแจ้งเตือนครั้งล่าสุด
export const lastAlertAt = "2026-10-26T08:00:00";

// ค่าเริ่มต้นของแผง "ตั้งค่าการแจ้งเตือน"
export const alertSettings = {
  lead: 30,
  leadUnit: "day",
  frequency: "week",
  email: true,
  soap: true,
  emailTo: "it-pinkforms@ddc.example",
  interval: 5,
  intervalUnit: "minute",
  ocspUrl: "http://ocsp.ca-example.th",
};

// ระบบลูกข่าย (Agent)
export const agents = [
  { id: "ebms", name: "Certificate Agent – ebMS Gateway", host: "gw-ebms (Production)", syncedAt: "11:20:00", online: true },
  { id: "app", name: "Certificate Agent – Application", host: "app-pinkforms (Production)", syncedAt: "11:20:00", online: true },
  { id: "signer", name: "Signature Agent – ผู้ลงนาม", host: "Signer / Issuer", syncedAt: "11:19:58", online: true },
];
