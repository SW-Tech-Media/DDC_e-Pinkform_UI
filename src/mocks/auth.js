// ข้อมูลจำลองการยืนยันตัวตนขั้นที่ 1 (B-01, B-01.3, B-01.5 — Flow 4, 4.1 · TOR 4.1.11, 6.7 MFA)
// ใช้เฉพาะ src/api/auth.js โหมด mock — หน้าจอไม่ import ไฟล์นี้ตรง ๆ
// ค่าการล็อกและนโยบายเป็นสมมติฐานรอ Q-20 (Flow กำหนด "ผิดเกิน 5 ครั้ง ระงับบัญชีชั่วคราว" TOR ไม่ระบุ)
import { reactive } from "vue";

// สถานะการล็อกบัญชีฝั่ง server จำลอง (อยู่ในหน่วยความจำ รีเฟรชหน้า = เริ่มใหม่) — ใช้ร่วมกันระหว่าง
// src/api/auth.js (B-01 นับรหัสผิด / ระงับ) และ src/api/users.js + stores/users.js (B-16 แสดงสถานะ "ระงับ" / ปลดล็อก)
// failures: username → จำนวนครั้งที่ผิดติดต่อกัน · lockedAt: username → เวลาที่ถูกระงับ
// ชั่วคราวจนกว่าจะมี API: ระบบจริง GET /users คืนสถานะบัญชี (locked) จาก backend เอง
// chaiwat.p = ตัวอย่างบัญชีที่ถูกระงับอยู่แล้ว (กรอกผิดครบ 5 ครั้งเมื่อเช้า)
export const authAccounts = reactive({
  failures: { "chaiwat.p": 5 },
  lockedAt: { "chaiwat.p": "2026-10-26T09:58:12+07:00" },
});

export const authMock = {
  // รหัสผ่านที่ถูกต้องของทุกบัญชีจำลอง — รหัสผ่านอื่นทั้งหมด = ไม่ถูกต้อง
  password: "prototype1",
  // กรอกรหัสผ่านผิดครบจำนวนนี้ = ระงับบัญชีชั่วคราว ต้องให้ผู้ดูแลระบบปลดล็อกที่ B-16
  maxAttempts: 5,
  // ชื่อผู้ใช้ที่จำลองว่าเรียก API ไม่สำเร็จ (เครือข่าย / server ขัดข้อง) เพื่อดูสถานะ error + ลองใหม่
  offlineUsername: "offline.demo",

  // บัญชีที่ลิงก์ยืนยันอีเมล (Flow 4.1 ขั้น 2 — ใช้ครั้งเดียว อายุ 24 ชั่วโมง) อ้างถึง ตาม Figma D06
  verifyAccount: { username: "somrudee.j", email: "s*****@ddc.mail.go.th", linkHours: 24 },
  // token ในลิงก์ (?link=) ที่ให้ผลต่างจากปกติ — ค่าอื่น / ไม่ระบุ = ลิงก์ถูกต้อง
  linkTokens: { expired: "expired", used: "used", invalid: "invalid", error: "error" },
  // รหัสผ่านตัวอย่างที่ผ่านนโยบาย — เติมให้เมื่อเปิดขั้นตั้ง PIN ตรง ๆ (?step=pin) เพื่อให้ตรง Figma D06 และกดบันทึกได้
  sampleNewPassword: "Pinkform#2569",

  // ลืมรหัสผ่าน (B-01.5) — ลิงก์ตั้งรหัสผ่านใหม่อายุ 30 นาที เท่ากับลิงก์ตั้ง PIN ใหม่ (Flow 4.1 ขั้น 9)
  resetLinkMinutes: 30,
  // รหัสผ่าน 3 ครั้งล่าสุด (จำลอง รวมรหัสปัจจุบัน) — backend เทียบ Hash แล้วตอบ PASSWORD_REUSED
  recentPasswords: ["prototype1", "Pinkform@2568", "Ddc#Secure01"],
};
