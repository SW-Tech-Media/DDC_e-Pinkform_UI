// ข้อมูลจำลองหน้า B-21 · จัดการเนื้อหาเว็บไซต์ (ข่าว / กฎหมาย / คู่มือ) — เสนอเพิ่ม ยังไม่มีใน Figma
// ข่าว 3 รายการแรกตรงกับ news ใน mocks/portal.js (newsId ใช้เปิดหน้าตัวอย่าง P-04)
import { news } from "./portal.js";

export const contentToday = "2026-10-26";
export const contentNow = "2026-10-26T10:15:00";

export const contentSections = ["news", "laws", "manuals"];

export const contentCategories = {
  news: ["ประชาสัมพันธ์", "ประกาศ", "อบรม"],
  laws: ["พระราชบัญญัติ", "ประกาศกรมควบคุมโรค", "ระเบียบ / แนวทาง"],
  manuals: ["คู่มือผู้ประกอบการ", "คู่มือเจ้าหน้าที่", "เอกสารทางเทคนิค"],
};

export const contentStatuses = {
  draft: { label: "ฉบับร่าง", tone: "neutral" },
  published: { label: "เผยแพร่", tone: "success" },
  hidden: { label: "ซ่อน", tone: "warning" },
};

const body =
  "กรมควบคุมโรค โดยกองโรคติดต่อทั่วไป ขอแจ้งให้ผู้ประกอบการและผู้เกี่ยวข้องทราบรายละเอียดตามเอกสารแนบ";

export const contentItems = [
  ...news.map((n, i) => ({
    id: i + 1,
    section: "news",
    newsId: n.id,
    title: n.title,
    category: n.category,
    publishedOn: n.date,
    status: "published",
    editor: ["สมฤดี ใจดี", "สมชาย ระวังภัย", "สมฤดี ใจดี"][i],
    updatedAt: `${n.date}T09:30:00`,
    body,
    attachments: i === 1 ? ["ประกาศพื้นที่เฝ้าระวัง_ต.ค.69.pdf"] : [],
  })),
  {
    id: 4,
    section: "news",
    newsId: "N004",
    title: "ปิดปรับปรุงระบบ DDC e-Pinkforms ชั่วคราว วันเสาร์ที่ 31 ตุลาคม 2569 เวลา 22.00 – 24.00 น.",
    category: "ประกาศ",
    publishedOn: "2026-10-28",
    status: "draft",
    editor: "สมฤดี ใจดี",
    updatedAt: "2026-10-26T09:05:00",
    body,
    attachments: [],
  },
  {
    id: 5,
    section: "news",
    newsId: "N005",
    title: "สรุปผลการประชุมชี้แจงการเชื่อมโยงข้อมูลผ่าน NSW ครั้งที่ 2/2569",
    category: "อบรม",
    publishedOn: "2026-09-22",
    status: "hidden",
    editor: "สมชาย ระวังภัย",
    updatedAt: "2026-10-01T14:20:00",
    body,
    attachments: ["สรุปการประชุม_2-2569.pdf", "เอกสารนำเสนอ.pdf"],
  },
  {
    id: 6,
    section: "laws",
    title: "พระราชบัญญัติโรคติดต่อ พ.ศ. 2558",
    category: "พระราชบัญญัติ",
    publishedOn: "2026-01-15",
    status: "published",
    editor: "สมฤดี ใจดี",
    updatedAt: "2026-01-15T10:00:00",
    body,
    attachments: ["พรบ.โรคติดต่อ_2558.pdf"],
  },
  {
    id: 7,
    section: "laws",
    title: "ประกาศกรมควบคุมโรค เรื่อง หลักเกณฑ์การออกใบรับรองแหล่งผลิตแหล่งกำเนิดอาหารปลอดโรค",
    category: "ประกาศกรมควบคุมโรค",
    publishedOn: "2026-06-01",
    status: "published",
    editor: "สมชาย ระวังภัย",
    updatedAt: "2026-06-01T08:45:00",
    body,
    attachments: ["ประกาศกรม_หลักเกณฑ์ใบรับรอง.pdf"],
  },
  {
    id: 8,
    section: "laws",
    title: "ระเบียบการรับชำระค่าธรรมเนียมผ่านระบบ e-Payment",
    category: "ระเบียบ / แนวทาง",
    publishedOn: "2026-10-30",
    status: "draft",
    editor: "สมฤดี ใจดี",
    updatedAt: "2026-10-25T16:10:00",
    body,
    attachments: [],
  },
  {
    id: 9,
    section: "manuals",
    title: "คู่มือการยื่นคำขอใบรับรองฯ ผ่าน National Single Window สำหรับผู้ประกอบการ",
    category: "คู่มือผู้ประกอบการ",
    publishedOn: "2026-10-01",
    status: "published",
    editor: "สมฤดี ใจดี",
    updatedAt: "2026-10-01T11:00:00",
    body,
    attachments: ["คู่มือผู้ประกอบการ_v1.2.pdf"],
  },
  {
    id: 10,
    section: "manuals",
    title: "คู่มือการตรวจสอบและอนุมัติคำขอ สำหรับเจ้าหน้าที่ฝ่ายบริการ",
    category: "คู่มือเจ้าหน้าที่",
    publishedOn: "2026-10-01",
    status: "hidden",
    editor: "ธนกร ศรีสุข",
    updatedAt: "2026-10-05T13:30:00",
    body,
    attachments: ["คู่มือเจ้าหน้าที่_v1.0.pdf"],
  },
  {
    id: 11,
    section: "manuals",
    title: "API Specification และ Data Dictionary (REST / SOAP)",
    category: "เอกสารทางเทคนิค",
    publishedOn: "2026-10-12",
    status: "published",
    editor: "ธนกร ศรีสุข",
    updatedAt: "2026-10-12T15:40:00",
    body,
    attachments: ["API_Specification_v2.pdf", "Data_Dictionary.xlsx"],
  },
];
