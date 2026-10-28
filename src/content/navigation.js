// เมนูของ Portal และ Sidebar ของ Back Office (ตาม Figma D01 และ D07)
// to = ชื่อ route · badge = key ใน mocks/badges.js

export const portalNav = [
  { title: "หน้าแรก", to: { name: "portal-home" } },
  { title: "ข่าวประชาสัมพันธ์", to: { name: "portal-news" } },
  { title: "Dashboard", to: { name: "portal-dashboard" } },
  { title: "พื้นที่โรคระบาด", to: { name: "portal-outbreak" } },
  { title: "กฎหมายที่เกี่ยวข้อง", to: { name: "portal-laws" } },
  { title: "แบบสอบถาม", to: { name: "portal-survey" } },
];

export const portalText = {
  login: "เข้าสู่ระบบเจ้าหน้าที่",
  footer: {
    address: "กรมควบคุมโรค กระทรวงสาธารณสุข ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000",
    columns: [
      {
        title: "บริการ",
        links: [
          { title: "ขั้นตอนการขอใบรับรองฯ", to: { name: "portal-home", hash: "#steps" } },
          { title: "ตรวจสอบพื้นที่โรคระบาด", to: { name: "portal-outbreak" } },
          { title: "Dashboard สถิติ", to: { name: "portal-dashboard" } },
        ],
      },
      {
        title: "ข้อมูล",
        links: [
          { title: "กฎหมายที่เกี่ยวข้อง", to: { name: "portal-laws" } },
          { title: "คู่มือการใช้งาน", to: { name: "portal-laws" } },
          { title: "แบบสอบถามความพึงพอใจ", to: { name: "portal-survey" } },
        ],
      },
    ],
    contact: {
      title: "ติดต่อเรา",
      lines: ["0 2590 XXXX", "pinkforms@ddc.example", "จันทร์ – ศุกร์ 08:30 – 16:30 น."],
    },
    copyright: "© 2569 กรมควบคุมโรค",
    policies: [
      { title: "นโยบายคุกกี้", to: { name: "portal-cookies" } },
      { title: "นโยบายความเป็นส่วนตัว", to: { name: "portal-cookies" } },
    ],
    visitors: (total, today) =>
      `ผู้เข้าชมทั้งหมด ${total.toLocaleString("th-TH")} ครั้ง · วันนี้ ${today.toLocaleString("th-TH")}`,
  },
};

export const adminNav = [
  { group: "ภาพรวม", items: [{ title: "หน้าหลัก", icon: "fas fa-house", to: { name: "admin-home" } }] },
  {
    group: "งานบริการ",
    items: [
      { title: "ทะเบียนผู้ประกอบการ", icon: "far fa-building", to: { name: "admin-operators" } },
      { title: "พิจารณาอนุมัติ THNSW", icon: "fas fa-user-check", to: { name: "admin-thnsw" }, badge: "thnsw" },
      { title: "คำขอใบรับรองฯ", icon: "far fa-file-lines", to: { name: "admin-requests" }, badge: "requests" },
      { title: "ติดตามสถานะคำขอ", icon: "fas fa-route", to: { name: "admin-tracking" } },
      { title: "ข้อมูลใบรับรองฯ", icon: "fas fa-award", to: { name: "admin-certificates" } },
    ],
  },
  {
    group: "การเงิน",
    items: [
      { title: "ติดตามการชำระเงิน", icon: "far fa-credit-card", to: { name: "admin-payments" } },
      { title: "ใบเสร็จรับเงิน", icon: "fas fa-receipt", to: { name: "admin-receipts" } },
    ],
  },
  {
    group: "ข้อมูลหลัก",
    items: [
      { title: "พื้นที่โรคระบาด", icon: "far fa-map", to: { name: "admin-outbreak-areas" } },
      { title: "ข้อมูลหลักอื่น ๆ", icon: "fas fa-database", to: { name: "admin-master-data" } },
    ],
  },
  { group: "รายงาน", items: [{ title: "รายงานสรุป", icon: "fas fa-chart-column", to: { name: "admin-reports" } }] },
  {
    group: "ผู้ดูแลระบบ",
    items: [
      { title: "ผู้ใช้งานและสิทธิ์", icon: "fas fa-users", to: { name: "admin-users" } },
      { title: "ติดตาม ebXML", icon: "fas fa-server", to: { name: "admin-ebxml" } },
      { title: "ใบรับรอง PKI", icon: "fas fa-key", to: { name: "admin-pki" } },
      { title: "Audit Log", icon: "fas fa-list", to: { name: "admin-audit-log" } },
    ],
  },
];

export const adminText = {
  searchPlaceholder: "ค้นหา Reference No. / บริษัท",
  notifications: "การแจ้งเตือน",
  logout: "ออกจากระบบ",
};
