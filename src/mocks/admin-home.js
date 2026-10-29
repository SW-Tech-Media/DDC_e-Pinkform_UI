// ข้อมูลจำลองหน้าหลักเจ้าหน้าที่ (Figma D07 · Admin / Home – Overview)

// วันที่ของภาพรวม
export const overviewDate = "2026-10-26";

// KPI 4 ใบ และสถานะคำขอวันนี้ คำนวณจากรายการคำขอใน AdminHomeView (ไม่ใช่ตัวเลขคงที่)

// กราฟ 14 วันล่าสุด (13 – 26 ต.ค. 2569) — วันก่อนหน้าเป็นยอดสรุปย้อนหลังตัวอย่าง (backend จะส่งจากรายงานประจำวัน)
// วันล่าสุด (26) AdminHomeView แทนด้วยจำนวนที่นับจากรายการคำขอ / ใบรับรองฯ ของวันนั้น
export const dailyChart = {
  labels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"],
  requests: [53, 62, 49, 72, 68, 23, 15, 59, 75, 66, 71, 73, 26, 19],
  issued: [50, 58, 48, 68, 62, 20, 14, 57, 72, 62, 67, 70, 22, 6],
  max: 80,
};

// สถานะคำขอวันนี้ — กลุ่มสถานะ (key ใน requestStatuses) ที่นับรวมในแต่ละแถว · color = ชื่อสีใน Design Token
// received = คำขอที่ยื่นวันนี้ทั้งหมด (statuses: null)
export const todayStatusGroups = [
  { key: "received", color: "chart-series-1", statuses: null },
  { key: "inProgress", color: "status-info-fg", statuses: ["received", "checking", "pending", "approved", "paid"] },
  { key: "awaitingPayment", color: "status-warning-fg", statuses: ["awaitingPayment"] },
  { key: "issued", color: "status-success-fg", statuses: ["issued", "readyToDeliver", "completed"] },
  { key: "invalid", color: "status-danger-fg", statuses: ["invalid", "rejected", "paymentFailed"] },
];

// สถานะการเชื่อมโยงระบบ — state: connected | normal | slow
export const systemLinks = [
  { name: "Thailand NSW", detail: "ebMS 2.0 · ผ่าน GIN", state: "connected" },
  { name: "ebXML Gateway", detail: "คิวรอส่ง 2 · Retry 1", state: "normal" },
  { name: "ธนาคาร A (e-Payment)", detail: "รหัส 006", state: "connected" },
  { name: "ธนาคาร B (e-Payment)", detail: "รหัส 014", state: "slow" },
  { name: "กรมศุลกากร e-Licensing", detail: "ส่งข้อมูลล่าสุด 10:21", state: "connected" },
];

// ใบรับรอง PKI ใกล้หมดอายุ
export const pkiExpiring = { count: 2, daysLeft: 21 };

// เวลาปัจจุบันของภาพ (ใช้คำนวณคำขอที่รอนาน)
export const now = "2026-10-26T11:20:00+07:00";
// รอนานกว่านี้ (นาที) แสดง badge ส้ม
export const longWaitMinutes = 120;
