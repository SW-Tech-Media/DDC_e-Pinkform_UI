// ข้อมูลตัวอย่างของ Component ในหน้าคู่มือ Design System
// เลขคำขอ / สถานะในตัวอย่างอ้างคำขอจริงใน mocks/requests.js ให้ตรงกับหน้าจออื่น
import { requests } from "./requests.js";

export const demoBadges = [
  { tone: "success", label: "อนุมัติ" },
  { tone: "warning", label: "รอพิจารณา" },
  { tone: "danger", label: "ไม่อนุมัติ" },
  { tone: "info", label: "รับข้อมูล" },
  { tone: "neutral", label: "ฉบับร่าง" },
  { tone: "accent", label: "พร้อมจ่าย" },
];
// ตัวอย่าง wrap — สถานะยาวในคอลัมน์ตารางที่จำกัดความกว้าง (B-05)
export const demoWrapBadge = { tone: "warning", label: "รอการชำระเงิน BILLPAYMENT" };

export const demoAlerts = [
  { tone: "info", title: "ข้อมูล", body: "ระบบจะส่งอีเมลแจ้งผลให้ผู้ประกอบการโดยอัตโนมัติ" },
  { tone: "success", title: "บันทึกสำเร็จ", body: "อนุมัติคำขอ PF6910260027 เรียบร้อยแล้ว" },
  { tone: "warning", title: "ตรวจพบความไม่สอดคล้อง", body: "ประเทศปลายทางไม่ตรงกับข้อมูลใน Invoice" },
  { tone: "danger", title: "ส่งข้อมูลไม่สำเร็จ", body: "ไม่สามารถเชื่อมต่อ NSW ได้ กรุณาลองใหม่อีกครั้ง" },
];

export const demoKpis = [
  { icon: "far fa-file-lines", tone: "teal", label: "คำขอวันนี้", value: "128", trend: { direction: "up", value: "12%", text: "จากเมื่อวาน" } },
  { icon: "fas fa-hourglass-half", tone: "amber", label: "รอพิจารณา", value: "12", caption: "เกิน 24 ชม. 2 รายการ" },
];

export const demoTabs = [
  { value: "all", label: "ทั้งหมด", count: 132 },
  { value: "pending", label: "รอพิจารณา", count: 12 },
  { value: "approved", label: "อนุมัติ", count: 96 },
];

export const demoSegments = [
  { value: "day", label: "รายวัน" },
  { value: "month", label: "รายเดือน" },
  { value: "year", label: "รายปี" },
];

export const demoSteps = [
  { label: "รับข้อมูล", caption: "08:42" },
  { label: "ตรวจสอบ", caption: "08:43" },
  { label: "พิจารณา" },
  { label: "ชำระเงิน" },
  { label: "ออกใบรับรอง" },
];

export const demoLoginSteps = [{ label: "ชื่อผู้ใช้" }, { label: "PIN" }];

export const demoCountries = ["ไต้หวัน", "จีน", "ญี่ปุ่น", "ฮ่องกง"];

export const demoKeyValues = [
  { label: "เลขที่คำขอ", value: "PF6910260003" },
  { label: "ผู้ประกอบการ", value: "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด" },
  { label: "ประเทศปลายทาง", value: "ไต้หวัน" },
  { label: "จำนวนรายการ", value: "4 รายการ" },
];

export const demoTable = {
  headers: [
    { title: "เลขที่คำขอ", key: "ref" },
    { title: "ผู้ประกอบการ", key: "company" },
    { title: "สถานะ", key: "status", width: 160 },
    { title: "จัดการ", key: "actions", align: "end", sortable: false, width: 120 },
  ],
  // รอพิจารณา (ตรวจพบ) / เสร็จสมบูรณ์ / ไม่อนุมัติ
  items: ["PF6910260003", "PF6910260012", "PF6910250151"].map((ref) => {
    const r = requests.find((x) => x.ref === ref);
    return { ref, company: r.company, status: r.status, flagged: r.flagged > 0 };
  }),
};

export const demoChart = {
  labels: ["ส.ค.", "ก.ย.", "ต.ค."],
  series: [
    { name: "คำขอ", color: "chart-series-1", data: [420, 515, 486] },
    { name: "ใบรับรองที่ออก", color: "chart-series-2", data: [380, 470, 455] },
  ],
};

export const demoEntry = {
  icon: "fas fa-display",
  tone: "teal",
  title: "Card/Quick Link",
  description: "ทั้งการ์ดกดได้ ขยับขึ้นเมื่อชี้",
  cta: "ไปที่หน้า Prototype",
  to: { name: "prototype" },
};

export const demoEmpty = {
  icon: "fas fa-inbox",
  tone: "neutral",
  title: "ไม่พบข้อมูล",
  description: "ลองเปลี่ยนเงื่อนไขการค้นหา",
};

export const demoCode = {
  title: "ebXML Header",
  caption: "MessageHeader",
  lines: [
    { text: "<eb:MessageHeader>", accent: true },
    { text: "<eb:From>DDC-PINKFORMS</eb:From>", indent: 1 },
    { text: "<eb:To>THNSW</eb:To>", indent: 1 },
    { text: "<eb:Action>DDCPINKFORM</eb:Action>", indent: 1 },
    { text: "</eb:MessageHeader>", accent: true },
  ],
};

export const demoDialog = {
  title: "ยืนยันข้อมูลคำขอ",
  subtitle: "PF6910260003",
  confirmTitle: "ลบผู้ใช้งานนี้?",
  confirmMessage: "ผู้ใช้งานจะไม่สามารถเข้าสู่ระบบได้อีก",
  confirmText: "ลบผู้ใช้งาน",
};
