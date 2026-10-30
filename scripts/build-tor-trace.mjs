// สร้าง src/mocks/tor-trace.js จากตาราง TOR → Prototype ใน docs/Traceability_TOR_Flow_Prototype.md
// รัน: npm run tor-trace (หลัง business-analyst ปรับเอกสาร)
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "docs/Traceability_TOR_Flow_Prototype.md";
const OUT = "src/mocks/tor-trace.js";
const md = readFileSync(SRC, "utf8");

const cells = (line) =>
  line
    .replace(/^\|\s*|\s*\|\s*$/g, "")
    .split(/\s*(?<!\\)\|\s*/)
    .map((c) => c.replace(/\\\|/g, "|").trim());
// รหัสหน้าจอในช่อง "หน้าจอ" — ขยายช่วง เช่น "P-01 – P-06" เป็น P-01 … P-06
const screenCodes = (s) => {
  const ranged = s.replace(/([PB])-(\d{2}) – \1-(\d{2})/g, (_, p, a, b) =>
    Array.from({ length: b - a + 1 }, (_, i) => `${p}-${String(+a + i).padStart(2, "0")}`).join(", ")
  );
  return [...new Set(ranged.match(/[PB]-\d{2}(?:\.\d)?/g) ?? [])];
};
const plain = (s) => s.replace(/\*\*/g, "").replace(/`/g, "");

const STATUS = { "ครบ": "done", "บางส่วน": "partial", "ไม่มี": "missing", "N/A": "na" };
let kind = null;
let section = "";
const items = [];
for (const line of md.split("\n")) {
  if (line.startsWith("### 2.1")) kind = "F";
  else if (line.startsWith("### 2.2")) kind = "NF";
  else if (line.startsWith("## 3")) kind = null;
  else if (kind && line.startsWith("#### ")) section = plain(line.slice(5));
  else if (kind && /^\| (F|NF)-\d+ /.test(line)) {
    const [id, tor, requirement, screen, status, note] = cells(line);
    items.push({
      id,
      kind,
      section: kind === "F" ? section : "Non-functional",
      tor: plain(tor),
      requirement: plain(requirement),
      screenText: plain(screen) === "—" ? "" : plain(screen),
      codes: screenCodes(screen),
      status: STATUS[plain(status)] ?? "partial",
      note: plain(note ?? ""),
    });
  }
}
const version = md.match(/\| Prototype \| \*\*v([\d.]+)\*\*/)?.[1] ?? "";
const date = md.match(/ปรับปรุง (\d+\/\d+\/\d+)/)?.[1] ?? "";

writeFileSync(
  OUT,
  `// สร้างอัตโนมัติจาก ${SRC} ด้วย scripts/build-tor-trace.mjs — อย่าแก้ไฟล์นี้โดยตรง\n` +
    `export const torTraceSource = ${JSON.stringify({ file: SRC, version, date })};\n\n` +
    `export const torTrace = ${JSON.stringify(items, null, 2)};\n`
);
console.log(`${OUT}: ${items.length} ข้อ (F ${items.filter((x) => x.kind === "F").length} / NF ${items.filter((x) => x.kind === "NF").length})`);
