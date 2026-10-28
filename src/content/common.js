// ข้อความที่ใช้ร่วมกันทั้งระบบ

export const common = {
  org: "กรมควบคุมโรค กระทรวงสาธารณสุข",
  division: "กองโรคติดต่อทั่วไป",
  actions: {
    search: "ค้นหา",
    reset: "ล้าง",
    view: "ดู",
    edit: "แก้ไข",
    delete: "ลบ",
    save: "บันทึก",
    cancel: "ยกเลิก",
    close: "ปิด",
    back: "กลับ",
    exportExcel: "ส่งออก Excel",
    download: "ดาวน์โหลด",
    viewAll: "ดูทั้งหมด",
    all: "ทั้งหมด",
  },
  pagination: {
    range: (from, to, total) => `แสดง ${from} – ${to} จาก ${total.toLocaleString("th-TH")} รายการ`,
    show: "แสดง",
    perPage: "รายการ/หน้า",
  },
  version: "เวอร์ชัน 1.0 (Prototype)",
};
