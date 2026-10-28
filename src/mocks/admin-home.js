// ข้อมูลจำลองหน้าหลักเจ้าหน้าที่ (Figma D07 · Admin / Home – Overview)

// วันที่ของภาพรวม
export const overviewDate = "2026-10-26";

// KPI 4 ใบ — label/caption อยู่ใน content/admin-home.js (key ตรงกัน)
export const kpis = {
  newToday: { value: 18, trend: { direction: "up", value: "12%" } },
  pending: { value: 12, oldestWait: { hours: 2, minutes: 15 } },
  awaitingPayment: { value: 7 },
  issuedMonth: { value: 426, trend: { direction: "up", value: "8.4%" } },
};

// กราฟ 14 วันล่าสุด (13 – 26 ต.ค. 2569)
export const dailyChart = {
  labels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"],
  requests: [53, 62, 49, 72, 68, 23, 15, 59, 75, 66, 71, 73, 26, 19],
  issued: [50, 58, 48, 68, 62, 20, 14, 57, 72, 62, 67, 70, 22, 6],
  max: 80,
};

// สถานะคำขอวันนี้ — color = ชื่อสีใน Design Token
export const todayStatus = [
  { key: "received", count: 18, color: "chart-series-1" },
  { key: "inProgress", count: 12, color: "status-info-fg" },
  { key: "awaitingPayment", count: 7, color: "status-warning-fg" },
  { key: "issued", count: 41, color: "status-success-fg" },
  { key: "invalid", count: 3, color: "status-danger-fg" },
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
export const now = "2026-10-26T10:57:00+07:00";
// รอนานกว่านี้ (นาที) แสดง badge ส้ม
export const longWaitMinutes = 120;
