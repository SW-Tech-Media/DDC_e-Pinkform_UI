// ข้อมูลจำลองหน้า B-22 · จัดการแบบสอบถามและผล (เสนอเพิ่ม — ยังไม่มีใน Figma)
// ด้านการประเมินสอดคล้องกับแบบฟอร์ม P-06 · แบบสอบถามความพึงพอใจ

export const surveyToday = "2026-10-26";

// ด้านการประเมิน (key ใช้ร่วมกันระหว่างคำถามและคำตอบ)
export const surveyAspects = {
  convenience: { label: "ความสะดวกในการใช้งาน", short: "สะดวก" },
  speed: { label: "ความรวดเร็วในการให้บริการ", short: "รวดเร็ว" },
  accuracy: { label: "ความถูกต้องของข้อมูล", short: "ถูกต้อง" },
  information: { label: "ความครบถ้วนของข้อมูลข่าวสาร", short: "ข่าวสาร" },
  security: { label: "ความปลอดภัยของระบบ", short: "ปลอดภัย" },
  staff: { label: "การให้บริการของเจ้าหน้าที่", short: "เจ้าหน้าที่" },
  overall: { label: "ความพึงพอใจโดยรวม", short: "โดยรวม" },
};

export const questionTypes = {
  rating: { label: "คะแนน 1–5", tone: "info" },
  text: { label: "ข้อความ", tone: "accent" },
};

export const surveyQuestions = [
  { id: 1, aspect: "convenience", type: "rating", text: "ระบบใช้งานง่าย ขั้นตอนการยื่นคำขอไม่ซับซ้อน", required: true, active: true },
  { id: 2, aspect: "speed", type: "rating", text: "ระยะเวลาตั้งแต่ยื่นคำขอจนได้รับใบรับรองฯ เหมาะสม", required: true, active: true },
  { id: 3, aspect: "accuracy", type: "rating", text: "ข้อมูลบนใบรับรองฯ และใบเสร็จรับเงินถูกต้องครบถ้วน", required: true, active: true },
  { id: 4, aspect: "information", type: "rating", text: "ข่าวสาร กฎหมาย และคู่มือบนเว็บไซต์ครบถ้วน เข้าใจง่าย", required: true, active: true },
  { id: 5, aspect: "security", type: "rating", text: "มั่นใจในความปลอดภัยของข้อมูลและการลงลายมือชื่อดิจิทัล", required: true, active: true },
  { id: 6, aspect: "staff", type: "rating", text: "เจ้าหน้าที่ให้คำแนะนำและตอบข้อซักถามได้ชัดเจน", required: false, active: false },
  { id: 7, aspect: "overall", type: "rating", text: "ความพึงพอใจโดยรวมต่อระบบ DDC e-Pinkforms", required: true, active: true },
  { id: 8, aspect: "overall", type: "text", text: "ข้อเสนอแนะเพื่อการปรับปรุงระบบ", required: false, active: true },
];

// ช่วงเวลาที่ดูผล
export const surveyPeriods = [
  { value: "month", label: "เดือนนี้" },
  { value: "quarter", label: "ไตรมาสนี้" },
  { value: "year", label: "ปีงบประมาณ 2569" },
];

// สรุปผลตามช่วงเวลา — avg ต่อด้าน, satisfied = สัดส่วนผู้ให้คะแนนโดยรวม ≥ 4
export const surveySummary = {
  month: {
    respondents: 128,
    satisfied: 0.891,
    avg: { convenience: 4.42, speed: 4.18, accuracy: 4.61, information: 4.05, security: 4.53, staff: 4.3, overall: 4.37 },
  },
  quarter: {
    respondents: 412,
    satisfied: 0.874,
    avg: { convenience: 4.35, speed: 4.09, accuracy: 4.58, information: 3.96, security: 4.49, staff: 4.27, overall: 4.31 },
  },
  year: {
    respondents: 1586,
    satisfied: 0.852,
    avg: { convenience: 4.21, speed: 3.94, accuracy: 4.5, information: 3.88, security: 4.41, staff: 4.22, overall: 4.2 },
  },
};

export const respondentTypes = ["ผู้ประกอบการ", "ตัวแทนออกของ", "บุคคลทั่วไป"];

const r = (id, at, type, s, comment = "") => ({
  id,
  submittedAt: at,
  respondentType: type,
  scores: { convenience: s[0], speed: s[1], accuracy: s[2], information: s[3], security: s[4], overall: s[5] },
  comment,
});

// คำตอบล่าสุด
export const surveyResponses = [
  r(1, "2026-10-26T10:42:00", "ผู้ประกอบการ", [5, 4, 5, 4, 5, 5], "ยื่นผ่าน NSW สะดวกมาก ได้ใบรับรองภายในวันเดียว"),
  r(2, "2026-10-26T09:18:00", "ตัวแทนออกของ", [4, 3, 5, 4, 4, 4], "อยากให้แจ้งเตือนสถานะผ่าน SMS เพิ่มเติม"),
  r(3, "2026-10-25T16:55:00", "ผู้ประกอบการ", [5, 5, 5, 5, 5, 5]),
  r(4, "2026-10-25T14:03:00", "บุคคลทั่วไป", [4, 4, 4, 3, 4, 4], "คู่มือบางส่วนยังเป็นเวอร์ชันเก่า"),
  r(5, "2026-10-25T11:27:00", "ผู้ประกอบการ", [3, 2, 4, 3, 4, 3], "ช่วงเช้าระบบชำระเงินตอบช้า ต้องรอผลจากธนาคารนาน"),
  r(6, "2026-10-24T15:40:00", "ตัวแทนออกของ", [5, 4, 5, 4, 5, 4]),
  r(7, "2026-10-24T10:12:00", "ผู้ประกอบการ", [4, 4, 5, 4, 5, 4], "หน้าติดตามสถานะใช้งานง่าย"),
  r(8, "2026-10-23T13:36:00", "ผู้ประกอบการ", [5, 5, 4, 4, 5, 5]),
  r(9, "2026-10-23T09:05:00", "บุคคลทั่วไป", [4, 5, 5, 5, 4, 5], "ข้อมูลพื้นที่โรคระบาดอัปเดตรวดเร็ว"),
  r(10, "2026-10-22T17:21:00", "ตัวแทนออกของ", [4, 3, 4, 4, 4, 4]),
  r(11, "2026-10-22T11:48:00", "ผู้ประกอบการ", [5, 4, 5, 3, 5, 4], "อยากให้มีคู่มือแบบวิดีโอ"),
  r(12, "2026-10-21T14:30:00", "ผู้ประกอบการ", [4, 4, 5, 4, 4, 4]),
];
