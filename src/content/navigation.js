// เมนูของ Portal และ Sidebar ของ Back Office (ตาม Figma D01 และ D07)
// to = ชื่อ route · badge = key ใน mocks/users.js (badges)
// icon ของ adminNav = ชื่อไฟล์ใน src/assets/icons (ไอคอนเส้นจาก Figma)
// key ของ adminNav = รหัสเมนูในตารางสิทธิ์ (mocks/users-roles.js) และ route meta.permission — ต้องไม่ซ้ำกัน

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
          { title: "คู่มือการใช้งาน", to: { name: "portal-laws", query: { tab: "manual" } } },
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
      { title: "นโยบายความเป็นส่วนตัว", to: { name: "portal-cookies", query: { tab: "privacy" } } },
    ],
    visitors: (total, today) =>
      `ผู้เข้าชมทั้งหมด ${total.toLocaleString("th-TH")} ครั้ง · วันนี้ ${today.toLocaleString("th-TH")}`,
  },
};

export const adminNav = [
  { group: "ภาพรวม", items: [{ key: "home", title: "หน้าหลัก", icon: "home", to: { name: "admin-home" } }] },
  {
    group: "งานบริการ",
    items: [
      { key: "operators", title: "ทะเบียนผู้ประกอบการ", icon: "building", to: { name: "admin-operators" } },
      { key: "thnsw", title: "พิจารณาอนุมัติ THNSW", icon: "user-check", to: { name: "admin-thnsw" }, badge: "thnsw" },
      { key: "requests", title: "คำขอใบรับรองฯ", icon: "file-text", to: { name: "admin-requests" }, badge: "requests" },
      { key: "tracking", title: "ติดตามสถานะคำขอ", icon: "route", to: { name: "admin-tracking" } },
      { key: "certificates", title: "ข้อมูลใบรับรองฯ", icon: "award", to: { name: "admin-certificates" } },
    ],
  },
  {
    group: "การเงิน",
    items: [
      { key: "payments", title: "ติดตามการชำระเงิน", icon: "credit-card", to: { name: "admin-payments" } },
      { key: "receipts", title: "ใบเสร็จรับเงิน", icon: "receipt", to: { name: "admin-receipts" } },
    ],
  },
  {
    group: "ข้อมูลหลัก",
    items: [
      { key: "outbreak", title: "พื้นที่โรคระบาด", icon: "map", to: { name: "admin-outbreak-areas" } },
      { key: "masterData", title: "ข้อมูลหลักอื่น ๆ", icon: "database", to: { name: "admin-master-data" } },
    ],
  },
  {
    group: "รายงาน",
    items: [
      { key: "reports", title: "รายงานสรุป", icon: "bar-chart", to: { name: "admin-reports" } },
      { key: "visitors", title: "รายงานผู้เข้าชม", icon: "eye", to: { name: "admin-visitors" } },
    ],
  },
  // กลุ่มเว็บไซต์ (TOR 4.5 — Figma ยังไม่มี)
  {
    group: "เว็บไซต์ประชาสัมพันธ์",
    items: [
      { key: "content", title: "จัดการเนื้อหา", icon: "book", to: { name: "admin-content" } },
      { key: "surveys", title: "แบบสอบถาม", icon: "clipboard-check", to: { name: "admin-surveys" } },
    ],
  },
  {
    group: "ผู้ดูแลระบบ",
    items: [
      { key: "users", title: "ผู้ใช้งานและสิทธิ์", icon: "users", to: { name: "admin-users" } },
      { key: "ebxml", title: "ติดตาม ebXML", icon: "server", to: { name: "admin-ebxml" } },
      { key: "pki", title: "ใบรับรอง PKI", icon: "key", to: { name: "admin-pki" } },
      { key: "cpa", title: "ตั้งค่า CPA", icon: "settings", to: { name: "admin-cpa" } },
      { key: "api", title: "ติดตาม API", icon: "code", to: { name: "admin-api" } },
      { key: "backofficeSync", title: "ส่งข้อมูลระบบงานภายใน", icon: "refresh", to: { name: "admin-backoffice-sync" } },
      { key: "auditLog", title: "Audit Log", icon: "list", to: { name: "admin-audit-log" } },
    ],
  },
];

export const adminText = {
  searchPlaceholder: "ค้นหา Reference No. / บริษัท",
  notifications: "การแจ้งเตือน",
  logout: "ออกจากระบบ",
  // สลับบทบาทเพื่อสาธิตเมนูตามสิทธิ์ (เฉพาะ Prototype — ระบบจริงสิทธิ์มาจากบัญชีที่เข้าสู่ระบบ)
  demo: {
    title: "สาธิตบทบาท (Prototype)",
    figma: "ตาม Figma (เห็นทุกเมนู)",
    switched: (label) => `สลับเป็น ${label} แล้ว เมนูแสดงตามสิทธิ์ของบทบาทนี้`,
    accounts: [
      { username: "superadmin", label: "Super Admin" },
      { username: "thanakorn.s", label: "Admin · เทคโนโลยีสารสนเทศ" },
      { username: "somrudee.j", label: "User · ฝ่ายบริการ" },
      { username: "prapaporn.m", label: "User · ฝ่ายการเงิน" },
      { username: "wipawan.t", label: "User · ผู้มีอำนาจลงนาม" },
    ],
  },
};
