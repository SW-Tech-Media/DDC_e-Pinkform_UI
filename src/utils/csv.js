// สร้างไฟล์ CSV (UTF-8 + BOM ให้ Excel อ่านภาษาไทยได้) แล้วดาวน์โหลดในเบราว์เซอร์
// downloadCsv("ชื่อไฟล์.csv", ["หัวคอลัมน์", …], [[ค่า, …], …])
const cell = (v) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const toCsv = (headers, rows) => [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");

export const downloadCsv = (filename, headers, rows) => {
  const blob = new Blob(["﻿", toCsv(headers, rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
