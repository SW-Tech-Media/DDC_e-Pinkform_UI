// ข้อความของหน้าแรก Prototype — แก้ข้อความ / เพิ่มการ์ดได้ที่นี่โดยไม่ต้องแก้ template

export const home = {
  eyebrow: "Prototype · National Single Window",
  title: "ระบบบริการใบรับรองแหล่งผลิตแหล่งกำเนิดอาหารปลอดโรค",
  subtitle: "ตัวอย่างหน้าจอและคู่มือการออกแบบของระบบ DDC e-Pinkforms สำหรับนำเสนอและพัฒนาต่อ",
  chooseLabel: "เลือกสิ่งที่ต้องการเปิด",
  entries: [
    {
      key: "prototype",
      icon: "fas fa-display",
      tone: "teal",
      title: "เข้า Prototype ระบบ",
      description: "ทดลองใช้หน้าจอเว็บไซต์ประชาสัมพันธ์ และระบบหลังบ้านสำหรับเจ้าหน้าที่กรมควบคุมโรค ตามดีไซน์ใน Figma",
      cta: "เข้าสู่ Prototype",
      to: { name: "prototype" },
    },
    {
      key: "design-system",
      icon: "fas fa-swatchbook",
      tone: "pink",
      title: "คู่มือ Design System",
      description: "สี ตัวอักษร ระยะห่าง และ Component ที่ใช้ร่วมกันทั้งระบบ สำหรับทีมออกแบบและทีมพัฒนา",
      cta: "เปิดคู่มือ",
      to: { name: "design-system" },
    },
  ],
};

// หน้าที่ยังไม่ได้จัดทำ แสดงเป็น EmptyState
export const placeholders = {
  "design-system": {
    icon: "fas fa-swatchbook",
    tone: "pink",
    title: "คู่มือ Design System",
    description: "กำลังจัดทำคู่มือ Design Token และ Component ของระบบ",
  },
  backLabel: "กลับหน้าแรก",
};

// หน้ารวมหน้าจอ Prototype (/prototype)
export const prototypeText = {
  home: "หน้าแรก",
  title: "Prototype ระบบ",
  description: "หน้าจอทั้งหมดตาม Flow ใน Figma · กดเพื่อเปิดหน้าจอ หรือเริ่มจากหน้าแรกเว็บไซต์แล้วคลิกตาม Flow ได้เลย",
  startTitle: "เริ่มตาม Flow",
  startText: "Portal → เข้าสู่ระบบเจ้าหน้าที่ → PIN → หน้าหลัก → คำขอใบรับรองฯ → พิจารณา → Preview & ยืนยัน → ติดตามสถานะ",
  start: "เริ่มที่หน้าแรกเว็บไซต์",
  noDesign: "ยังไม่มีใน Figma",
};

// หน้าที่ยังไม่มีดีไซน์ใน Figma
export const pendingText = {
  icon: "fas fa-pen-ruler",
  tone: "neutral",
  title: (name) => name,
  description: "หน้านี้ยังไม่มีดีไซน์ใน Figma จะจัดทำหลังจากได้ดีไซน์",
  back: "กลับหน้ารวมหน้าจอ",
};
