// ข้อความหน้า B-10 · ข้อมูลใบรับรองฯ (TOR 4.4.3)

export const certificatesText = {
  breadcrumb: [{ title: "งานบริการ" }, { title: "ข้อมูลใบรับรองฯ" }],
  title: "ข้อมูลใบรับรองฯ",
  description: "ใบรับรองแหล่งผลิต แหล่งกำเนิดอาหารปลอดโรคที่ออกแล้ว และสถานะการส่งข้อมูลไประบบ e-Licensing กรมศุลกากร",
  // การ์ดสรุป — ตัวเลขคำนวณจากรายการใบรับรองฯ (CertificatesView)
  kpis: {
    today: { icon: "fas fa-award", tone: "pink", label: "ออกวันนี้", caption: (time) => `ฉบับ · ณ ${time} น.` },
    month: { icon: "far fa-calendar", tone: "teal", label: (month) => `เดือนนี้ (${month})`, caption: "ฉบับ" },
    year: { icon: "fas fa-chart-column", tone: "blue", label: (year) => `ปีนี้ (${year})`, caption: "ฉบับ" },
    eLicensing: {
      icon: "fas fa-arrow-right-arrow-left",
      tone: "green",
      label: "ส่ง e-Licensing แล้ววันนี้",
      caption: (pending, failed) => `รอส่ง ${pending} · ไม่สำเร็จ ${failed}`,
    },
  },
  filters: {
    taxId: { label: "เลขประจำตัวผู้เสียภาษี", placeholder: "เลข 13 หลัก" },
    company: { label: "ชื่อบริษัท (ไทย / Eng)", placeholder: "ระบุชื่อบริษัท" },
    ref: { label: "Reference No.", placeholder: "เช่น PF6910260003" },
    certNo: { label: "เลขที่ใบรับรอง", placeholder: "เช่น DDC-PF 69/012845" },
    date: { label: "วันที่ส่งข้อมูล", placeholder: "เลือกช่วงวันที่" },
    invoice: { label: "Invoice No.", placeholder: "เช่น INV-6910-1024" },
  },
  tabs: [
    { value: "all", label: "ทั้งหมด" },
    { value: "sent", label: "ส่ง e-Licensing แล้ว" },
    { value: "pending", label: "รอส่ง" },
    { value: "failed", label: "ส่งไม่สำเร็จ" },
  ],
  headers: [
    { title: "Reference No.", key: "ref" },
    { title: "วันที่\nส่งข้อมูล", key: "sentAt" },
    { title: "Invoice No.", key: "invoice" },
    { title: "ชื่อบริษัท", key: "company" },
    { title: "เลขที่\nใบรับรอง", key: "certNo" },
    { title: "ประเทศ\nผู้รับสินค้า", key: "country" },
    { title: "จำนวน\nรายการสินค้า", key: "items", align: "end" },
    { title: "สถานะส่ง\ne-Licensing", key: "eLicensing" },
    { title: "View\nPDF", key: "actions", align: "center", sortable: false },
  ],
  itemsUnit: (n) => `${n} รายการ`,
  timeSuffix: "น.",
  viewLabel: "ดูใบรับรองฯ (PDF)",
  noData: "ไม่พบใบรับรองฯ ที่ตรงกับเงื่อนไข",
  noDataHint: "ลองเปลี่ยนเงื่อนไขการค้นหา หรือล้างตัวกรอง",
  exported: "ส่งออกรายการใบรับรองฯ เป็น Excel แล้ว (จำลอง)",

  preview: {
    title: (no) => `ใบรับรองฯ ${no}`,
    subtitle: (ref, company) => `${ref} · ${company}`,
    variants: [
      { value: "cert", label: "ใบรับรองฯ" },
      { value: "annexTh", label: "ใบแนบ (ไทย)" },
      { value: "annexEn", label: "ใบแนบ (Eng)" },
    ],
    variantLabel: "เลือกเอกสาร",
    info: {
      sentAt: "วันที่ส่งข้อมูล",
      invoice: "Invoice No.",
      country: "ประเทศผู้รับสินค้า",
      receipt: "เลขที่ใบเสร็จ",
    },
    eLicensing: {
      sent: "ส่งข้อมูลไป e-Licensing กรมศุลกากรสำเร็จ ได้รับการตอบรับ (ACK) แล้ว",
      pending: "อยู่ในคิวส่งข้อมูลไป e-Licensing ผ่าน ebXML Gateway",
      failed: "ส่งข้อมูลไป e-Licensing ไม่สำเร็จ (Timeout) ระบบจะลองส่งใหม่อัตโนมัติ หรือกดส่งใหม่ได้ทันที",
    },
    resend: "ส่ง e-Licensing ใหม่",
    resent: (no) => `ส่งข้อมูลใบรับรองฯ ${no} ไป e-Licensing สำเร็จ`,
    downloadPdf: "ดาวน์โหลด PDF",
    downloadXml: "ดาวน์โหลด XML",
    downloaded: (no, type) => `ดาวน์โหลด ${type} ของใบรับรองฯ ${no} แล้ว (จำลอง)`,
  },
};
