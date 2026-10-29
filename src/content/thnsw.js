// ข้อความหน้า B-04 · พิจารณาอนุมัติ THNSW (Figma ยังไม่มี — ออกแบบตามสไตล์ D08)
import { formatNumber } from "@/utils/format.js";

export const thnswText = {
  breadcrumb: [{ title: "งานบริการ" }, { title: "พิจารณาอนุมัติ THNSW" }],
  title: "พิจารณาอนุมัติ THNSW",
  description: "คำขอขึ้นทะเบียนผู้ใช้บริการที่ส่งมาจาก NSW ผ่าน ebXML Gateway — ตรวจสอบข้อมูล แล้วอนุมัติพร้อมกำหนดสิทธิ์ หรือไม่อนุมัติพร้อมเหตุผล",
  goOperators: "ทะเบียนผู้ประกอบการ",

  kpi: {
    pending: { label: "รอพิจารณา", caption: "รายการใหม่จาก NSW" },
    approvedToday: { label: "อนุมัติวันนี้", caption: (n) => `อนุมัติแล้วทั้งหมด ${formatNumber(n)} ราย` },
    rejected: { label: "ไม่อนุมัติ", caption: "แจ้งผลกลับ NSW แล้ว" },
  },

  filters: {
    profile: { label: "Profile", placeholder: "เช่น PRF-690412" },
    nswId: { label: "NSW Register ID", placeholder: "เช่น NSW6406611" },
    access: { label: "สิทธิ์การเข้าใช้งาน (ที่ขอ)" },
    company: { label: "ชื่อบริษัท / เลขผู้เสียภาษี", placeholder: "ระบุชื่อหรือเลข 13 หลัก" },
    all: "ทั้งหมด",
  },

  tabs: { pending: "รอพิจารณา", approved: "อนุมัติแล้ว", rejected: "ไม่อนุมัติ" },

  columns: {
    profile: "Profile / NSW Register ID",
    taxId: "เลขผู้เสียภาษี / สาขา",
    company: "ชื่อบริษัท / เลขผู้เสียภาษี",
    access: "สิทธิ์ที่ขอ",
    checks: "ผลตรวจ",
    receivedAt: "วันที่ได้รับจาก NSW",
    decidedAt: "วันที่พิจารณา",
    decidedBy: "ผู้พิจารณา",
    result: "สิทธิ์ / ประเภทบริการ",
    reason: "เหตุผล",
    actions: "จัดการ",
  },
  branch: (b) => `สาขา ${b}`,
  timeSuffix: "น.",

  status: {
    pending: { label: "รอพิจารณา", tone: "warning" },
    approved: { label: "อนุมัติแล้ว", tone: "success" },
    rejected: { label: "ไม่อนุมัติ", tone: "danger" },
  },
  checkBadge: { pass: "ผ่าน", fail: "ไม่ผ่าน", warn: "ผ่าน (มีข้อสังเกต)" },

  actions: { view: "ดูรายละเอียด", approve: "อนุมัติ", reject: "ไม่อนุมัติ" },

  detail: {
    title: "รายละเอียดคำขอขึ้นทะเบียน",
    subtitle: (profile, nswId) => `${profile} · ${nswId}`,
    company: "ข้อมูลบริษัท",
    nsp: "NSP ที่เลือกใช้บริการ",
    nspSince: (d) => `เปิดใช้บริการ ${d}`,
    checks: "ผลตรวจสอบข้อความจาก NSW",
    decision: "ผลการพิจารณา",
    fields: {
      taxId: "เลขประจำตัวผู้เสียภาษี",
      branch: "สาขา",
      nameTh: "ชื่อบริษัท (ไทย)",
      nameEn: "ชื่อบริษัท (Eng)",
      type: "ประเภทกิจการ / สิทธิ์ที่ขอ",
      registeredOn: "วันที่จดทะเบียนนิติบุคคล",
      capital: "ทุนจดทะเบียน (บาท)",
      address: "ที่อยู่",
      contact: "ผู้ติดต่อ",
      email: "อีเมล",
      phone: "โทรศัพท์",
      receivedAt: "วันเวลาที่ได้รับ",
    },
    signature: "ลายมือชื่อดิจิทัล",
    signatureCaption: (issuer, serial, validTo) => `ออกโดย ${issuer} · Serial ${serial} · หมดอายุ ${validTo}`,
    schema: "XML Schema",
    schemaCaption: (v) => `ตรวจกับ ${v}`,
    messageId: "Message ID",
    decidedBy: (name, at) => `โดย ${name} · ${at} น.`,
    accessLabel: "สิทธิ์การเข้าใช้งาน",
    serviceLabel: "ประเภทบริการ",
    reasonLabel: "เหตุผล",
    failHint: "ผลตรวจไม่ผ่าน — แนะนำให้ไม่อนุมัติและแจ้งให้ผู้ประกอบการส่งข้อมูลใหม่",
  },

  approve: {
    title: "อนุมัติและกำหนดสิทธิ์",
    subtitle: (name) => name,
    info: "เมื่ออนุมัติ ระบบจะสร้างข้อมูลในทะเบียนผู้ประกอบการ และส่งผลการขึ้นทะเบียนกลับไปยัง NSW (ebXML)",
    access: "สิทธิ์การเข้าใช้งาน",
    service: "ประเภทบริการ",
    type: "ประเภทกิจการ",
    next: "อนุมัติ",
    confirmTitle: "ยืนยันการอนุมัติ THNSW",
    confirmBody: (name, access, service) =>
      `อนุมัติ "${name}" สิทธิ์ ${access} · ประเภทบริการ ${service} และแจ้งผลกลับ NSW`,
    confirm: "ยืนยันอนุมัติ",
    done: (name) => `อนุมัติ ${name} และบันทึกเข้าทะเบียนผู้ประกอบการแล้ว`,
  },

  reject: {
    title: "ไม่อนุมัติคำขอขึ้นทะเบียน",
    reasonLabel: "เหตุผลที่ไม่อนุมัติ",
    reasonPlaceholder: "ระบุเหตุผล (ระบบจะแจ้งกลับผู้ประกอบการผ่าน NSW)",
    presetsLabel: "เหตุผลที่ใช้บ่อย",
    presets: [
      "ผลตรวจลายมือชื่อดิจิทัลไม่ผ่าน",
      "ข้อมูลไม่ถูกต้องตาม XML Schema",
      "ข้อมูลนิติบุคคลไม่ตรงกับกรมพัฒนาธุรกิจการค้า",
      "ขึ้นทะเบียนซ้ำกับผู้ประกอบการที่มีอยู่",
    ],
    required: "กรุณาระบุเหตุผล",
    confirm: "บันทึกไม่อนุมัติ",
    done: (name) => `บันทึกไม่อนุมัติ ${name} และแจ้งผลกลับ NSW แล้ว`,
  },

  empty: {
    icon: "fas fa-magnifying-glass",
    title: "ไม่พบคำขอที่ตรงกับเงื่อนไข",
    description: "ลองเปลี่ยนเงื่อนไข หรือกด \"ล้าง\" เพื่อดูทั้งหมด",
    pendingTitle: "ไม่มีรายการรอพิจารณา",
    pendingDescription: "คำขอขึ้นทะเบียนใหม่จาก NSW จะแสดงที่นี่",
  },
};
