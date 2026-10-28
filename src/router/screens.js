// ทะเบียนหน้าจอทั้งหมดของ Prototype — router และหน้ารวมหน้าจอ (/prototype) อ่านจากที่นี่
// figma = รหัสหน้าจอใน Figma · code = รหัสในรายการหน้าจอ (md/system-overview.md)
// design: false = หน้าที่ยังไม่มีใน Figma (แสดงเป็นหน้ากำลังจัดทำ)

export const screenGroups = [
  { key: "portal", title: "เว็บไซต์ประชาสัมพันธ์ (Portal)", icon: "fas fa-globe", tone: "teal" },
  { key: "auth", title: "เข้าสู่ระบบเจ้าหน้าที่", icon: "fas fa-lock", tone: "pink" },
  { key: "admin", title: "ระบบหลังบ้าน (Back Office)", icon: "fas fa-table-columns", tone: "blue" },
];

const view = {
  portalHome: () => import("@/views/portal/PortalHomeView.vue"),
  portalDashboard: () => import("@/views/portal/PortalDashboardView.vue"),
  portalOutbreak: () => import("@/views/portal/PortalOutbreakView.vue"),
  login: () => import("@/views/auth/LoginView.vue"),
  pin: () => import("@/views/auth/PinView.vue"),
  setPin: () => import("@/views/auth/SetPinView.vue"),
  adminHome: () => import("@/views/admin/AdminHomeView.vue"),
  operators: () => import("@/views/admin/OperatorsView.vue"),
  requests: () => import("@/views/admin/RequestsView.vue"),
  review: () => import("@/views/admin/RequestReviewView.vue"),
  tracking: () => import("@/views/admin/TrackingView.vue"),
  payments: () => import("@/views/admin/PaymentsView.vue"),
  outbreakAreas: () => import("@/views/admin/OutbreakAreasView.vue"),
  users: () => import("@/views/admin/UsersView.vue"),
  ebxml: () => import("@/views/admin/EbxmlView.vue"),
  pki: () => import("@/views/admin/PkiView.vue"),
  portalPending: () => import("@/views/portal/PortalPendingView.vue"),
  adminPending: () => import("@/views/admin/AdminPendingView.vue"),
};

const s = (group, name, path, component, title, figma = [], code = "", extra = {}) => ({
  group,
  name,
  path,
  component,
  title,
  figma,
  code,
  design: figma.length > 0,
  ...extra,
});

export const screens = [
  s("portal", "portal-home", "/portal", view.portalHome, "หน้าแรกเว็บไซต์", ["D01", "S01"], "P-01"),
  s("portal", "portal-news", "/portal/news", view.portalPending, "ข่าวประชาสัมพันธ์", [], "P-04"),
  s("portal", "portal-dashboard", "/portal/dashboard", view.portalDashboard, "Dashboard สถิติใบรับรองฯ", ["D02"], "P-02"),
  s("portal", "portal-outbreak", "/portal/outbreak", view.portalOutbreak, "ตรวจสอบพื้นที่โรคระบาด", ["D03", "S02"], "P-03"),
  s("portal", "portal-laws", "/portal/laws", view.portalPending, "กฎหมายและคู่มือที่เกี่ยวข้อง", [], "P-05"),
  s("portal", "portal-survey", "/portal/survey", view.portalPending, "แบบสอบถามความพึงพอใจ", [], "P-06"),
  s("portal", "portal-cookies", "/portal/cookies", view.portalPending, "นโยบายคุกกี้ / ความเป็นส่วนตัว", [], "P-07"),

  s("auth", "admin-login", "/admin/login", view.login, "เข้าสู่ระบบ (Username / Password)", ["D04"], "B-01"),
  s("auth", "admin-pin", "/admin/login/pin", view.pin, "เข้าสู่ระบบ (PIN 6 หลัก)", ["D05"], "B-01.2"),
  s("auth", "admin-set-pin", "/admin/set-pin", view.setPin, "ยืนยันอีเมลและตั้ง PIN", ["D06"], "B-01.3"),

  s("admin", "admin-home", "/admin", view.adminHome, "หน้าหลักเจ้าหน้าที่", ["D07"], "B-02"),
  s("admin", "admin-operators", "/admin/operators", view.operators, "ทะเบียนผู้ประกอบการ", ["D08"], "B-03"),
  s("admin", "admin-thnsw", "/admin/thnsw", view.adminPending, "พิจารณาอนุมัติ THNSW", [], "B-04"),
  s("admin", "admin-requests", "/admin/requests", view.requests, "คำขอใบรับรองฯ", ["D09", "D18"], "B-05"),
  s("admin", "admin-request-review", "/admin/requests/:ref", view.review, "พิจารณาคำขอ + Preview", ["D10", "D11"], "B-06 / B-07", {
    example: { ref: "PF6910260003" },
  }),
  s("admin", "admin-tracking", "/admin/tracking", view.tracking, "ติดตามสถานะคำขอ", ["D12"], "B-09"),
  s("admin", "admin-certificates", "/admin/certificates", view.adminPending, "ข้อมูลใบรับรองฯ", [], "B-10"),
  s("admin", "admin-payments", "/admin/payments", view.payments, "ติดตามการชำระเงิน", ["D13"], "B-11"),
  s("admin", "admin-receipts", "/admin/receipts", view.adminPending, "ใบเสร็จรับเงิน", [], "B-12"),
  s("admin", "admin-reports", "/admin/reports", view.adminPending, "รายงานสรุป", [], "B-13"),
  s("admin", "admin-outbreak-areas", "/admin/outbreak-areas", view.outbreakAreas, "ข้อมูลพื้นที่โรคระบาด", ["D14"], "B-14"),
  s("admin", "admin-master-data", "/admin/master-data", view.adminPending, "ข้อมูลหลักอื่น ๆ", [], "B-15"),
  s("admin", "admin-users", "/admin/users", view.users, "ผู้ใช้งานและสิทธิ์", ["D15"], "B-16"),
  s("admin", "admin-ebxml", "/admin/ebxml", view.ebxml, "ติดตามการรับ-ส่งข้อความ ebXML", ["D16"], "B-17"),
  s("admin", "admin-pki", "/admin/pki", view.pki, "จัดการใบรับรอง PKI", ["D17"], "B-18"),
  s("admin", "admin-audit-log", "/admin/audit-log", view.adminPending, "ประวัติการใช้งาน (Audit Log)", [], "B-19"),
];

export const screenByName = Object.fromEntries(screens.map((x) => [x.name, x]));
