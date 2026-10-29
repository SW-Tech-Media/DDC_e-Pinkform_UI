// ข้อมูลจำลองหน้า B-20 · รายงานผู้เข้าชมเว็บไซต์ (TOR 4.1.13)
// ยอดรวมและวันนี้ใช้ตัวนับเดียวกับ Footer (mocks/users.js → visitors)
import { visitors } from "./users.js";

export const visitorTotals = visitors; // { total, today }
export const visitorsNow = "2026-10-26T14:20:00+07:00";

// รายวัน ต.ค. 2569 (1 – 26 ต.ค. — วันที่ 26 = วันนี้ ข้อมูลถึงเวลาปัจจุบัน)
export const dailyVisits = {
  month: "2026-10",
  visits: [1345, 1382, 578, 584, 1209, 1289, 1402, 1303, 1397, 704, 617, 1211, 1383, 1293, 1248, 1253, 706, 768, 1232, 1276, 1460, 1210, 1434, 669, 679, visitors.today],
  unique: [989, 984, 419, 402, 885, 854, 972, 869, 928, 471, 438, 855, 918, 858, 852, 881, 483, 548, 870, 880, 1046, 858, 1024, 483, 479, 717],
};

// รายเดือน ย้อนหลัง 12 เดือน (พ.ย. 2568 – ต.ค. 2569) — ต.ค. = ผลรวมรายวันข้างบน
const octVisits = dailyVisits.visits.reduce((a, b) => a + b, 0);
const octUnique = dailyVisits.unique.reduce((a, b) => a + b, 0);
export const monthlyVisits = {
  months: ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"],
  visits: [29840, 27315, 31206, 30588, 35120, 26904, 33477, 34812, 36105, 35290, 33962, octVisits],
  unique: [20512, 18870, 21733, 21390, 24611, 18842, 23240, 24305, 25190, 24688, 23716, octUnique],
};

// หน้าที่เข้าชมมากที่สุด (เดือนนี้)
export const topPages = [
  { id: 1, title: "หน้าแรก", path: "/", views: 9842, avgSeconds: 48 },
  { id: 2, title: "ตรวจสอบพื้นที่โรคระบาด", path: "/outbreak-areas", views: 5317, avgSeconds: 112 },
  { id: 3, title: "ตรวจสอบใบรับรองฯ", path: "/verify", views: 4106, avgSeconds: 75 },
  { id: 4, title: "ขั้นตอนการขอใบรับรองฯ ผ่าน NSW", path: "/how-to", views: 3288, avgSeconds: 156 },
  { id: 5, title: "ข่าวประชาสัมพันธ์", path: "/news", views: 2451, avgSeconds: 64 },
  { id: 6, title: "Dashboard สถิติการส่งออก", path: "/dashboard", views: 1873, avgSeconds: 131 },
  { id: 7, title: "ดาวน์โหลดเอกสาร / คู่มือ", path: "/downloads", views: 1102, avgSeconds: 39 },
  { id: 8, title: "ติดต่อเรา", path: "/contact", views: 695, avgSeconds: 27 },
];

// สัดส่วนอุปกรณ์ (เดือนนี้) — share เป็น %
export const deviceShare = [
  { key: "desktop", share: 61.4 },
  { key: "mobile", share: 33.2 },
  { key: "tablet", share: 5.4 },
];
