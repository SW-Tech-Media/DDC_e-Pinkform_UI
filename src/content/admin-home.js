// ข้อความหน้าหลักเจ้าหน้าที่ (D07 · Admin / Home – Overview)
export const adminHomeText = {
  breadcrumb: "หน้าหลัก",
  greeting: (firstName) => `สวัสดี คุณ${firstName}`,
  description: (weekday, date) => `ภาพรวมงานบริการใบรับรองฯ ประจำ${weekday}ที่ ${date}`,
  dailyReport: "รายงานประจำวัน",
  goPending: "ไปที่คำขอรอพิจารณา",
  kpi: {
    newToday: { label: "คำขอใหม่วันนี้", icon: "far fa-file-lines", tone: "teal", trendText: "จากเมื่อวาน" },
    pending: {
      label: "รอพิจารณา",
      icon: "far fa-clock",
      tone: "amber",
      caption: (h, m) => `เก่าที่สุดรอ ${h} ชม. ${m} นาที`,
    },
    awaitingPayment: { label: "รอการชำระเงิน", icon: "far fa-credit-card", tone: "blue", caption: "Bill Payment ผ่านธนาคาร" },
    issuedMonth: { label: "ออกใบรับรองฯ เดือนนี้", icon: "fas fa-award", tone: "pink", trendText: "จากเดือนก่อน" },
  },
  chart: {
    title: "จำนวนคำขอและใบรับรองฯ 14 วันล่าสุด",
    requests: "คำขอ",
    issued: "ออกใบรับรองฯ",
  },
  todayStatus: {
    title: "สถานะคำขอวันนี้",
    labels: {
      received: "รับข้อมูลใบคำขอ",
      inProgress: "อยู่ระหว่างดำเนินการ",
      awaitingPayment: "รอการชำระเงิน",
      issued: "ออกใบรับรองแล้ว",
      invalid: "ข้อมูลไม่ถูกต้อง / ไม่อนุมัติ",
    },
  },
  pendingTable: {
    title: "คำขอรอพิจารณา",
    sort: "เรียงตามเวลาที่ยื่น",
    viewAll: "ดูทั้งหมด",
    headers: { ref: "Reference No.", company: "บริษัท", country: "ประเทศ", items: "รายการ", submittedAt: "ยื่นเมื่อ" },
    waited: (time, hours) => `${time} · ${hours} ชม.`,
  },
  systems: {
    title: "สถานะการเชื่อมโยงระบบ",
    states: {
      connected: { label: "เชื่อมต่อ", tone: "success" },
      normal: { label: "ทำงานปกติ", tone: "success" },
      slow: { label: "ตอบช้า", tone: "warning" },
    },
  },
  pki: {
    title: (n) => `ใบรับรอง PKI ใกล้หมดอายุ ${n} รายการ`,
    body: (days) => `Signer Certificate ของผู้มีอำนาจลงนาม จะหมดอายุใน ${days} วัน`,
  },
};
