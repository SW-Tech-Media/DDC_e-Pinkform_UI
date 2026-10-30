// สร้างอัตโนมัติจาก docs/Traceability_TOR_Flow_Prototype.md ด้วย scripts/build-tor-trace.mjs — อย่าแก้ไฟล์นี้โดยตรง
export const torTraceSource = {"file":"docs/Traceability_TOR_Flow_Prototype.md","version":"0.3.6","date":"30/10/2569"};

export const torTrace = [
  {
    "id": "F-001",
    "kind": "F",
    "section": "4.1 คุณสมบัติพื้นฐาน (ส่วน Functional)",
    "tor": "4.1.10",
    "requirement": "กำหนดสิทธิ์ผู้ใช้แต่ละประเภท Admin จัดการผู้ใช้และสิทธิ์เองผ่านเบราว์เซอร์",
    "screenText": "B-16, B-00, Sidebar",
    "codes": [
      "B-16",
      "B-00"
    ],
    "status": "done",
    "note": "v0.3.5: ตารางสิทธิ์ ดู/เพิ่ม/แก้ไข/ลบ/อนุมัติ ครบ 21 เมนูของ Sidebar (permissionMenus จาก adminNav) · บันทึกแล้วเมนูของบัญชีนั้นเปลี่ยนทันที · Sidebar / route / ปุ่ม (อนุมัติ ไม่อนุมัติ ยกเลิก แก้ไข กระทบยอด) ตาม session.can() · เปิดเมนูที่ไม่มีสิทธิ์ → B-00 · ค่าเริ่มต้นต่อกลุ่มงานเป็นร่าง → Q-15"
  },
  {
    "id": "F-002",
    "kind": "F",
    "section": "4.1 คุณสมบัติพื้นฐาน (ส่วน Functional)",
    "tor": "4.1.12",
    "requirement": "รายงานรายชื่อผู้ใช้ทั้งหมด + ประวัติการจัดการผู้ใช้",
    "screenText": "B-16",
    "codes": [
      "B-16"
    ],
    "status": "done",
    "note": "แท็บประวัติการจัดการผู้ใช้"
  },
  {
    "id": "F-003",
    "kind": "F",
    "section": "4.1 คุณสมบัติพื้นฐาน (ส่วน Functional)",
    "tor": "4.1.13",
    "requirement": "นับผู้เข้าชม + รายงานวิเคราะห์พฤติกรรม",
    "screenText": "P-01 (footer), B-20",
    "codes": [
      "P-01",
      "B-20"
    ],
    "status": "done",
    "note": "รายวัน / รายเดือน, หน้าที่เข้าชมมากที่สุด, อุปกรณ์"
  },
  {
    "id": "F-004",
    "kind": "F",
    "section": "4.1 คุณสมบัติพื้นฐาน (ส่วน Functional)",
    "tor": "4.1.14",
    "requirement": "นโยบายคุกกี้ (ความหมาย การทำงาน วัตถุประสงค์ การลบ / ปฏิเสธ)",
    "screenText": "P-01 แถบคุกกี้, P-07",
    "codes": [
      "P-01",
      "P-07"
    ],
    "status": "done",
    "note": "มีปุ่มปฏิเสธทั้งหมด และหัวข้อวิธีลบ / ปฏิเสธคุกกี้"
  },
  {
    "id": "F-005",
    "kind": "F",
    "section": "4.2 กระบวนการทางระบบ",
    "tor": "4.2.1",
    "requirement": "กระบวนการยื่นคำขอใบรับรองทางอิเล็กทรอนิกส์",
    "screenText": "B-05, B-06, B-09, B-17",
    "codes": [
      "B-05",
      "B-06",
      "B-09",
      "B-17"
    ],
    "status": "done",
    "note": "ผู้ประกอบการยื่นผ่าน NSP/NSW (ไม่มีหน้าจอผู้ประกอบการ ตาม md/system-overview.md) — หลังบ้านรับ ตรวจ พิจารณา ติดตามได้ครบ"
  },
  {
    "id": "F-006",
    "kind": "F",
    "section": "4.2 กระบวนการทางระบบ",
    "tor": "4.2.2",
    "requirement": "รับชำระผ่าน Mobile / Internet Banking และออกใบรับรองอิเล็กทรอนิกส์",
    "screenText": "B-11, B-12, B-10",
    "codes": [
      "B-11",
      "B-12",
      "B-10"
    ],
    "status": "done",
    "note": "v0.3.5: การชำระ / ใบเสร็จ / ใบรับรองสร้างจากสถานะคำขอ ค่าบริการ 300 บาททุกหน้า (ค่าชั่วคราว Q-17) · v0.3.6: อนุมัติแล้วเกิดคำสั่งชำระใน B-11 (stores/payments.js)"
  },
  {
    "id": "F-007",
    "kind": "F",
    "section": "4.2 กระบวนการทางระบบ",
    "tor": "4.2.3",
    "requirement": "ผ่านพิธีการศุลกากรไร้เอกสาร (ส่งข้อมูลใบรับรองผ่าน NSW ใช้กับใบขน e-Customs)",
    "screenText": "B-10 (สถานะส่ง e-Licensing), B-09 ประวัติ",
    "codes": [
      "B-10",
      "B-09"
    ],
    "status": "partial",
    "note": "เห็นผลส่ง e-Licensing / ส่งใหม่ได้ ส่วน e-Customs อยู่นอกระบบ — ยังไม่มีการแสดงว่าใบรับรองถูกอ้างอิงในใบขนแล้วหรือไม่ (ถ้ากรมศุลฯ ส่งผลกลับ — ถาม Q-19)"
  },
  {
    "id": "F-008",
    "kind": "F",
    "section": "4.4.1 ทะเบียนผู้ประกอบการ",
    "tor": "4.4.1 (1)",
    "requirement": "ข้อมูลผู้ประกอบการ ค้นหา (เลขผู้เสียภาษี, สาขา, ชื่อไทย/Eng, สิทธิ์, ประเภทบริการ) เพิ่ม/ลบ",
    "screenText": "B-03",
    "codes": [
      "B-03"
    ],
    "status": "done",
    "note": "มีแท็บประวัติการแก้ไข (ข้อมูลเดิม → ใหม่)"
  },
  {
    "id": "F-009",
    "kind": "F",
    "section": "4.4.1 ทะเบียนผู้ประกอบการ",
    "tor": "4.4.1 (2)",
    "requirement": "พิจารณาอนุมัติ THNSW ค้นหา Profile, NSW Register ID, สิทธิ์",
    "screenText": "B-04",
    "codes": [
      "B-04"
    ],
    "status": "done",
    "note": "อนุมัติพร้อมกำหนดสิทธิ์ / ไม่อนุมัติต้องระบุเหตุผล"
  },
  {
    "id": "F-010",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (1)",
    "requirement": "รายการพิจารณา: Ref No., วันที่ส่ง, Invoice, บริษัท, Brandname, ประเทศ, จำนวนสินค้า, สถานะ, View ฉบับเต็ม",
    "screenText": "B-05",
    "codes": [
      "B-05"
    ],
    "status": "done",
    "note": "เพิ่มคอลัมน์ \"ตรวจสอบอัตโนมัติ\" (เสนอ)"
  },
  {
    "id": "F-011",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (2)",
    "requirement": "Checkbox รายการตรวจสอบ ไม่ครบห้ามอนุมัติ",
    "screenText": "B-06",
    "codes": [
      "B-06"
    ],
    "status": "done",
    "note": "6 ข้อ (checklistItems) ปุ่มอนุมัติ disabled จนครบ 6/6 และ Dialog ยืนยันบล็อกซ้ำ"
  },
  {
    "id": "F-012",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (3)",
    "requirement": "ยกเลิกการอนุมัติภายใน 15 นาที บันทึกเหตุผล ผู้ดำเนินการ วันเวลาลง Log",
    "screenText": "B-06 (B-08), B-11, B-19",
    "codes": [
      "B-06",
      "B-08",
      "B-11",
      "B-19"
    ],
    "status": "done",
    "note": "นับถอยหลัง, เหตุผลบังคับ, ปิดเมื่อพ้นเวลา · v0.3.6: ยกเลิกแล้วคำสั่งชำระใน B-11 เป็น \"ยกเลิกคำสั่งชำระ\" คำขอกลับ \"รอพิจารณา\" และบันทึกใน B-19 (ค่าเดิม → ค่าใหม่ + เหตุผล) · กรณีผู้ประกอบการชำระแล้วภายใน 15 นาที ยังไม่กำหนด → Q-08, Q-21"
  },
  {
    "id": "F-013",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (4)",
    "requirement": "ปฏิเสธเมื่อข้อมูลไม่ตรงที่ลงทะเบียน / ข้อความที่กรมฯ ไม่รับรอง และเจ้าหน้าที่แก้ไข เพิ่มเติมได้",
    "screenText": "B-06",
    "codes": [
      "B-06"
    ],
    "status": "partial",
    "note": "แก้ไขได้เฉพาะ Exporter / Consignee (RequestInfoPanel) แก้รายการสินค้าไม่ได้ · ความหมาย \"แก้ไข เพิ่มเติม\" คลุมเครือ → Q-06, G-12"
  },
  {
    "id": "F-014",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (5)",
    "requirement": "Pop-up ยืนยันก่อน \"อนุมัติ\" / \"ไม่อนุมัติ\" (ยืนยัน/ยกเลิก) + ตรวจอัตโนมัติกรณีลักษณะนาม/วันที่ผลิตถูกต้องโดยไม่ต้องกดยืนยัน",
    "screenText": "B-06, B-07",
    "codes": [
      "B-06",
      "B-07"
    ],
    "status": "partial",
    "note": "Pop-up ครบทั้ง 2 ทาง (ConfirmDecisionDialog ใช้ทั้งอนุมัติและไม่อนุมัติ) · ส่วนตรวจอัตโนมัติยังไม่ทำเครื่องหมาย Checklist ให้ (checklistItems.checked คงที่ 4/6 ทุกคำขอ) → G-04, Q-04"
  },
  {
    "id": "F-015",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (6)",
    "requirement": "เลือกข้อความตอบกลับ หรือเพิ่ม / แก้ไขข้อความตอบกลับ และพิมพ์อิสระ",
    "screenText": "B-06, B-15 (10)",
    "codes": [
      "B-06",
      "B-15"
    ],
    "status": "done",
    "note": "v0.3.6: รายการข้อความกรองตามประเภทการตัดสิน (repliesOf(type)) อนุมัติพร้อมรหัสไม่อนุมัติไม่ได้ · ไม่อนุมัติต้องเลือกข้อความประเภทไม่อนุมัติ · พิมพ์ข้อความเพิ่มเติมได้ · เพิ่ม/แก้ไขรหัสกลางที่ B-15 · การแบ่งหน้าที่เจ้าหน้าที่ / Admin รอ Q-05"
  },
  {
    "id": "F-016",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (7)",
    "requirement": "ปุ่ม Preview ใบรับรอง + ใบแนบ TH/EN ทุกครั้ง ก่อนอนุมัติ / ไม่อนุมัติ",
    "screenText": "B-07",
    "codes": [
      "B-07"
    ],
    "status": "done",
    "note": "v0.3.6: ทั้งปุ่มอนุมัติและไม่อนุมัติเปิด Preview (openPreview('approve' | 'reject')) ก่อนยืนยันเสมอ"
  },
  {
    "id": "F-017",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (8)",
    "requirement": "เมนูติดตามสถานะ: ฟิลด์ครบ (รวมรหัสธนาคาร, เลขที่ใบรับรอง) + View ผู้ยื่น (กรณีตัวแทน / Counter) + ตารางสถานะ/รายละเอียด/วันเวลา + 11 สถานะ",
    "screenText": "B-09",
    "codes": [
      "B-09"
    ],
    "status": "done",
    "note": "ครบทุกฟิลด์และ 11 สถานะ (+ \"ชำระเงินไม่สำเร็จ\" จาก Flow 9) · v0.3.5 สถานะตรงกับ B-05 (store.statusOf) · v0.3.6 ปุ่มดูข้อความ ebXML ของคำขอ · ป้าย pending = \"รอพิจารณา\" ต่างจาก TOR → G-13"
  },
  {
    "id": "F-018",
    "kind": "F",
    "section": "4.4.2 ระบบรับคำขอใบรับรองฯ",
    "tor": "4.4.2 (9)",
    "requirement": "ค้นหา: เลขผู้เสียภาษี, ชื่อไทย/Eng, Ref No., เลขที่ใบรับรอง, วันที่ส่ง, Invoice, จำนวนแสดงผลต่อหน้า",
    "screenText": "B-05, B-09",
    "codes": [
      "B-05",
      "B-09"
    ],
    "status": "done",
    "note": "B-09 รวม Ref / เลขที่ใบรับรอง / Invoice เป็นช่องเดียว"
  },
  {
    "id": "F-019",
    "kind": "F",
    "section": "4.4.3 – 4.4.4 ใบรับรองฯ / การชำระเงิน / ใบเสร็จ",
    "tor": "4.4.3 (1)",
    "requirement": "ข้อมูลใบรับรอง: Ref, วันที่ส่ง, Invoice, บริษัท, เลขที่ใบรับรอง, ประเทศ, จำนวนสินค้า, View PDF",
    "screenText": "B-10",
    "codes": [
      "B-10"
    ],
    "status": "done",
    "note": "เพิ่มสถานะส่ง e-Licensing + ส่งใหม่ (เสนอ)"
  },
  {
    "id": "F-020",
    "kind": "F",
    "section": "4.4.3 – 4.4.4 ใบรับรองฯ / การชำระเงิน / ใบเสร็จ",
    "tor": "4.4.3 (2)",
    "requirement": "ค้นหาใบรับรอง (6 เงื่อนไข + จำนวนต่อหน้า)",
    "screenText": "B-10",
    "codes": [
      "B-10"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-021",
    "kind": "F",
    "section": "4.4.3 – 4.4.4 ใบรับรองฯ / การชำระเงิน / ใบเสร็จ",
    "tor": "4.4.4 (1)",
    "requirement": "ติดตามการชำระ: วันที่ส่ง, เลขที่อ้างอิง, บริษัท, เลขที่ใบคำขอ, Ref.1, Ref.2, รหัสธนาคาร, จำนวนเงิน, สถานะ, View",
    "screenText": "B-11",
    "codes": [
      "B-11"
    ],
    "status": "done",
    "note": "มีกระทบยอด + รายงานประจำวัน (Flow 8) · KPI คำนวณจากรายการ (v0.3.5) · v0.3.6 ตัวกรองวันที่เริ่มต้น \"ทุกวัน\" (→ Q-22) และสถานะใหม่ \"ยกเลิกคำสั่งชำระ\" (ไม่มีใน TOR → Q-21)"
  },
  {
    "id": "F-022",
    "kind": "F",
    "section": "4.4.3 – 4.4.4 ใบรับรองฯ / การชำระเงิน / ใบเสร็จ",
    "tor": "4.4.4 (2)",
    "requirement": "ใบเสร็จ: วันที่ออก, เลขที่อ้างอิง, บริษัท, ใบคำขอ, Ref.1/2, ธนาคาร, เลขที่ใบเสร็จ, ผู้มีอำนาจลงนาม, จำนวนเงิน, View PDF",
    "screenText": "B-12",
    "codes": [
      "B-12"
    ],
    "status": "done",
    "note": "มีสถานะ \"รอลงนาม\" / \"ยกเลิก (ชำระซ้ำ คืนเงิน)\" ซึ่ง TOR/Flow ไม่ได้ระบุ → Q-07"
  },
  {
    "id": "F-023",
    "kind": "F",
    "section": "4.4.3 – 4.4.4 ใบรับรองฯ / การชำระเงิน / ใบเสร็จ",
    "tor": "4.4.4 (3)",
    "requirement": "ค้นหาการชำระ / ใบเสร็จ (9 เงื่อนไข)",
    "screenText": "B-11, B-12",
    "codes": [
      "B-11",
      "B-12"
    ],
    "status": "done",
    "note": "B-11 รวมชื่อบริษัท / เลขผู้เสียภาษีเป็นช่องเดียว"
  },
  {
    "id": "F-024",
    "kind": "F",
    "section": "4.4.5 – 4.4.7",
    "tor": "4.4.5",
    "requirement": "Web Services เชื่อม ebMS Gateway, PKI, Back Office ภายใน",
    "screenText": "B-17, B-18, B-25",
    "codes": [
      "B-17",
      "B-18",
      "B-25"
    ],
    "status": "na",
    "note": "เป็น backend service — Prototype มีหน้าจอติดตามผลให้แล้ว (ดู F-099 – F-102)"
  },
  {
    "id": "F-025",
    "kind": "F",
    "section": "4.4.5 – 4.4.7",
    "tor": "4.4.6",
    "requirement": "รายงานสรุป เพิ่ม/ลบ/แก้ไข ดาวน์โหลด \".exe\", csv (ผู้ประกอบการ, ค่าชำระ, ใบเสร็จ, ใบรับรองตามประเทศ ฯลฯ)",
    "screenText": "B-13",
    "codes": [
      "B-13"
    ],
    "status": "done",
    "note": "5 ประเภทรายงาน + บันทึก/แก้ไข/ลบรายงาน + Excel/CSV · \".exe\" น่าจะพิมพ์ผิด → Q-11"
  },
  {
    "id": "F-026",
    "kind": "F",
    "section": "4.4.5 – 4.4.7",
    "tor": "4.4.7",
    "requirement": "บริหารสิทธิ์ user / admin / super admin",
    "screenText": "B-16, Topbar",
    "codes": [
      "B-16"
    ],
    "status": "done",
    "note": "3 บทบาท + 4 กลุ่มงาน · สลับบทบาทสาธิตได้ 5 แบบ (Super Admin / Admin / ฝ่ายบริการ / ฝ่ายการเงิน / ผู้มีอำนาจลงนาม) · แก้บัญชี / เลือกบทบาท Super Admin ได้เฉพาะ Super Admin (v0.3.6) · ความต่าง Admin กับ Super Admin รอ Q-15"
  },
  {
    "id": "F-027",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (1)",
    "requirement": "หน่วยงาน DDC (รหัส, เลขผู้เสียภาษี, ชื่อ TH/EN, ที่อยู่, CA Alias, Profile, NSW Register ID, วันเวลาบันทึกล่าสุด)",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": "OrgProfileCard"
  },
  {
    "id": "F-028",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (2)",
    "requirement": "บัญชีธนาคาร DDC (ประเภทการชำระ เช่น Cross Bank Bill Payment)",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-029",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (3)",
    "requirement": "ผู้มีอำนาจลงนามใบรับรองฯ",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-030",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (4)",
    "requirement": "ผู้มีอำนาจลงนามใบเสร็จ",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-031",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (5)",
    "requirement": "รหัสพิกัดศุลกากร + รหัสสถิติ",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-032",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (6)",
    "requirement": "พื้นที่โรคระบาด ค้นหาชื่อ/รหัส จังหวัด อำเภอ ตำบล วันที่เกิดโรค, คำนวณวันปลอดโรค +21 วัน, ผู้บันทึก วันเวลา",
    "screenText": "B-14",
    "codes": [
      "B-14"
    ],
    "status": "done",
    "note": "จุดเริ่มนับ 21 วันในข้อความ B-06 ใช้ \"วันที่รายงาน\" แต่ TOR ใช้ \"วันที่เกิดโรคระบาด\" → Q-03"
  },
  {
    "id": "F-033",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (7)",
    "requirement": "รหัสท่าขนถ่าย",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-034",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (8)",
    "requirement": "รหัสหน่วยหีบห่อ",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-035",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (9)",
    "requirement": "รหัสสกุลเงินตรา",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-036",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (10)",
    "requirement": "รหัสข้อความตอบกลับ (Admin เพิ่ม/ลบ)",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": "เพิ่มประเภท อนุมัติ/ไม่อนุมัติ (เสนอ)"
  },
  {
    "id": "F-037",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (11)",
    "requirement": "รหัสตำบล",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": "TOR (11)(12) ระบุฟิลด์สลับกัน → Q-16"
  },
  {
    "id": "F-038",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (12)",
    "requirement": "รหัสอำเภอ",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-039",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (13)",
    "requirement": "รหัสจังหวัด TH/EN",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-040",
    "kind": "F",
    "section": "4.4.8 ข้อมูลหลัก (View / Edit / เพิ่ม / ลบ)",
    "tor": "4.4.8 (14)",
    "requirement": "รหัสประเทศ",
    "screenText": "B-15",
    "codes": [
      "B-15"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-041",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5",
    "requirement": "Front end เพิ่ม ลบ แก้ไขเนื้อหาได้",
    "screenText": "B-21, B-22 (เสนอ)",
    "codes": [
      "B-21",
      "B-22"
    ],
    "status": "done",
    "note": "จัดการข่าว / กฎหมาย / คู่มือ / แบบสอบถาม"
  },
  {
    "id": "F-042",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5.1",
    "requirement": "เมนู ประชาสัมพันธ์, Dashboard, แบบสอบถาม, พื้นที่โรคระบาด, กฎหมาย",
    "screenText": "P-01 – P-06",
    "codes": [
      "P-01",
      "P-02",
      "P-03",
      "P-04",
      "P-05",
      "P-06"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-043",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5.2 • 1",
    "requirement": "ใบรับรองตามประเทศปลายทาง (ชื่อประเทศ + จำนวน เรียงลำดับ)",
    "screenText": "P-02",
    "codes": [
      "P-02"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-044",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5.2 • 2",
    "requirement": "สินค้าส่งออกมากที่สุด",
    "screenText": "P-02",
    "codes": [
      "P-02"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-045",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5.2 • 3",
    "requirement": "จำนวนการยื่นคำขอ",
    "screenText": "P-02",
    "codes": [
      "P-02"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-046",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5.2 • 4",
    "requirement": "จำนวนใบรับรองที่ได้รับ",
    "screenText": "P-02",
    "codes": [
      "P-02"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-047",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5.2 • 5",
    "requirement": "จำนวนผู้ประกอบการ (ลงทะเบียน + ร่วมผูกสัมพันธ์)",
    "screenText": "P-02",
    "codes": [
      "P-02"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-048",
    "kind": "F",
    "section": "4.5 Front end",
    "tor": "4.5.2 • 6",
    "requirement": "พื้นที่โรคระบาดทั้งหมด กราฟเส้น และ/หรือแท่ง รายเดือน รายปี ย้อนหลัง 5 ปี",
    "screenText": "P-02, P-03",
    "codes": [
      "P-02",
      "P-03"
    ],
    "status": "done",
    "note": "ใช้กราฟแท่ง (TOR ใช้ \"และ/หรือ\") — เสนอเพิ่มกราฟเส้นถ้าลูกค้าต้องการ"
  },
  {
    "id": "F-049",
    "kind": "F",
    "section": "4.6 เชื่อมโยง NSW / PKI",
    "tor": "4.6.1 (1)",
    "requirement": "ebMS 2.0 / CPA 2.0 กำหนด/ปรับ CPA ได้ รองรับเวอร์ชันใหม่ Queue/Retry",
    "screenText": "B-23, B-17",
    "codes": [
      "B-23",
      "B-17"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-050",
    "kind": "F",
    "section": "4.6 เชื่อมโยง NSW / PKI",
    "tor": "4.6.1 (2)",
    "requirement": "รับ-ส่ง/จัดเก็บ/ตรวจ XML (คำขอ, คำสั่งชำระ, ผลชำระ, ใบรับรอง, ใบเสร็จ) + Transaction Log (Message ID, เวลา, ต้นทาง–ปลายทาง, สถานะ)",
    "screenText": "B-17, B-09",
    "codes": [
      "B-17",
      "B-09"
    ],
    "status": "done",
    "note": "v0.3.6: ชื่อข้อความตาม Flow 10/11 (mocks/message-types.js: DDCPFREQ, DDCPFREQ_ACCEPT, DDCPINKFORM, DDCRECEIPT, คำสั่งชำระ / ผลชำระ) ทุกข้อความผ่าน NSW · กรองตามคำขอ ?ref= จาก B-09 · ชื่อข้อความรอยืนยัน Q-10 · ข้อความจากการตัดสินในรอบสาธิตยังไม่ปรากฏ → G-22"
  },
  {
    "id": "F-051",
    "kind": "F",
    "section": "4.6 เชื่อมโยง NSW / PKI",
    "tor": "4.6.1 (2) API",
    "requirement": "Web Service / API (REST/SOAP) + API Specification, Data Dictionary, Sample Request/Response",
    "screenText": "B-24 (เสนอ)",
    "codes": [
      "B-24"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-052",
    "kind": "F",
    "section": "4.6 เชื่อมโยง NSW / PKI",
    "tor": "4.6.2",
    "requirement": "PKI: ออก / จัดการใบรับรอง ตรวจสถานะ ลงนาม ตรวจลายมือชื่อ ทุกขั้นตอน",
    "screenText": "B-18, B-06 (ลายมือชื่อผู้ยื่น), B-10/B-12 (ลงนามแล้ว)",
    "codes": [
      "B-18",
      "B-06",
      "B-10",
      "B-12"
    ],
    "status": "partial",
    "note": "มีนำเข้า / ตรวจ OCSP / แสดงผลการลงนาม แต่ไม่มีการ \"ออก\" ใบรับรองให้เจ้าหน้าที่ และไม่มีจุดที่ผู้มีอำนาจลงนามดำเนินการเอง → G-19, Q-13"
  },
  {
    "id": "F-053",
    "kind": "F",
    "section": "4.6 เชื่อมโยง NSW / PKI",
    "tor": "4.6.3",
    "requirement": "Digital Certificate สำหรับ RA/Provider, เจ้าหน้าที่บริการ/การเงิน/IT, ผู้มีอำนาจลงนาม",
    "screenText": "B-18, B-16",
    "codes": [
      "B-18",
      "B-16"
    ],
    "status": "partial",
    "note": "B-18 มีเฉพาะ Signer / Partner / SSL ไม่ผูกใบรับรองรายบุคคลกับผู้ใช้ใน B-16"
  },
  {
    "id": "F-054",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.1 / 7.1.1",
    "requirement": "PKI Management Server (Production 1 + Test 1)",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "na",
    "note": "เป็น server — B-18 สลับ Production / Test ได้"
  },
  {
    "id": "F-055",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.1.2",
    "requirement": "เก็บ Public key Certificate จาก CA / เจ้าของข้อมูล",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": "นำเข้า .cer/.crt/.pem"
  },
  {
    "id": "F-056",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.1.3",
    "requirement": "แจกจ่ายใบรับรองให้ Certificate Agent เมื่อ Partner ร้องขอ",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": "รายการ Agent + เวลา sync"
  },
  {
    "id": "F-057",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.1.4",
    "requirement": "ตรวจสถานะผ่าน OCSP",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-058",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.1.5",
    "requirement": "แจ้งเตือนใกล้หมดอายุ / หมดอายุ / ถูกยกเลิก / ระงับ ผ่าน SMTP และ SOAP 1.2",
    "screenText": "B-18, B-02",
    "codes": [
      "B-18",
      "B-02"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-059",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.1.6",
    "requirement": "กำหนดช่วงแจ้งเตือน วัน / สัปดาห์ / เดือน",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-060",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.2.1",
    "requirement": "Agent ตรวจ / ปรับสถานะจาก Server อัตโนมัติ",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": "แสดงสถานะ online / sync"
  },
  {
    "id": "F-061",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.2.2",
    "requirement": "ความถี่ตรวจของ Agent วินาที / นาที / ชั่วโมง",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-062",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.2.3",
    "requirement": "Agent แจ้งเตือน SMTP / SOAP 1.2",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-063",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.2.4",
    "requirement": "Agent กำหนดช่วงแจ้งเตือน วัน / สัปดาห์ / เดือน",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-064",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.3.1",
    "requirement": "Digital Signature Management Server แจกจ่ายข้อมูลลงนามให้ Agent",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "backend"
  },
  {
    "id": "F-065",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.3.2",
    "requirement": "สร้างและผูก Agent ตามบทบาท Signer / Issuer",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "partial",
    "note": "มี Agent \"Signer / Issuer\" รวมเป็นรายการเดียว ไม่มีหน้าผูกบทบาท"
  },
  {
    "id": "F-066",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.4.1",
    "requirement": "Signature Agent รับส่งด้วย SOAP 1.2 / ebMS 2.0",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "backend"
  },
  {
    "id": "F-067",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.4.2",
    "requirement": "แสดงเอกสารเป็นแบบฟอร์มด้วย XSL 1.1",
    "screenText": "B-07, B-10, B-12",
    "codes": [
      "B-07",
      "B-10",
      "B-12"
    ],
    "status": "na",
    "note": "Prototype วาดด้วย HTML — การใช้ XSL เป็นเรื่อง implementation"
  },
  {
    "id": "F-068",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.4.3",
    "requirement": "ลงและตรวจลายมือชื่อตาม W3C XML Signature",
    "screenText": "B-06 (แท็บ XML), B-17",
    "codes": [
      "B-06",
      "B-17"
    ],
    "status": "na",
    "note": "backend — Prototype แสดงผลตรวจเท่านั้น"
  },
  {
    "id": "F-069",
    "kind": "F",
    "section": "7.1 – 7.4 PKI Management / Agent / Signature Server",
    "tor": "7.4.4",
    "requirement": "เข้ารหัส/ถอดรหัสตาม W3C XML Encryption",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "backend"
  },
  {
    "id": "F-070",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.1",
    "requirement": "เชื่อมโยงด้วย ebMS 2.0 / CPA 2.0 หรือ API ผ่าน NSW",
    "screenText": "B-23, B-24",
    "codes": [
      "B-23",
      "B-24"
    ],
    "status": "na",
    "note": "protocol — มีหน้าตั้งค่าแล้ว"
  },
  {
    "id": "F-071",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.2",
    "requirement": "เชื่อมใบรับรอง / รายงานกับกรมศุลกากรผ่าน NSW",
    "screenText": "B-10, B-23",
    "codes": [
      "B-10",
      "B-23"
    ],
    "status": "na",
    "note": "protocol"
  },
  {
    "id": "F-072",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.3",
    "requirement": "รองรับ XML และ XML Schema",
    "screenText": "B-06 แท็บ XML",
    "codes": [
      "B-06"
    ],
    "status": "na",
    "note": "backend"
  },
  {
    "id": "F-073",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.5",
    "requirement": "ยืนยันตัวบุคคลด้วยลายมือชื่อดิจิทัล",
    "screenText": "B-06 (ลายมือชื่อผู้ยื่นถูกต้อง/ไม่ถูกต้อง), B-07",
    "codes": [
      "B-06",
      "B-07"
    ],
    "status": "done",
    "note": "ตัวอย่างลายมือชื่อไม่ถูกต้อง PF6910260001"
  },
  {
    "id": "F-074",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.10",
    "requirement": "เชื่อมระบบผู้ประกอบการ (ผู้นำเข้า/ส่งออก ตัวแทน Counter)",
    "screenText": "B-23",
    "codes": [
      "B-23"
    ],
    "status": "na",
    "note": "integration — B-23 แสดงคู่ CPA"
  },
  {
    "id": "F-075",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.11",
    "requirement": "เชื่อมระบบ NSP",
    "screenText": "B-23",
    "codes": [
      "B-23"
    ],
    "status": "na",
    "note": "integration"
  },
  {
    "id": "F-076",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.12",
    "requirement": "เชื่อมระบบ Gateway",
    "screenText": "B-23",
    "codes": [
      "B-23"
    ],
    "status": "na",
    "note": "integration"
  },
  {
    "id": "F-077",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.13",
    "requirement": "เชื่อม e-Payment ธนาคาร",
    "screenText": "B-23, B-11",
    "codes": [
      "B-23",
      "B-11"
    ],
    "status": "na",
    "note": "integration"
  },
  {
    "id": "F-078",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.14",
    "requirement": "เชื่อม e-Licensing",
    "screenText": "B-23, B-10",
    "codes": [
      "B-23",
      "B-10"
    ],
    "status": "na",
    "note": "integration"
  },
  {
    "id": "F-079",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.15",
    "requirement": "เชื่อม e-Customs",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "integration (ผ่าน NSW)"
  },
  {
    "id": "F-080",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.16",
    "requirement": "คำขอ / ใบรับรองเป็น XML ตาม XSD ของกรมฯ สอดคล้อง WCO / UN/CCL",
    "screenText": "B-06 แท็บ XML, B-10 ดาวน์โหลด XML",
    "codes": [
      "B-06",
      "B-10"
    ],
    "status": "na",
    "note": "ตัวอย่าง XML ใน sourceXml() ยังไม่อ้างโครง WCO — งาน integration-engineer"
  },
  {
    "id": "F-081",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.17",
    "requirement": "คำขอต้องลงลายมือชื่อดิจิทัลโดยผู้ยื่น",
    "screenText": "B-06, B-05 (แท็บข้อมูลไม่ถูกต้อง)",
    "codes": [
      "B-06",
      "B-05"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-082",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.18",
    "requirement": "ใบรับรองลงลายมือชื่อดิจิทัลโดยผู้มีอำนาจ",
    "screenText": "B-07, B-10",
    "codes": [
      "B-07",
      "B-10"
    ],
    "status": "done",
    "note": "ใบเสร็จมีสถานะ \"รอลงนาม\" — กระบวนการผู้ลงนามคลุมเครือ → Q-13"
  },
  {
    "id": "F-083",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.20",
    "requirement": "รับข้อมูลขอขึ้นทะเบียนจาก NSW",
    "screenText": "B-04, B-17",
    "codes": [
      "B-04",
      "B-17"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-084",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.21",
    "requirement": "หน้าจอขึ้นทะเบียนผู้ใช้บริการให้ผู้ประกอบการ",
    "screenText": "B-03, B-04",
    "codes": [
      "B-03",
      "B-04"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-085",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.23",
    "requirement": "หน้าจอ Admin บริหารผู้ใช้งาน",
    "screenText": "B-16",
    "codes": [
      "B-16"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-086",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.25",
    "requirement": "รายการคำขอที่ยื่นก่อนแสดงลำดับแรก",
    "screenText": "B-05, B-09",
    "codes": [
      "B-05",
      "B-09"
    ],
    "status": "done",
    "note": "ใช้กับคิว \"รอพิจารณา\" (ยุติ Q-01 แล้ว) · แท็บอื่นเรียงตามงาน ผู้ใช้เปลี่ยนการเรียงได้"
  },
  {
    "id": "F-087",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.26",
    "requirement": "สูงสุด 20 รายการต่อหน้า",
    "screenText": "ทุกตาราง",
    "codes": [],
    "status": "done",
    "note": "ค่าเริ่มต้น 20 ตัวเลือก 10 / 20 (ยุติ Q-02 แล้ว, v0.3.5)"
  },
  {
    "id": "F-088",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.27",
    "requirement": "ผู้ใช้ปรับจำนวนต่อหน้า / การเรียงได้",
    "screenText": "B-05",
    "codes": [
      "B-05"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-089",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.28",
    "requirement": "ค้นหาตามเลขผู้เสียภาษี, เลขที่ใบสีชมพู, ชื่อบริษัท, PF-ID",
    "screenText": "B-05",
    "codes": [
      "B-05"
    ],
    "status": "done",
    "note": "นิยาม PF-ID / เลขที่ใบสีชมพู → Q-12"
  },
  {
    "id": "F-090",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.29",
    "requirement": "สถานะบอกขั้นตอนและความถูกต้อง (เช่น รอผู้ประกอบการชำระกับธนาคาร)",
    "screenText": "B-05, B-06, B-09",
    "codes": [
      "B-05",
      "B-06",
      "B-09"
    ],
    "status": "done",
    "note": "Stepper 9 ขั้น + สถานะสิ้นสุด 3 แบบ"
  },
  {
    "id": "F-091",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.30",
    "requirement": "เรียกดูรายละเอียดคำขอและเอกสารประกอบ",
    "screenText": "B-06 แท็บเอกสารประกอบ",
    "codes": [
      "B-06"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-092",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.31",
    "requirement": "ตรวจความถูกต้อง / ครบถ้วนอัตโนมัติ",
    "screenText": "B-05 (คอลัมน์ตรวจอัตโนมัติ), B-06",
    "codes": [
      "B-05",
      "B-06"
    ],
    "status": "partial",
    "note": "แสดงเฉพาะผลพื้นที่โรคระบาด ไม่มีผลรายกฎ (ผู้ประกอบการลงทะเบียน, พิกัดอยู่ใน Master, วันที่ผลิต, ข้อความเกินขอบเขต) → G-04"
  },
  {
    "id": "F-093",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.32",
    "requirement": "คำขอไม่สมบูรณ์ ปฏิเสธ ตอบกลับผ่านระบบ และส่งอีเมลอัตโนมัติ",
    "screenText": "B-05 แท็บข้อมูลไม่ถูกต้อง, B-06",
    "codes": [
      "B-05",
      "B-06"
    ],
    "status": "partial",
    "note": "แจ้งผ่าน NSW (DDCPFREQ_ACCEPT ใน B-17) แสดงแล้ว — ไม่มีร่องรอยการส่งอีเมล → G-06 (frontend กำลังทำ ยังไม่นับ)"
  },
  {
    "id": "F-094",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.33",
    "requirement": "เก็บคำขอที่ถูกปฏิเสธไว้อ้างอิง",
    "screenText": "B-05 แท็บข้อมูลไม่ถูกต้อง / ไม่อนุมัติ",
    "codes": [
      "B-05"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-095",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.34",
    "requirement": "อนุมัติแล้วสร้างและส่งคำสั่งชำระที่ลงนาม DDC ไปธนาคาร",
    "screenText": "B-06, B-11, B-17",
    "codes": [
      "B-06",
      "B-11",
      "B-17"
    ],
    "status": "partial",
    "note": "v0.3.6: อนุมัติแล้วสถานะ \"รอการชำระเงิน\" ทันที คำสั่งชำระเกิดใน B-11 และประวัติคำขอ (Ref.1 / Ref.2) → Q-21 · แต่ข้อความคำสั่งชำระ (3.1) และ DDCPFREQ_ACCEPT (3, 4) ของคำขอที่อนุมัติในรอบสาธิตไม่ปรากฏใน B-17 → G-22"
  },
  {
    "id": "F-096",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.35",
    "requirement": "ธนาคารส่งผลตรวจ (ลงนามธนาคาร) กลับ",
    "screenText": "B-11 รายละเอียด, B-17",
    "codes": [
      "B-11",
      "B-17"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-097",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.36 กรณีไม่สำเร็จ",
    "requirement": "ปฏิเสธการออกใบรับรอง แจ้งผ่าน NSW + อีเมลอัตโนมัติ",
    "screenText": "B-05 แท็บรอชำระ (ปักบนสุด), B-11, B-17",
    "codes": [
      "B-05",
      "B-11",
      "B-17"
    ],
    "status": "partial",
    "note": "แจ้งผ่าน NSW มีใน B-17 · ไม่มีอีเมล → G-06 · ข้อความ B-11 failedNote ยังเขียน \"ให้ชำระใหม่\" ขัดกับสถานะสิ้นสุด → G-07 · (ความไม่สอดคล้อง PF6910250188 ปิดแล้วใน v0.3.5)"
  },
  {
    "id": "F-098",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.36 กรณีสำเร็จ",
    "requirement": "ออกเลขที่ใบรับรอง บันทึก DB ส่ง e-Licensing แจ้งผล ส่งใบรับรอง + ใบเสร็จผ่าน NSW/Gateway/NSP",
    "screenText": "B-09, B-10, B-12",
    "codes": [
      "B-09",
      "B-10",
      "B-12"
    ],
    "status": "done",
    "note": "รวมกรณีส่ง e-Licensing ไม่สำเร็จ + ส่งใหม่ (PF6910250185)"
  },
  {
    "id": "F-099",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.37 (ก)",
    "requirement": "Web Services DDC ↔ ebMS Gateway / PKI (คำขอ คำสั่งชำระ ใบรับรอง ใบเสร็จ)",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "backend"
  },
  {
    "id": "F-100",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.37 (ข)",
    "requirement": "หน้าจอตรวจการทำงานและความถูกต้องของข้อมูล",
    "screenText": "B-17, B-18, B-02 สถานะระบบ",
    "codes": [
      "B-17",
      "B-18",
      "B-02"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-101",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.38 (ก)",
    "requirement": "Web Services DDC ↔ Back Office เดิม (ใบรับรอง ใบเสร็จ)",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "backend"
  },
  {
    "id": "F-102",
    "kind": "F",
    "section": "7.8 โปรแกรมประยุกต์ DDC e-Pinkforms",
    "tor": "7.8.38 (ข)",
    "requirement": "หน้าจอตรวจการทำงาน / ความถูกต้องข้อมูล Back Office",
    "screenText": "B-25 (เสนอ)",
    "codes": [
      "B-25"
    ],
    "status": "done",
    "note": "ตรวจข้อมูล + ส่งซ้ำ"
  },
  {
    "id": "F-103",
    "kind": "F",
    "section": "8 การรับส่งข้อมูล (ส่วน Functional)",
    "tor": "8.3",
    "requirement": "รับส่งข้อมูลใบรับรองกับ BackOffice Application และบันทึกผล",
    "screenText": "B-25",
    "codes": [
      "B-25"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "F-104",
    "kind": "F",
    "section": "8 การรับส่งข้อมูล (ส่วน Functional)",
    "tor": "8.4",
    "requirement": "XML Schema validation",
    "screenText": "B-05/B-06 (เหตุผลข้อมูลไม่ถูกต้อง), B-17",
    "codes": [
      "B-05",
      "B-06",
      "B-17"
    ],
    "status": "done",
    "note": "ตัวอย่าง PF6910250166 \"ไม่พบ &lt;HSCode&gt;\""
  },
  {
    "id": "F-105",
    "kind": "F",
    "section": "8 การรับส่งข้อมูล (ส่วน Functional)",
    "tor": "8.5",
    "requirement": "XML digital signature",
    "screenText": "B-06, B-17 (คอลัมน์ Signature)",
    "codes": [
      "B-06",
      "B-17"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "NF-01",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.1",
    "requirement": "Web Service ออนไลน์ Responsive, W3C + SEO",
    "screenText": "ทุกหน้า, P-01M",
    "codes": [
      "P-01"
    ],
    "status": "partial",
    "note": "Responsive ครบ · ยังไม่มี meta description / Open Graph / sitemap และ Portal เป็น SPA → G-14"
  },
  {
    "id": "NF-02",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.2",
    "requirement": "ภาษา (PHP 7+ / .NET Core / Bootstrap 5 / Vue.js)",
    "screenText": "package.json",
    "codes": [],
    "status": "done",
    "note": "Vue 3 + Vuetify 3 (ไม่ใช้ Bootstrap จึงไม่ติดเงื่อนไข)"
  },
  {
    "id": "NF-03",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.3",
    "requirement": "RDBMS",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "ฐานข้อมูล — ADR ของ solution-architect"
  },
  {
    "id": "NF-04",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.4",
    "requirement": "ติดตั้งและเชื่อมเครือข่ายกรมฯ",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-05",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.5",
    "requirement": "ซอฟต์แวร์ลิขสิทธิ์ เวอร์ชันล่าสุด",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "จัดซื้อ"
  },
  {
    "id": "NF-06",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.6",
    "requirement": "ใช้งานง่าย GUI Web-based Responsive",
    "screenText": "ทุกหน้า, /design-system",
    "codes": [],
    "status": "done",
    "note": ""
  },
  {
    "id": "NF-07",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.7",
    "requirement": "รองรับหลายเบราว์เซอร์ Windows / macOS",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "ต้องทดสอบโดย qa-engineer"
  },
  {
    "id": "NF-08",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.8",
    "requirement": "นำเสนอ UI ให้กองฯ ยืนยันก่อนพัฒนา",
    "screenText": "Prototype ทั้งชุด, /prototype",
    "codes": [],
    "status": "done",
    "note": "Prototype คือเครื่องมือของข้อนี้"
  },
  {
    "id": "NF-09",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.9",
    "requirement": "ซอฟต์แวร์เพิ่มเติมเป็นกรรมสิทธิ์กรมฯ",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "สัญญา"
  },
  {
    "id": "NF-10",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.11",
    "requirement": "2FA Username/Password + วิธีอื่น",
    "screenText": "B-01, B-01.2, B-01.3, B-01.4, B-01.5",
    "codes": [
      "B-01",
      "B-01.2",
      "B-01.3",
      "B-01.4",
      "B-01.5"
    ],
    "status": "done",
    "note": "v0.3.6: รหัสผ่านผิดแจ้งจำนวนครั้งที่เหลือ ผิดครบ 5 ครั้งระงับบัญชี (ตอบเหมือนกันทุกบัญชีเพื่อไม่ให้เดาชื่อผู้ใช้ได้) · ระบบขัดข้อง + ลองใหม่ · ลืมรหัสผ่าน B-01.5 (ลิงก์ 30 นาที, ห้ามซ้ำ 3 ครั้งล่าสุด) · B-01.3 ตั้งรหัสผ่านก่อน PIN + ลิงก์หมดอายุ / ใช้แล้ว / ไม่ถูกต้อง · ขั้น PIN ครบตั้งแต่ฉบับแรก · ค่านโยบายเป็นสมมติฐาน → Q-20 · การปลดล็อกโดย Admin อยู่ใน G-11"
  },
  {
    "id": "NF-11",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.1.15",
    "requirement": "Transaction Log (ผู้แก้ไข เครื่อง วันเวลา ข้อมูลเดิม ≥ 90 วัน / 2 ปี, ต้นทาง–ปลายทาง ระยะเวลา ขนาด ประเภทบริการ)",
    "screenText": "B-19",
    "codes": [
      "B-19"
    ],
    "status": "partial",
    "note": "มีผู้ใช้ / IP / เครื่อง / ก่อน–หลัง, ข้อความเก็บ ≥ 90 วัน ขยายได้ 2 ปี · v0.3.6 บันทึกการอนุมัติ / ไม่อนุมัติ / ยกเลิก / แก้ไขคำขอจริง (stores/audit.js) · ยังไม่มีต้นทาง–ปลายทาง ระยะเวลา ขนาดข้อมูล ประเภทบริการ → G-15"
  },
  {
    "id": "NF-12",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.3.1",
    "requirement": "PKI Production 1 + Test 1",
    "screenText": "B-18",
    "codes": [
      "B-18"
    ],
    "status": "done",
    "note": "สลับสภาพแวดล้อมได้"
  },
  {
    "id": "NF-13",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.3.2",
    "requirement": "SSL Certificate ebMS GW + PKI Server 2 ชุด",
    "screenText": "B-18 (ประเภท SSL)",
    "codes": [
      "B-18"
    ],
    "status": "na",
    "note": "infra — B-18 แสดงสถานะ SSL ได้แล้ว"
  },
  {
    "id": "NF-14",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "4.6.1 (API security)",
    "requirement": "API Key / OAuth 2.0, HTTPS, Log การเรียก API (Endpoint, ผู้เรียก, เวลา, สถานะ, Error Code)",
    "screenText": "B-24",
    "codes": [
      "B-24"
    ],
    "status": "done",
    "note": ""
  },
  {
    "id": "NF-15",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.1",
    "requirement": "PDPA",
    "screenText": "P-07",
    "codes": [
      "P-07"
    ],
    "status": "partial",
    "note": "มีนโยบายความเป็นส่วนตัว · ไม่มีการบันทึกความยินยอม การ mask ข้อมูลส่วนบุคคลในหลังบ้าน หรือช่องทางใช้สิทธิเจ้าของข้อมูล → G-17"
  },
  {
    "id": "NF-16",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.2.1",
    "requirement": "ITIL",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "กระบวนการ"
  },
  {
    "id": "NF-17",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.2.2",
    "requirement": "ปิดช่องโหว่ OWASP Top 10 (API + Web)",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "security-reviewer"
  },
  {
    "id": "NF-18",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.2.3",
    "requirement": "NIST",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-19",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.2.4",
    "requirement": "CIS",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-20",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.2.5",
    "requirement": "API Security standard",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-21",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.2.6",
    "requirement": "Container security",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-22",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.3",
    "requirement": "Pentest + VA ก่อนขึ้น Major Version",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-23",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.4",
    "requirement": "Grey-Box Pentest ภายใน/ภายนอก (OSSTM, NIST SP800-115, OWASP)",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-24",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.5",
    "requirement": "รายงาน VA 6.5.1 – 6.5.5",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-25",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.6",
    "requirement": "System Architecture",
    "screenText": "คำอธิบายสถาปัตยกรรมระบบ_DDC_ePinkforms.docx (นอก repo), Flow 1, md/system-overview.md",
    "codes": [],
    "status": "na",
    "note": "เอกสาร — docs/architecture/ ยังไม่มี (solution-architect)"
  },
  {
    "id": "NF-26",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 Backup",
    "requirement": "CTAM: Backup",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "devops — ดู G-18 (เสนอหน้าสถานะ)"
  },
  {
    "id": "NF-27",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 Antivirus",
    "requirement": "CTAM: Antivirus",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-28",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 Access Control",
    "requirement": "CTAM: Public / Private",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-29",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 PAM",
    "requirement": "CTAM: Privileged Access Management",
    "screenText": "B-16 (Super Admin)",
    "codes": [
      "B-16"
    ],
    "status": "na",
    "note": "ต้องใช้เครื่องมือ PAM — หน้าจอแค่กำหนดบทบาท"
  },
  {
    "id": "NF-30",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 BCP/DRP",
    "requirement": "CTAM: BCP / DRP",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-31",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 OS Patching",
    "requirement": "CTAM: OS Patching",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": ""
  },
  {
    "id": "NF-32",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 MFA",
    "requirement": "CTAM: 2FA",
    "screenText": "B-01.x",
    "codes": [
      "B-01"
    ],
    "status": "done",
    "note": "ดู NF-10"
  },
  {
    "id": "NF-33",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.7 Log Mgmt",
    "requirement": "CTAM: Log Management",
    "screenText": "B-19, B-17, B-24",
    "codes": [
      "B-19",
      "B-17",
      "B-24"
    ],
    "status": "partial",
    "note": "ดู NF-11"
  },
  {
    "id": "NF-34",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "6.8",
    "requirement": "Maintenance 2 ปี",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "สัญญา"
  },
  {
    "id": "NF-35",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.1.7",
    "requirement": "PKI Server Redundancy / Load Balance",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-36",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.3.3",
    "requirement": "Signature Server Load Balance",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-37",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.5",
    "requirement": "Windows Server 2022 16 core + SA 3 ปี",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "จัดซื้อ"
  },
  {
    "id": "NF-38",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.6",
    "requirement": "DBMS ลิขสิทธิ์ (Backup Compression, SSAS/SSRS, Active–Standby, 10 CALs)",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "จัดซื้อ / infra"
  },
  {
    "id": "NF-39",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.7",
    "requirement": "SSL ≥ 128 bits, https",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-40",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.8.4",
    "requirement": "ใช้ PKI รักษาความปลอดภัยระบบ",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "backend"
  },
  {
    "id": "NF-41",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.8.6",
    "requirement": "Hash สำหรับ Digital Signature SHA-1 หรือ MD5",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "backend — อัลกอริทึมล้าสมัย → Q-14"
  },
  {
    "id": "NF-42",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.8.7",
    "requirement": "SSL สำหรับส่วนเชื่อมโยง",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-43",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.8.8",
    "requirement": "OOP, UML, Three Tier, SDLC",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "แนวทางพัฒนา"
  },
  {
    "id": "NF-44",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "7.8.9",
    "requirement": "ออกแบบรองรับ ebXML / API + Digital Signature",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "งานออกแบบ backend"
  },
  {
    "id": "NF-45",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "8.1",
    "requirement": "Data Backup and Restore",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "devops — ดู G-18"
  },
  {
    "id": "NF-46",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "8.2",
    "requirement": "System Backup and Restore",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "devops"
  },
  {
    "id": "NF-47",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "8.6",
    "requirement": "ควบคุมรวมศูนย์ configuring / administering / monitoring",
    "screenText": "B-02, B-17, B-23, B-24",
    "codes": [
      "B-02",
      "B-17",
      "B-23",
      "B-24"
    ],
    "status": "partial",
    "note": "ไม่มีหน้าตั้งค่าพารามิเตอร์ระบบ (ค่าบริการ, 15 นาที, 21 วัน, นโยบาย PIN / รหัสผ่าน, ล็อก 5 ครั้ง, อายุลิงก์, จำนวนต่อหน้า) → G-16"
  },
  {
    "id": "NF-48",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "8.7",
    "requirement": "ถ่ายทอดความรู้ Backup เมื่อสิ้นสุดสัญญา",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "สัญญา"
  },
  {
    "id": "NF-49",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.1",
    "requirement": "VM Application-Production 16 core / 32 GB / 200 GB",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-50",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.2",
    "requirement": "VM Gateway-ebMS-Production",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-51",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.3",
    "requirement": "VM Application-Test",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-52",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.4",
    "requirement": "VM Gateway-ebMS-Test",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-53",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.5",
    "requirement": "VM Database 1",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-54",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.6",
    "requirement": "VM Database 2",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-55",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.7",
    "requirement": "Cloud SLA ≥ 99.90%",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-56",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.8.1 – 9.8.6",
    "requirement": "มาตรฐาน Cloud (Tier III, ISO 27001/27701/20000-1/22301, CSA STAR)",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  },
  {
    "id": "NF-57",
    "kind": "NF",
    "section": "Non-functional",
    "tor": "9.8.7 – 9.8.16",
    "requirement": "บริการ Cloud (Internet, AV, Firewall, WAF, Public IP ≥ 6, GIN/G-Link, Call Center 24 ชม., Bandwidth, GDCC 1 ปี / ย้าย Cloud)",
    "screenText": "",
    "codes": [],
    "status": "na",
    "note": "infra"
  }
];
