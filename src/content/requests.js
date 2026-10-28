// ข้อความหน้า D09 · คำขอใบรับรองฯ และ D18 · ไม่พบข้อมูล (Empty state)

export const requestsText = {
  breadcrumb: [{ title: "งานบริการ" }, { title: "คำขอใบรับรองฯ" }],
  title: "คำขอใบรับรองฯ",
  description: "รายการคำขอที่ได้รับผ่านระบบ NSW · คำขอที่ยื่นเข้าระบบก่อนแสดงเป็นลำดับแรก",

  filters: {
    ref: { label: "Reference No. / PF-ID", placeholder: "เช่น PF691026..." },
    taxId: { label: "เลขประจำตัวผู้เสียภาษี", placeholder: "เลข 13 หลัก" },
    company: { label: "ชื่อบริษัท (ไทย / Eng)", placeholder: "ระบุชื่อบริษัท" },
    invoice: { label: "Invoice No.", placeholder: "ระบุเลขที่" },
    dateRange: { label: "วันที่ส่งข้อมูล", placeholder: "เลือกช่วงวันที่" },
    // เพิ่มตาม TOR 4.4.2 (9), 7.8.28
    certificate: { label: "เลขที่ใบรับรอง / เลขที่ใบสีชมพู", placeholder: "เช่น DDC-PF 69/012845" },
  },

  // แท็บสถานะ — value = key ใน requestTabCounts, statuses = สถานะใน requestStatuses ที่นับรวม
  tabs: [
    { value: "all", label: "ทั้งหมด", statuses: null },
    { value: "pending", label: "รอพิจารณา", statuses: ["received", "checking", "pending"] },
    { value: "invalid", label: "ข้อมูลไม่ถูกต้อง", statuses: ["invalid"] },
    { value: "approved", label: "อนุมัติแล้ว", statuses: ["approved", "paid", "issued", "readyToDeliver", "completed"] },
    { value: "rejected", label: "ไม่อนุมัติ", statuses: ["rejected"] },
    { value: "awaitingPayment", label: "รอการชำระเงิน", statuses: ["awaitingPayment", "paymentFailed"] },
  ],

  sort: {
    label: "เรียงตาม",
    options: [
      { value: "asc", title: "เวลาที่ยื่น (เก่า → ใหม่)" },
      { value: "desc", title: "เวลาที่ยื่น (ใหม่ → เก่า)" },
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
