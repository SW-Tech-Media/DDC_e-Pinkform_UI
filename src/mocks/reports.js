// ข้อมูลจำลองหน้า B-13 · รายงานสรุป (TOR 4.4.6)
// ตัวเลขรายวันสร้างแบบกำหนดได้ (deterministic) จากวันที่ — ช่วงวันที่เดียวกันได้ผลเท่าเดิมทุกครั้ง
import { operators, operatorTypes } from "./operators.js";
import { banks } from "./payments.js";

export const reportToday = "2026-10-26";
export const defaultReportRange = ["2026-10-01", "2026-10-26"];
export const serviceFee = 300;

// รายงานที่บันทึกไว้ (ตัวอย่างเริ่มต้น)
export const savedReports = [
  { id: 1, name: "สรุปค่าชำระบริการ ต.ค. 2569", type: "fees", range: ["2026-10-01", "2026-10-26"], updatedAt: "2026-10-26T08:15:00" },
  { id: 2, name: "ใบรับรองฯ ตามประเทศ ไตรมาส 4/2569", type: "countries", range: ["2026-07-01", "2026-09-30"], updatedAt: "2026-10-05T14:20:00" },
  { id: 3, name: "กระทบยอดประจำวัน", type: "daily", range: ["2026-10-26", "2026-10-26"], updatedAt: "2026-10-26T10:40:00" },
  { id: 4, name: "ผู้ประกอบการที่ยื่นคำขอ ก.ย. 2569", type: "operators", range: ["2026-09-01", "2026-09-30"], updatedAt: "2026-10-01T09:00:00" },
];

// ประเทศผู้รับสินค้า + น้ำหนักสัดส่วน
const countries = [
  ["จีน", 9],
  ["ไต้หวัน", 7],
  ["ญี่ปุ่น", 6],
  ["ฮ่องกง", 5],
  ["มาเลเซีย", 4],
  ["สิงคโปร์", 3],
  ["เกาหลีใต้", 3],
  ["เวียดนาม", 2],
];

// ---------- ตัวช่วย ----------
const hash = (s) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 2147483647, 7);
const rand = (key, min, max) => min + (hash(key) % (max - min + 1));
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// วันในช่วง (ไม่เกินวันนี้) — ระบบรับคำขอผ่าน NSW ตลอด 24 ชม. วันหยุดมีปริมาณน้อยกว่า
export function workDays([from, to]) {
  const days = [];
  if (!from) return days;
  const end = new Date(`${(to || from) > reportToday ? reportToday : to || from}T00:00:00`);
  for (let d = new Date(`${from}T00:00:00`); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(iso(d));
  }
  return days;
}

// ยอดของวันหนึ่ง: คำขอ / ชำระสำเร็จ / ไม่สำเร็จ / ใบรับรองฯ / ใบเสร็จ
function day(dateIso) {
  const weekend = [0, 6].includes(new Date(`${dateIso}T00:00:00`).getDay());
  const requests = weekend ? rand(`${dateIso}r`, 8, 16) : rand(`${dateIso}r`, 44, 66);
  const failed = rand(`${dateIso}f`, 0, 2);
  const paid = requests - failed - rand(`${dateIso}p`, 1, 4);
  const cancelled = rand(`${dateIso}c`, 0, 6) === 0 ? 1 : 0;
  return { date: dateIso, requests, paid, failed, certificates: paid, receipts: paid, cancelled, amount: paid * serviceFee };
}

// ---------- รายงานแต่ละประเภท (คืนค่า rows ตาม key ใน content/reports.js) ----------
const builders = {
  // รายงานผู้ประกอบการ — จำนวนคำขอ / ใบรับรองฯ / ค่าบริการ แยกรายบริษัท
  operators(range) {
    const days = workDays(range);
    return operators
      .map((o) => {
        const requests = days.reduce((a, d) => a + rand(`${d}${o.taxId}`, 0, 3), 0);
        const certificates = Math.max(0, requests - rand(`${o.taxId}${range[0]}`, 0, 2));
        return {
          id: o.id,
          taxId: o.taxId,
          name: o.nameTh,
          type: operatorTypes[o.type].label,
          requests,
          certificates,
          amount: certificates * serviceFee,
        };
      })
      .sort((a, b) => b.requests - a.requests);
  },
  // รายงานค่าชำระบริการ — รายวัน
  fees(range) {
    return workDays(range).map((d) => {
      const x = day(d);
      return { id: d, date: d, bills: x.requests, paid: x.paid, failed: x.failed, pending: x.requests - x.paid - x.failed, amount: x.amount };
    });
  },
  // รายงานใบเสร็จรับเงิน — รายวัน
  receipts(range) {
    return workDays(range).map((d) => {
      const x = day(d);
      return { id: d, date: d, issued: x.receipts, signed: x.receipts - x.cancelled, cancelled: x.cancelled, amount: (x.receipts - x.cancelled) * serviceFee };
    });
  },
  // รายงานใบรับรองฯ ตามประเทศผู้รับสินค้า
  countries(range) {
    const total = workDays(range).reduce((a, d) => a + day(d).certificates, 0);
    const weight = countries.reduce((a, [, w]) => a + w, 0);
    let left = total;
    const rows = countries.map(([country, w], i) => {
      const count = i === countries.length - 1 ? left : Math.round((total * w) / weight);
      left -= count;
      return { id: country, country, count, items: count * rand(`${country}i`, 2, 4), share: total ? (count / total) * 100 : 0 };
    });
    return total ? rows : [];
  },
  // รายงานการชำระเงินประจำวันและกระทบยอด — แยกตามธนาคาร
  daily(range) {
    const days = workDays(range);
    if (!days.length) return [];
    const codes = Object.keys(banks);
    return codes.map((code, i) => {
      const count = days.reduce((a, d) => {
        const paid = day(d).paid;
        const share = Math.floor(paid / codes.length);
        return a + (i === 0 ? paid - share * (codes.length - 1) : share);
      }, 0);
      const system = count * serviceFee;
      // ตัวอย่างยอดไม่ตรง: ธนาคาร 002 วันที่ 23 ต.ค. (รอธนาคารส่งไฟล์ยืนยันเพิ่มเติม)
      const diff = code === "002" && days.includes("2026-10-23") ? -serviceFee : 0;
      return { id: code, bank: `${code} · ${banks[code]}`, count, system, bankAmount: system + diff, diff, result: diff ? "mismatch" : "matched" };
    });
  },
};

export const buildReport = (type, range) => builders[type](range);

// ข้อมูลกราฟของรายงานรายวัน: ไม่เกิน 31 วัน = รายวัน · เกินกว่านั้นรวมเป็นรายเดือน
// คืนค่า { monthly, buckets: [{ bucket: "2026-10-05" | "2026-10", values: { key: ผลรวม } }] }
export function chartBuckets(rows, keys) {
  const monthly = rows.length > 31;
  const map = new Map();
  rows.forEach((r) => {
    const bucket = monthly ? r.date.slice(0, 7) : r.date;
    const acc = map.get(bucket) ?? Object.fromEntries(keys.map((k) => [k, 0]));
    keys.forEach((k) => (acc[k] += r[k]));
    map.set(bucket, acc);
  });
  return { monthly, buckets: [...map].map(([bucket, values]) => ({ bucket, values })) };
}
