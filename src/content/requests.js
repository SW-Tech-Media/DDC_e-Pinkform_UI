// ข้อความหน้า D09 · คำขอใบรับรองฯ และ D18 · ไม่พบข้อมูล (Empty state)

export const requestsText = {
  breadcrumb: [{ title: "งานบริการ" }, { title: "คำขอใบรับรองฯ" }],
  title: "คำขอใบรับรองฯ",
  description: "รายการคำขอที่ได้รับผ่านระบบ NSW · แต่ละแท็บเรียงลำดับตามงานที่ต้องทำก่อน",

  filters: {
    ref: { label: "Reference No. / PF-ID", placeholder: "เช่น PF691026..." },
    taxId: { label: "เลขประจำตัวผู้เสียภาษี", placeholder: "เลข 13 หลัก" },
    company: { label: "ชื่อบริษัท (ไทย / Eng)", placeholder: "ระบุชื่อบริษัท" },
    invoice: { label: "Invoice No.", placeholder: "ระบุเลขที่" },
    dateRange: { label: "วันที่ส่งข้อมูล", placeholder: "เลือกช่วงวันที่" },
    // เพิ่มตาม TOR 4.4.2 (9), 7.8.28
    certificate: { label: "เลขที่ใบรับรอง / เลขที่ใบสีชมพู", placeholder: "เช่น DDC-PF 69/012845" },
  },

  // แท็บสถานะ — statuses = สถานะใน requestStatuses ที่นับรวม
  // sort = การเรียงเริ่มต้นตามงานของเจ้าหน้าที่ในแท็บนั้น (value ใน sort.options) · pin = สถานะที่ต้องดำเนินการ แสดงบนสุดเสมอ
  tabs: [
    // ภาพรวม: ยื่นล่าสุดอยู่บน
    { value: "all", label: "ทั้งหมด", statuses: null, sort: "submittedDesc" },
    // คิวพิจารณา: ยื่นก่อนอยู่บน เพื่อไม่ให้ผู้ประกอบการรอนาน
    { value: "pending", label: "รอพิจารณา", statuses: ["received", "checking", "pending"], sort: "submittedAsc" },
    { value: "invalid", label: "ข้อมูลไม่ถูกต้อง", statuses: ["invalid"], sort: "updatedDesc" },
    // อัปเดตล่าสุดอยู่บน — คำขอที่เพิ่งอนุมัติ (ยกเลิกได้ภายใน 15 นาที) จึงอยู่ด้านบน
    { value: "approved", label: "อนุมัติแล้ว", statuses: ["approved", "paid", "issued", "readyToDeliver", "completed"], sort: "updatedDesc" },
    { value: "rejected", label: "ไม่อนุมัติ", statuses: ["rejected"], sort: "updatedDesc" },
    // ชำระไม่สำเร็จต้องติดตามผู้ประกอบการ จึงอยู่บนสุด
    { value: "awaitingPayment", label: "รอการชำระเงิน", statuses: ["awaitingPayment", "paymentFailed"], sort: "updatedDesc", pin: ["paymentFailed"] },
  ],

  // key = เวลาที่ใช้เรียง (submittedAt = เวลาที่ยื่น · statusAt = เวลาที่สถานะเปลี่ยนล่าสุด) · dir 1 = เก่า → ใหม่
  sort: {
    label: "เรียงตาม",
    options: [
      { value: "submittedAsc", title: "ยื่น เก่า → ใหม่", key: "submittedAt", dir: 1 },
      { value: "submittedDesc", title: "ยื่น ใหม่ → เก่า", key: "submittedAt", dir: -1 },
      { value: "updatedDesc", title: "อัปเดต ใหม่ → เก่า", key: "statusAt", dir: -1 },
      { value: "updatedAsc", title: "อัปเดต เก่า → ใหม่", key: "statusAt", dir: 1 },
    ],
  },

  columns: {
    ref: "Reference No.",
    submittedAt: "วันที่ส่งข้อมูล",
    invoice: "Invoice No.",
    company: "ชื่อบริษัท",
    brand: "Brandname",
    country: "ประเทศ",
    items: "จำนวน",
    autoCheck: "ตรวจสอบอัตโนมัติ",
    status: "สถานะ",
    view: "View",
  },

  timeSuffix: "น.",
  undoUntil: (time) => `ยกเลิกการอนุมัติได้ถึง ${time} น.`,
  statusAt: (at) => `อัปเดต ${at} น.`,
  // Snackbar หลังบันทึกผลการพิจารณาแล้วกลับมาหน้ารายการ
  decided: {
    approved: (ref) => `อนุมัติคำขอ ${ref} แล้ว · ยกเลิกการอนุมัติได้ภายใน 15 นาที`,
    rejected: (ref) => `ไม่อนุมัติคำขอ ${ref} แล้ว · ส่งข้อความตอบกลับผู้ประกอบการผ่าน NSW`,
    open: "เปิดคำขอ",
  },
  viewAria: (ref) => `ดูคำขอ ${ref}`,
  exported: "ส่งออกไฟล์ Excel ตามเงื่อนไขที่ค้นหาแล้ว (Prototype)",

  empty: {
    icon: "fas fa-magnifying-glass",
    title: "ไม่พบคำขอที่ตรงกับเงื่อนไข",
    // term = คำที่ค้น (ถ้ามี), range = "01/10/2569 – 26/10/2569" (ถ้ามี)
    description: (term, range) => {
      const who = term ? `ไม่พบคำขอของ “${term}”` : "ไม่พบคำขอ";
      const when = range ? ` ในช่วง ${range}` : "";
      return `${who}${when} ลองเปลี่ยนเงื่อนไข หรือกด “ล้าง” เพื่อดูทั้งหมด`;
    },
    clear: "ล้างเงื่อนไข",
    tabTitle: "ไม่มีคำขอในสถานะนี้",
    tabDescription: (label) => `ยังไม่มีคำขอในสถานะ “${label}” ในขณะนี้`,
  },
};
