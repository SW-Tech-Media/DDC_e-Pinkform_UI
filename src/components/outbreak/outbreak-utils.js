// ฟังก์ชันวันที่สำหรับหน้า D14 (ค่า ISO "YYYY-MM-DD")
const DAY = 86400000;
const toDate = (iso) => new Date(`${iso}T00:00:00`);
const pad = (n) => String(n).padStart(2, "0");

export const addDays = (iso, n) => {
  const d = toDate(iso);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const daysBetween = (from, to) => Math.round((toDate(to) - toDate(from)) / DAY);
