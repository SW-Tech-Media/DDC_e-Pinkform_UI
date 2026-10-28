const thaiDate = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });
const thaiShort = new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
const time = new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });
const timeSec = new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const money = new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("th-TH");

const toDate = (v) => (v instanceof Date ? v : new Date(/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T00:00:00` : v));

// "2026-10-28" → "28 ตุลาคม 2569"
export const formatThaiDate = (v) => thaiDate.format(toDate(v));
// → "28/10/2569"
export const formatDate = (v) => thaiShort.format(toDate(v));
// → "08:42"
export const formatTime = (v) => time.format(toDate(v));
// → "28/10/2569 08:42"
export const formatDateTime = (v) => `${formatDate(v)} ${formatTime(v)}`;
// → "28/10/2569 08:42:10"
export const formatDateTimeSec = (v) => `${formatDate(v)} ${timeSec.format(toDate(v))}`;
// 12600 → "12,600.00"
export const formatMoney = (v) => money.format(v);
// 1420 → "1,420"
export const formatNumber = (v) => number.format(v);
