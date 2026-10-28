// อ่านและแยกไฟล์ markdown เป็นหัวข้อ (section) / ตาราง สำหรับให้ MCP tools ค้นหา
// อ่านไฟล์ใหม่ทุกครั้งที่เรียก เพื่อให้แก้ md แล้วเห็นผลทันทีโดยไม่ต้อง restart server

import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export const DOC_DESCRIPTIONS = {
  "system-overview": "ภาพรวมระบบ ผู้ใช้ สถาปัตยกรรม Flow สถานะคำขอ รายการหน้าจอ ข้อมูลหลัก การเชื่อมโยง PKI และตารางตรวจ TOR",
  screens: "รายละเอียด UI ของแต่ละหน้าจอจาก Figma (D01–D18, S01–S02): ฟิลด์ คอลัมน์ ปุ่ม สถานะ และข้อสังเกตเทียบ TOR",
  flamework: "Framework, Font, Design Token (สี, Type scale, Spacing, Radius, Elevation, Layout), Vuetify defaults และ dependencies",
};

export function listDocs(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const name = basename(f, ".md");
      return { name, file: f, description: DOC_DESCRIPTIONS[name] ?? "" };
    });
}

export function readDoc(dir, name) {
  const doc = listDocs(dir).find((d) => d.name === name || d.file === name);
  if (!doc) return null;
  return { ...doc, text: readFileSync(join(dir, doc.file), "utf8") };
}

// แยกเป็น section ตามหัวข้อ #..###### โดยไม่นับ # ที่อยู่ใน code block
// section หนึ่งครอบคลุมเนื้อหาจนถึงหัวข้อถัดไปที่ระดับเท่ากันหรือสูงกว่า
export function parseSections(text) {
  const lines = text.split("\n");
  const headings = [];
  let inFence = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) return;
    const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (m) headings.push({ level: m[1].length, title: m[2], line: i });
  });

  const stack = [];
  return headings.map((h, idx) => {
    while (stack.length && stack[stack.length - 1].level >= h.level) stack.pop();
    const path = [...stack.map((s) => s.title), h.title];
    stack.push(h);
    let end = lines.length;
    for (const next of headings.slice(idx + 1)) {
      if (next.level <= h.level) {
        end = next.line;
        break;
      }
    }
    return {
      level: h.level,
      title: h.title,
      path,
      content: lines.slice(h.line, end).join("\n").trim(),
    };
  });
}

// ตัดอีโมจิและสัญลักษณ์นำหน้าหัวข้อ เพื่อให้ค้นด้วยชื่อหัวข้อได้ง่าย
export function normalizeTitle(title) {
  return title
    .replace(/[\p{Extended_Pictographic}️]/gu, "")
    .replace(/`/g, "")
    .trim()
    .toLowerCase();
}

export function findSections(text, heading) {
  const q = normalizeTitle(heading);
  const sections = parseSections(text);
  const exact = sections.filter((s) => normalizeTitle(s.title) === q);
  return exact.length ? exact : sections.filter((s) => normalizeTitle(s.title).includes(q));
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

// คืนตารางทั้งหมดในเอกสาร: { header: [...], rows: [[...]], heading }
export function parseTables(text) {
  const lines = text.split("\n");
  const tables = [];
  let heading = "";
  for (let i = 0; i < lines.length; i++) {
    const h = /^#{1,6}\s+(.+)$/.exec(lines[i]);
    if (h) heading = h[1];
    const isHeader = lines[i].trim().startsWith("|") && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] ?? "");
    if (!isHeader) continue;
    const header = splitRow(lines[i]);
    const rows = [];
    let j = i + 2;
    while (j < lines.length && lines[j].trim().startsWith("|")) rows.push(splitRow(lines[j++]));
    tables.push({ heading, header, rows });
    i = j - 1;
  }
  return tables;
}

const SCREEN_CODE = /^`?([PB]-\d+(?:\.\d+)?M?)`?$/;

// รวมรายการหน้าจอจาก system-overview (รหัส P-/B-) และ screens (หน้าจอ Figma D/S)
export function listScreens(dir) {
  const overview = readDoc(dir, "system-overview");
  const screensDoc = readDoc(dir, "screens");
  const byCode = new Map();

  if (overview) {
    for (const t of parseTables(overview.text)) {
      const codeCol = t.header.findIndex((c) => c.startsWith("รหัส"));
      const nameCol = t.header.findIndex((c) => c.includes("ชื่อหน้าจอ"));
      if (codeCol !== 0 || nameCol < 0) continue;
      const proposed = t.header[codeCol].includes("เสนอ");
      for (const r of t.rows) {
        const m = SCREEN_CODE.exec(r[codeCol]);
        if (!m || byCode.has(m[1])) continue;
        byCode.set(m[1], { code: m[1], name: r[nameCol], proposed, figma: [] });
      }
    }
  }

  if (screensDoc) {
    for (const s of parseSections(screensDoc.text).filter((x) => x.level === 2)) {
      const figma = /^((?:[DS]\d+)(?:\s*\/\s*[DS]\d+)*)\s*·/.exec(s.title);
      if (!figma) continue;
      const codes = [...s.title.matchAll(/`([PB]-[\d.]+M?)`/g)].map((m) => m[1]);
      for (const code of codes) {
        const entry = byCode.get(code) ?? { code, name: "", proposed: false, figma: [] };
        entry.figma.push(s.title.split("—")[0].trim());
        byCode.set(code, entry);
      }
    }
  }

  return [...byCode.values()];
}

// หารายละเอียดหน้าจอจากรหัส P-/B- หรือรหัส Figma (D09, S01)
export function getScreen(dir, id) {
  const key = id.trim().toUpperCase();
  const parts = [];

  const screensDoc = readDoc(dir, "screens");
  if (screensDoc) {
    const figmaId = new RegExp(`(^|[\\s/])${key}(\\s|·|$)`);
    for (const s of parseSections(screensDoc.text).filter((x) => x.level === 2)) {
      const codes = [...s.title.matchAll(/`([^`]+)`/g)].map((m) => m[1].toUpperCase());
      const head = s.title.split("—")[0];
      if (codes.includes(key) || figmaId.test(head.toUpperCase())) {
        parts.push(`<!-- screens.md -->\n${s.content}`);
      }
    }
  }

  const overview = readDoc(dir, "system-overview");
  if (overview) {
    for (const t of parseTables(overview.text)) {
      const hits = t.rows.filter((r) => r.some((c) => c.replace(/`/g, "").toUpperCase() === key));
      if (!hits.length) continue;
      const rows = hits.map((r) => `| ${r.join(" | ")} |`).join("\n");
      parts.push(
        `<!-- system-overview.md › ${t.heading} -->\n| ${t.header.join(" | ")} |\n|${t.header.map(() => "---").join("|")}|\n${rows}`
      );
    }
  }

  return parts.length ? parts.join("\n\n") : null;
}

// ค้นหาคำในทุกเอกสาร คืน section ระดับล่างสุดที่มีคำค้นครบทุกคำ
export function searchDocs(dir, query, limit = 10) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const results = [];
  for (const d of listDocs(dir)) {
    const text = readFileSync(join(dir, d.file), "utf8");
    const sections = parseSections(text);
    for (const s of sections) {
      const lower = s.content.toLowerCase();
      if (!terms.every((t) => lower.includes(t))) continue;
      // ข้าม section ที่มี section ลูกตรงเงื่อนไขอยู่แล้ว เพื่อไม่ให้ผลซ้ำ
      const hasMatchingChild = sections.some(
        (c) =>
          c.level > s.level &&
          c.path.slice(0, s.path.length).join("\u0000") === s.path.join("\u0000") &&
          terms.every((t) => c.content.toLowerCase().includes(t))
      );
      if (hasMatchingChild) continue;
      const snippet = s.content
        .split("\n")
        .filter((l) => terms.some((t) => l.toLowerCase().includes(t)))
        .slice(0, 6)
        .join("\n");
      results.push({ doc: d.name, path: s.path.join(" › "), snippet });
    }
  }
  return results.slice(0, limit);
}
