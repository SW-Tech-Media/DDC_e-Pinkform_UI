// ข้อความหน้าจอ D12 ติดตามสถานะคำขอ (รายการ + รายละเอียด)

export const trackingText = {
  breadcrumb: { group: "งานบริการ", title: "ติดตามสถานะคำขอ" },
  title: "ติดตามสถานะคำขอ",
  description: "ค้นหาและติดตามขั้นตอนของคำขอใบรับรองฯ ตั้งแต่รับคำขอจนเสร็จสมบูรณ์",
  backToList: "กลับไปรายการ",
  openReview: "เปิดหน้าพิจารณาคำขอ",
  openEbxml: "ดูข้อความ ebXML ของคำขอนี้",

  filters: {
    query: "ค้นหา (Reference No. / เลขที่ใบรับรอง / Invoice No.)",
    queryPlaceholder: "เช่น PF6910260003",
    taxId: "เลขประจำตัวผู้เสียภาษี",
    taxIdPlaceholder: "เลข 13 หลัก",
    company: "ชื่อบริษัท (ไทย / Eng)",
    companyPlaceholder: "ระบุชื่อบริษัท",
    date: "วันที่ส่งข้อมูล",
    datePlaceholder: "วว/ดด/ปปปป",
  },

  list: {
    title: "รายการติดตามสถานะคำขอ",
    subtitle: "คลิกแถวหรือปุ่ม View เพื่อดูขั้นตอนของคำขอ",
    headers: {
      ref: "Reference No.",
      submittedAt: "วันที่ส่งข้อมูล",
      invoice: "Invoice No.",
      company: "ชื่อบริษัท",
      bankCode: "รหัสธนาคาร",
      certificate: "เลขที่ใบรับรอง",
      brand: "Brandname",
      country: "ประเทศ",
      items: "จำนวน",
      status: "สถานะ",
      view: "View",
    },
    empty: "—",
    noResult: { title: "ไม่พบคำขอที่ตรงกับเงื่อนไข", description: "ลองเปลี่ยนคำค้นหา หรือกด ล้าง เพื่อแสดงทั้งหมด" },
  },

  notFound: {
    title: "ไม่พบคำขอ",
    description: (q) => `ไม่พบคำขอที่ตรงกับ “${q}” กรุณาตรวจสอบ Reference No. / เลขที่ใบรับรอง / Invoice No. อีกครั้ง`,
  },

  steps: { title: (ref) => `ขั้นตอนของคำขอ ${ref}` },

  history: {
    title: "ประวัติสถานะ",
    download: "ดาวน์โหลด",
    headers: { status: "สถานะ", detail: "รายละเอียด", at: "วันที่และเวลา", by: "ผู้ดำเนินการ" },
  },

  applicant: {
    title: "ข้อมูลผู้ยื่นคำขอ",
    ref: "Reference No.",
    businessType: "ประเภทกิจการ",
    taxId: "เลขผู้เสียภาษี",
    branch: "สาขา",
    company: "ชื่อบริษัท",
    agentTitle: "ยื่นแทนโดยตัวแทนออกของ (Profile ตัวแทน)",
    agentMeta: (taxId, branch) => `${taxId} · สาขา ${branch}`,
    defaultBusinessType: "ผู้ส่งออก",
    empty: "—",
  },

  issued: {
    title: "เอกสารที่ออกแล้ว",
    empty: "ยังไม่มีเอกสารที่ออก — ระบบจะออกใบรับรองฯ และใบเสร็จรับเงินหลังได้รับการชำระเงิน",
    download: (title) => `ดาวน์โหลด ${title}`,
  },

  downloaded: (name) => `ดาวน์โหลด ${name} แล้ว (จำลอง)`,
  snackClose: "ปิด",
};
