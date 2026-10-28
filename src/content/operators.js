// ข้อความหน้า D08 · ทะเบียนผู้ประกอบการ (+ แท็บพิจารณาอนุมัติ THNSW B-04)
import { formatNumber } from "@/utils/format.js";

export const operatorsText = {
  breadcrumb: [{ title: "งานบริการ" }, { title: "ทะเบียนผู้ประกอบการ" }],
  title: "ทะเบียนผู้ประกอบการ",
  description: "ข้อมูลผู้ประกอบการที่ขึ้นทะเบียนผ่านระบบ NSW (ผู้ส่งออก / ตัวแทนออกของ / Counter Service)",
  addOperator: "เพิ่มผู้ประกอบการ",

  kpi: {
    registered: { label: "ผู้ประกอบการที่ลงทะเบียน", caption: (n) => `ผู้ส่งออก ${formatNumber(n)} ราย` },
    agents: { label: "ตัวแทนออกของ", caption: (n) => `ร่วมผูกสัมพันธ์ ${formatNumber(n)} คู่` },
    pendingThnsw: { label: "รอพิจารณาอนุมัติ", caption: "รายการใหม่จาก NSW" },
    suspended: { label: "ระงับสิทธิ์" },
  },

  filters: {
    taxId: { label: "เลขประจำตัวผู้เสียภาษี", placeholder: "เลข 13 หลัก" },
    branch: { label: "สาขา", placeholder: "00000" },
    company: { label: "ชื่อบริษัท (ไทย / Eng)", placeholder: "ระบุชื่อบริษัท" },
    access: { label: "สิทธิการเข้าใช้งาน" },
    service: { label: "ประเภทบริการ" },
    keyword: { label: "Profile / NSW Register ID", placeholder: "เช่น PRF-690412" },
    all: "ทั้งหมด",
  },

  tabs: {
    operators: "ผู้ประกอบการ",
    thnsw: "รอพิจารณาอนุมัติ THNSW",
    history: "ประวัติการแก้ไข",
  },

  columns: {
    taxId: "เลขผู้เสียภาษี / สาขา",
    company: "ชื่อบริษัท (ไทย / Eng)",
    type: "ประเภทกิจการ",
    service: "ประเภทบริการ",
    nswId: "NSW Register ID",
    access: "สิทธิการเข้าใช้งาน",
    lastRequest: "ยื่นคำขอล่าสุด",
    actions: "จัดการ",
    profileId: "Profile",
    receivedAt: "วันที่ได้รับจาก NSW",
    decision: "สถานะ",
    at: "วันที่แก้ไข",
    field: "รายการที่แก้ไข",
    change: "ข้อมูลเดิม → ข้อมูลใหม่",
    by: "ผู้แก้ไข",
  },

  branch: (b) => `สาขา ${b}`,
  timeSuffix: "น.",

  thnsw: {
    pending: { label: "รอพิจารณา", tone: "warning" },
    approved: { label: "อนุมัติแล้ว", tone: "success" },
    rejected: { label: "ไม่อนุมัติ", tone: "danger" },
    approve: "อนุมัติ",
    reject: "ไม่อนุมัติ",
    approveTitle: "ยืนยันการอนุมัติ THNSW",
    approveBody: (name) => `อนุมัติให้ "${name}" ใช้งานระบบ DDC e-Pinkforms และบันทึกเข้าทะเบียนผู้ประกอบการ`,
    rejectTitle: "ยืนยันไม่อนุมัติ THNSW",
    rejectBody: (name) => `ไม่อนุมัติคำขอขึ้นทะเบียนของ "${name}" ระบบจะแจ้งผลกลับไปยัง NSW`,
    reasonLabel: "เหตุผลที่ไม่อนุมัติ",
    reasonPlaceholder: "ระบุเหตุผล (แจ้งกลับผู้ประกอบการ)",
    approvedToast: (name) => `อนุมัติ ${name} เรียบร้อยแล้ว`,
    rejectedToast: (name) => `บันทึกไม่อนุมัติ ${name} เรียบร้อยแล้ว`,
  },

  dialogs: {
    viewTitle: "ข้อมูลผู้ประกอบการ",
    editTitle: "แก้ไขข้อมูลผู้ประกอบการ",
    addTitle: "เพิ่มผู้ประกอบการ",
    nameTh: "ชื่อบริษัท (ไทย)",
    nameEn: "ชื่อบริษัท (Eng)",
    deleteTitle: "ยืนยันการลบผู้ประกอบการ",
    deleteBody: (name) => `ต้องการลบ "${name}" ออกจากทะเบียนผู้ประกอบการหรือไม่ การลบไม่สามารถย้อนกลับได้`,
    deleteConfirm: "ลบผู้ประกอบการ",
    required: "กรุณากรอกข้อมูล",
    taxIdRule: "เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลข 13 หลัก",
  },

  toast: {
    saved: (name) => `บันทึกข้อมูล ${name} เรียบร้อยแล้ว`,
    added: (name) => `เพิ่ม ${name} เข้าทะเบียนแล้ว`,
    deleted: (name) => `ลบ ${name} เรียบร้อยแล้ว`,
    exported: "ส่งออกไฟล์ Excel ตามเงื่อนไขที่ค้นหาแล้ว (Prototype)",
  },

  historyBy: "ระบบ",

  empty: {
    icon: "fas fa-magnifying-glass",
    title: "ไม่พบผู้ประกอบการที่ตรงกับเงื่อนไข",
    description: "ลองเปลี่ยนเงื่อนไข หรือกด \"ล้าง\" เพื่อดูทั้งหมด",
    thnswTitle: "ไม่มีรายการรอพิจารณาอนุมัติ",
    thnswDescription: "รายการใหม่จาก NSW จะแสดงที่นี่",
    historyTitle: "ไม่พบประวัติการแก้ไข",
    clear: "ล้างเงื่อนไข",
  },
};
