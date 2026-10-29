// ข้อความหน้า B-20 · รายงานผู้เข้าชมเว็บไซต์ — TOR 4.1.13 (Figma ยังไม่มี — ออกแบบตามสไตล์ D03/D13)
import { formatNumber } from "@/utils/format.js";

export const visitorsText = {
  breadcrumb: [{ title: "รายงาน" }, { title: "รายงานผู้เข้าชมเว็บไซต์" }],
  title: "รายงานผู้เข้าชมเว็บไซต์",
  description: "สถิติการเข้าชมเว็บไซต์ประชาสัมพันธ์ DDC e-Pinkforms จากตัวนับผู้เข้าชม (นับเฉพาะผู้ที่ยอมรับคุกกี้สถิติ)",
  exportCsv: "ส่งออก CSV",
  exported: "ส่งออกรายงานผู้เข้าชมแล้ว",
  csvFile: (mode) => `visitors-${mode}.csv`,
  csvHeaders: (mode) => [mode === "daily" ? "วันที่" : "เดือน", "จำนวนครั้งที่เข้าชม", "ผู้เข้าชมไม่ซ้ำ"],

  kpi: {
    total: { label: "ผู้เข้าชมทั้งหมด", caption: "นับตั้งแต่เปิดใช้งานระบบ" },
    today: { label: "วันนี้", caption: (date) => `ข้อมูลถึง ${date} น.` },
    month: { label: "เดือนนี้", caption: (from, to) => `${from} – ${to}` },
    average: { label: "เฉลี่ยต่อวัน", caption: (days) => `จาก ${formatNumber(days)} วันของเดือนนี้` },
    trendText: "เทียบค่าเฉลี่ยเดือนก่อน",
  },

  chart: {
    title: "จำนวนผู้เข้าชม",
    dailySubtitle: (from, to) => `รายวัน ${from} – ${to}`,
    monthlySubtitle: (from, to) => `รายเดือน ${from} – ${to}`,
    modeLabel: "มุมมองกราฟ",
    modes: [
      { value: "daily", label: "รายวัน" },
      { value: "monthly", label: "รายเดือน" },
    ],
    visits: "จำนวนครั้งที่เข้าชม",
    unique: "ผู้เข้าชมไม่ซ้ำ",
    dailyAxis: "วันที่ (ต.ค.)",
  },

  pages: {
    title: "หน้าที่เข้าชมมากที่สุด",
    subtitle: "เดือนนี้",
    headers: [
      { title: "อันดับ", key: "rank", sortable: false },
      { title: "หน้า", key: "title", sortable: false },
      { title: "จำนวนครั้ง", key: "views", align: "end", sortable: false },
      { title: "สัดส่วน", key: "share", sortable: false },
      { title: "เวลาเฉลี่ย", key: "avg", align: "end", sortable: false },
    ],
    duration: (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} นาที`,
  },

  devices: {
    title: "สัดส่วนอุปกรณ์",
    subtitle: "เดือนนี้",
    items: {
      desktop: { label: "คอมพิวเตอร์ (Desktop)", icon: "fas fa-desktop" },
      mobile: { label: "โทรศัพท์มือถือ (Mobile)", icon: "fas fa-mobile-screen" },
      tablet: { label: "แท็บเล็ต (Tablet)", icon: "fas fa-tablet-screen-button" },
    },
    visits: (n) => `${formatNumber(n)} ครั้ง`,
    note: "นับจากผู้เข้าชมที่ยอมรับคุกกี้สถิติตามนโยบายคุกกี้ (TOR 4.1.14)",
  },
};
