// ข้อมูลจำลองหน้า B-25 · ส่งข้อมูลระบบงานภายใน DDC (Back Office เดิม) — เสนอเพิ่ม (TOR 7.8.38, 8.3)

export const syncToday = "2026-10-26";
export const syncNow = "2026-10-26T11:30:00";

export const syncStats = { sentToday: 186 };

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

const s = (id, time, docType, docNo, reference, status, attempts, message, date = syncToday) => ({
  id,
  at: `${date}T${time}`,
  docType,
  docNo,
  reference,
  status,
  attempts,
  message,
});

export const syncItems = [
  s(1, "11:28:14", "certificate", "DDC-PF 69/012845", "PF6910260031", "success", 1, "บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-88412)"),
  s(2, "11:28:14", "receipt", "R69-0104412", "PAY6910260034", "success", 1, "บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-88413)"),
  s(3, "11:24:52", "certificate", "DDC-PF 69/012844", "PF6910260030", "error", 3, "SOAP Fault: ORA-00001 รหัสผู้ประกอบการซ้ำในระบบเดิม"),
  s(4, "11:22:05", "receipt", "R69-0104411", "PAY6910260033", "pending", 0, "อยู่ในคิว รอส่งรอบถัดไป 11:30"),
  s(5, "11:20:40", "certificate", "DDC-PF 69/012843", "PF6910260029", "success", 2, "ส่งซ้ำสำเร็จ (ครั้งแรก Timeout)"),
  s(6, "11:18:11", "receipt", "R69-0104410", "PAY6910260032", "error", 2, "Timeout 30 วินาที — Back Office ไม่ตอบกลับ"),
  s(7, "11:15:37", "certificate", "DDC-PF 69/012842", "PF6910260028", "pending", 0, "อยู่ในคิว รอส่งรอบถัดไป 11:30"),
  s(8, "11:12:09", "certificate", "DDC-PF 69/012841", "PF6910260027", "success", 1, "บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-88405)"),
  s(9, "11:12:09", "receipt", "R69-0104409", "PAY6910260031", "success", 1, "บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-88406)"),
  s(10, "11:05:44", "receipt", "R69-0104408", "PAY6910260030", "pending", 0, "อยู่ในคิว รอส่งรอบถัดไป 11:30"),
  s(11, "10:58:20", "certificate", "DDC-PF 69/012840", "PF6910260026", "success", 1, "บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-88398)"),
  s(12, "16:42:03", "certificate", "DDC-PF 69/012839", "PF6910250044", "success", 1, "บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-88371)", "2026-10-25"),
  s(13, "16:42:03", "receipt", "R69-0104407", "PAY6910250039", "success", 1, "บันทึกลงฐานข้อมูล Back Office แล้ว (BO-REF 2569-88372)", "2026-10-25"),
];

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

export const sampleValues = {
  operator: "บริษัท สยามซีฟู้ด เอ็กซ์ปอร์ต จำกัด",
  taxId: "0105561234567",
  product: "0303.89 · ปลาแช่แข็ง",
  destination: "สาธารณรัฐประชาชนจีน",
  issuedOn: "26/10/2569",
  signer: "วิภาวรรณ ทองดี",
  amount: "1,500.00",
  bank: "ธนาคาร A (006)",
  paidOn: "26/10/2569",
};

export const mismatches = {
  "DDC-PF 69/012844": { operator: "บจก. สยามซีฟู้ด เอ็กซ์ปอร์ต", taxId: "—" },
  "R69-0104410": { amount: "—" },
};
