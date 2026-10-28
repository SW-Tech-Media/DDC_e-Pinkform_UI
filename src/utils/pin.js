// ตรวจเงื่อนไข PIN 6 หลัก (D05, D06)
export const PIN_LENGTH = 6;

const digitsOnly = (v) => /^\d*$/.test(v);

// เลขเรียงขึ้นหรือลงทั้งชุด เช่น 123456 / 654321
export const isSequential = (pin) => {
  if (pin.length < 2) return false;
  const diffs = [...pin].slice(1).map((d, i) => Number(d) - Number(pin[i]));
  return diffs.every((d) => d === 1) || diffs.every((d) => d === -1);
};

// เลขซ้ำทั้งชุด เช่น 111111
export const isRepeated = (pin) => pin.length > 1 && [...pin].every((d) => d === pin[0]);

// ผลตรวจแต่ละข้อ: 'pass' | 'fail' | 'pending'
export const checkPin = (pin, confirm) => {
  const full = pin.length === PIN_LENGTH && digitsOnly(pin);
  return {
    length: full ? "pass" : "pending",
    sequence: !full ? "pending" : isSequential(pin) ? "fail" : "pass",
    repeat: !full ? "pending" : isRepeated(pin) ? "fail" : "pass",
    match: confirm.length < PIN_LENGTH ? "pending" : confirm === pin ? "pass" : "fail",
  };
};

// แป้นตัวเลข 0 – 9 สุ่มตำแหน่ง (Fisher–Yates)
export const shuffledDigits = () => {
  const d = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
};

// เก็บเฉพาะตัวเลข ไม่เกิน 6 หลัก
export const sanitizePin = (v) => String(v ?? "").replace(/\D/g, "").slice(0, PIN_LENGTH);
