// ทะเบียนหน้าจอทั้งหมดของ Prototype — router และหน้ารวมหน้าจอ (/prototype) อ่านจากที่นี่
// figma = รหัสหน้าจอใน Figma · code = รหัสในรายการหน้าจอ (md/system-overview.md)
// design: false = หน้าที่ยังไม่มีใน Figma (แสดงเป็นหน้ากำลังจัดทำ)
// permission = key เมนูในตารางสิทธิ์ (router/index.js อ่านจาก adminNav ให้อัตโนมัติ ระบุเองเฉพาะหน้าย่อยที่ไม่อยู่ใน Sidebar)
// hint = วิธีสาธิตกรณียกเว้น (ค่าตัวอย่าง / query string) แสดงใต้ชื่อหน้าจอในหน้ารวมหน้าจอ
import { authText } from "@/content/auth.js";

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
  news: () => import("@/views/portal/NewsView.vue"),
  newsDetail: () => import("@/views/portal/NewsDetailView.vue"),
  laws: () => import("@/views/portal/LawsView.vue"),
  survey: () => import("@/views/portal/SurveyView.vue"),
  policy: () => import("@/views/portal/PolicyView.vue"),
  forgotPin: () => import("@/views/auth/ForgotPinView.vue"),
  forgotPassword: () => import("@/views/auth/ForgotPasswordView.vue"),
  thnsw: () => import("@/views/admin/ThnswView.vue"),
  certificates: () => import("@/views/admin/CertificatesView.vue"),
  receipts: () => import("@/views/admin/ReceiptsView.vue"),
  reports: () => import("@/views/admin/ReportsView.vue"),
  masterData: () => import("@/views/admin/MasterDataView.vue"),
  auditLog: () => import("@/views/admin/AuditLogView.vue"),
  visitors: () => import("@/views/admin/VisitorsView.vue"),
  content: () => import("@/views/admin/ContentView.vue"),
  surveys: () => import("@/views/admin/SurveysView.vue"),
  cpa: () => import("@/views/admin/CpaView.vue"),
  api: () => import("@/views/admin/ApiMonitorView.vue"),
  backofficeSync: () => import("@/views/admin/BackofficeSyncView.vue"),
  portalPending: () => import("@/views/portal/PortalPendingView.vue"),
  adminPending: () => import("@/views/admin/AdminPendingView.vue"),
  forbidden: () => import("@/views/admin/ForbiddenView.vue"),
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
  s("portal", "portal-news", "/portal/news", view.news, "ข่าวประชาสัมพันธ์", [], "P-04"),
  s("portal", "portal-news-detail", "/portal/news/:id", view.newsDetail, "รายละเอียดข่าว", [], "P-04", { example: { id: "1" } }),
  s("portal", "portal-dashboard", "/portal/dashboard", view.portalDashboard, "Dashboard สถิติใบรับรองฯ", ["D02"], "P-02"),
  s("portal", "portal-outbreak", "/portal/outbreak", view.portalOutbreak, "ตรวจสอบพื้นที่โรคระบาด", ["D03", "S02"], "P-03"),
  s("portal", "portal-laws", "/portal/laws", view.laws, "กฎหมายและคู่มือที่เกี่ยวข้อง", [], "P-05"),
  s("portal", "portal-survey", "/portal/survey", view.survey, "แบบสอบถามความพึงพอใจ", [], "P-06"),
  s("portal", "portal-cookies", "/portal/cookies", view.policy, "นโยบายคุกกี้ / ความเป็นส่วนตัว", [], "P-07"),

  s("auth", "admin-login", "/admin/login", view.login, "เข้าสู่ระบบ (Username / Password)", ["D04"], "B-01", {
    hint: authText.demoHints.login,
  }),
  s("auth", "admin-pin", "/admin/login/pin", view.pin, "เข้าสู่ระบบ (PIN 6 หลัก)", ["D05"], "B-01.2"),
  s("auth", "admin-forgot-pin", "/admin/forgot-pin", view.forgotPin, "ลืม PIN / ตั้ง PIN ใหม่", [], "B-01.4"),
  s("auth", "admin-forgot-password", "/admin/forgot-password", view.forgotPassword, "ลืมรหัสผ่าน / ตั้งรหัสผ่านใหม่", [], "B-01.5", {
    proposed: true,
    hint: authText.demoHints.forgotPassword,
  }),
  s("auth", "admin-set-pin", "/admin/set-pin", view.setPin, "ยืนยันอีเมล ตั้งรหัสผ่านและ PIN", ["D06"], "B-01.3", {
    hint: authText.demoHints.setPin,
  }),

  s("admin", "admin-home", "/admin", view.adminHome, "หน้าหลักเจ้าหน้าที่", ["D07"], "B-02"),
  s("admin", "admin-operators", "/admin/operators", view.operators, "ทะเบียนผู้ประกอบการ", ["D08"], "B-03"),
  s("admin", "admin-thnsw", "/admin/thnsw", view.thnsw, "พิจารณาอนุมัติ THNSW", [], "B-04"),
  s("admin", "admin-requests", "/admin/requests", view.requests, "คำขอใบรับรองฯ", ["D09", "D18"], "B-05"),
  s("admin", "admin-request-review", "/admin/requests/:ref", view.review, "พิจารณาคำขอ + Preview", ["D10", "D11"], "B-06 / B-07", {
    example: { ref: "PF6910260003" },
    permission: "requests",
  }),
  s("admin", "admin-tracking", "/admin/tracking", view.tracking, "ติดตามสถานะคำขอ", ["D12"], "B-09"),
  s("admin", "admin-certificates", "/admin/certificates", view.certificates, "ข้อมูลใบรับรองฯ", [], "B-10"),
  s("admin", "admin-payments", "/admin/payments", view.payments, "ติดตามการชำระเงิน", ["D13"], "B-11"),
  s("admin", "admin-receipts", "/admin/receipts", view.receipts, "ใบเสร็จรับเงิน", [], "B-12"),
  s("admin", "admin-reports", "/admin/reports", view.reports, "รายงานสรุป", [], "B-13"),
  s("admin", "admin-outbreak-areas", "/admin/outbreak-areas", view.outbreakAreas, "ข้อมูลพื้นที่โรคระบาด", ["D14"], "B-14"),
  s("admin", "admin-master-data", "/admin/master-data", view.masterData, "ข้อมูลหลักอื่น ๆ", [], "B-15"),
  s("admin", "admin-users", "/admin/users", view.users, "ผู้ใช้งานและสิทธิ์", ["D15"], "B-16"),
  s("admin", "admin-ebxml", "/admin/ebxml", view.ebxml, "ติดตามการรับ-ส่งข้อความ ebXML", ["D16"], "B-17"),
  s("admin", "admin-pki", "/admin/pki", view.pki, "จัดการใบรับรอง PKI", ["D17"], "B-18"),
  s("admin", "admin-audit-log", "/admin/audit-log", view.auditLog, "ประวัติการใช้งาน (Audit Log)", [], "B-19"),
  s("admin", "admin-visitors", "/admin/visitors", view.visitors, "รายงานผู้เข้าชมเว็บไซต์", [], "B-20"),
  s("admin", "admin-content", "/admin/content", view.content, "จัดการเนื้อหาเว็บไซต์", [], "B-21", { proposed: true }),
  s("admin", "admin-surveys", "/admin/surveys", view.surveys, "จัดการแบบสอบถามและผล", [], "B-22", { proposed: true }),
  s("admin", "admin-cpa", "/admin/cpa", view.cpa, "ตั้งค่า CPA / การเชื่อมต่อ ebMS", [], "B-23", { proposed: true }),
  s("admin", "admin-api", "/admin/api", view.api, "ติดตามการเชื่อมโยง API", [], "B-24", { proposed: true }),
  s("admin", "admin-forbidden", "/admin/forbidden", view.forbidden, "ไม่มีสิทธิ์เข้าใช้งาน", [], "B-00", { proposed: true }),
  s("admin", "admin-backoffice-sync", "/admin/backoffice-sync", view.backofficeSync, "ส่งข้อมูลระบบงานภายใน DDC", [], "B-25", { proposed: true }),
];

export const screenByName = Object.fromEntries(screens.map((x) => [x.name, x]));
