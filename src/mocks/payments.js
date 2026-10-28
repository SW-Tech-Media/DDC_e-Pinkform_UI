// ข้อมูลจำลองหน้า D13 · ติดตามการชำระเงิน (ตาม Figma node 19:3539)

export const paymentToday = "2026-10-26";

// สถานะการชำระเงิน → ข้อความ + tone ของ StatusBadge
export const paymentStatuses = {
  pending: { label: "รอการชำระเงิน", tone: "warning" },
  paid: { label: "ชำระแล้ว", tone: "success" },
  failed: { label: "ไม่สำเร็จ", tone: "danger" },
};

export const banks = {
  "002": "ธนาคาร C",
  "006": "ธนาคาร A",
  "014": "ธนาคาร B",
};

export const paymentKpis = [
  { key: "received", icon: "far fa-credit-card", tone: "green", label: "ยอดรับชำระวันนี้ (บาท)", money: 12600, caption: "41 รายการ" },
  { key: "pending", icon: "far fa-clock", tone: "amber", label: "รอการชำระเงิน", value: 7, caption: "ยอดรวม 2,700.00 บาท" },
  { key: "failed", icon: "fas fa-triangle-exclamation", tone: "red", label: "ชำระไม่สำเร็จ", value: 1, caption: "แจ้งผู้ประกอบการผ่าน NSW" },
  { key: "receipts", icon: "fas fa-file-invoice-dollar", tone: "teal", label: "ใบเสร็จที่ออกวันนี้", value: 41, caption: "ลงนามดิจิทัลครบถ้วน" },
];

export const payments = [
  { id: "PAY6910260041", sentAt: "2026-10-26T10:58:00", company: "บริษัท ไทยเฟรช ฟู้ด จำกัด", taxId: "0105558012345", requestNo: "PF6910260030", ref1: "INV-6910-1087", ref2: "001", bankCode: "006", amount: 300, status: "pending" },
  { id: "PAY6910260040", sentAt: "2026-10-26T10:44:00", company: "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", taxId: "0105561023456", requestNo: "PF6910260027", ref1: "INV-6910-1080", ref2: "001", bankCode: "014", amount: 600, status: "pending" },
  { id: "PAY6910260037", sentAt: "2026-10-26T10:15:00", company: "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", taxId: "0703559001122", requestNo: "PF6910260018", ref1: "INV-6910-1059", ref2: "001", bankCode: "002", amount: 300, status: "paid", paidAt: "2026-10-26T10:21:00", receiptNo: "RC6910260037" },
  { id: "PAY6910260034", sentAt: "2026-10-26T09:51:00", company: "บริษัท อันดามัน ซีฟู้ด จำกัด", taxId: "0835560004567", requestNo: "PF6910260012", ref1: "INV-6910-1045", ref2: "001", bankCode: "006", amount: 300, status: "paid", paidAt: "2026-10-26T09:58:00", receiptNo: "RC6910260034" },
  { id: "PAY6910260031", sentAt: "2026-10-26T09:37:00", company: "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", taxId: "0105557034567", requestNo: "PF6910260009", ref1: "INV-6910-1038", ref2: "002", bankCode: "014", amount: 900, status: "paid", paidAt: "2026-10-26T09:44:00", receiptNo: "RC6910260031" },
  { id: "PAY6910260028", sentAt: "2026-10-26T09:19:00", company: "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", taxId: "0105561023456", requestNo: "PF6910260003", ref1: "INV-6910-1024", ref2: "001", bankCode: "006", amount: 300, status: "paid", paidAt: "2026-10-26T09:25:00", receiptNo: "RC6910260028" },
  { id: "PAY6910260025", sentAt: "2026-10-26T09:02:00", company: "บริษัท มหาชัย โฟรเซ่น จำกัด", taxId: "0745562007890", requestNo: "PF6910250188", ref1: "INV-6910-0998", ref2: "001", bankCode: "006", amount: 300, status: "failed", failReason: "ยอดเงินในบัญชีไม่เพียงพอ (รหัส 51)" },
  { id: "PAY6910260022", sentAt: "2026-10-26T08:47:00", company: "บริษัท เชียงใหม่ ออร์แกนิค จำกัด", taxId: "0505563001234", requestNo: "PF6910250185", ref1: "INV-6910-0991", ref2: "001", bankCode: "002", amount: 600, status: "paid", paidAt: "2026-10-26T08:55:00", receiptNo: "RC6910260022" },
  { id: "PAY6910260019", sentAt: "2026-10-26T08:30:00", company: "บริษัท ทรอปิคอล แพค จำกัด", taxId: "0105564005678", requestNo: "PF6910250181", ref1: "INV-6910-0985", ref2: "003", bankCode: "014", amount: 300, status: "paid", paidAt: "2026-10-26T08:36:00", receiptNo: "RC6910260019" },
];
