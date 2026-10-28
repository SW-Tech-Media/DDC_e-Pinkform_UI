// นิยาม MCP server (tools / resources) ใช้ร่วมกันทั้งโหมด stdio และ HTTP

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { findSections, getScreen, listDocs, listScreens, parseSections, readDoc, searchDocs } from "./docs.js";

const text = (t) => ({ content: [{ type: "text", text: t }] });
const notFound = (t) => ({ content: [{ type: "text", text: t }], isError: true });

export function createServer(DOCS_DIR) {
  const server = new McpServer({ name: "pinkforms-docs", version: "1.0.0" });

  // ---------- Resources: ไฟล์ md ทั้งไฟล์ ----------

  server.registerResource(
    "doc",
    new ResourceTemplate("pinkforms://docs/{name}", {
      list: () => ({
        resources: listDocs(DOCS_DIR).map((d) => ({
          uri: `pinkforms://docs/${d.name}`,
          name: d.name,
          description: d.description,
          mimeType: "text/markdown",
        })),
      }),
    }),
    { title: "เอกสาร DDC e-Pinkforms", mimeType: "text/markdown" },
    async (uri, { name }) => {
      const doc = readDoc(DOCS_DIR, name);
      if (!doc) throw new Error(`ไม่พบเอกสาร ${name}`);
      return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: doc.text }] };
    },
  );

  // ---------- Tools ----------

  server.registerTool(
    "list_docs",
    {
      title: "รายการเอกสาร",
      description: "แสดงเอกสารทั้งหมดและหัวข้อหลัก (#, ##) ของแต่ละไฟล์ ใช้ก่อนเรียก get_section",
      inputSchema: {},
    },
    async () => {
      const out = listDocs(DOCS_DIR).map((d) => {
        const doc = readDoc(DOCS_DIR, d.name);
        const toc = parseSections(doc.text)
          .filter((s) => s.level <= 2)
          .map((s) => `${"  ".repeat(s.level - 1)}- ${s.title}`)
          .join("\n");
        return `## ${d.name} (${d.file})\n${d.description}\n\n${toc}`;
      });
      return text(out.join("\n\n"));
    },
  );

  server.registerTool(
    "get_section",
    {
      title: "อ่านหัวข้อในเอกสาร",
      description:
        "อ่านเนื้อหาของหัวข้อตามชื่อ (ไม่ต้องใส่อีโมจิ) เช่น doc=system-overview heading='สถานะคำขอ', doc=flamework heading='Semantic Colors'",
      inputSchema: {
        doc: z.string().describe("ชื่อเอกสาร: system-overview, screens หรือ flamework"),
        heading: z.string().describe("ชื่อหัวข้อ หรือบางส่วนของชื่อ"),
      },
    },
    async ({ doc, heading }) => {
      const d = readDoc(DOCS_DIR, doc);
      if (!d)
        return notFound(
          `ไม่พบเอกสาร "${doc}" — ใช้ได้: ${listDocs(DOCS_DIR)
            .map((x) => x.name)
            .join(", ")}`,
        );
      const hits = findSections(d.text, heading);
      if (!hits.length) return notFound(`ไม่พบหัวข้อ "${heading}" ใน ${doc} — เรียก list_docs เพื่อดูหัวข้อทั้งหมด`);
      return text(hits.map((s) => s.content).join("\n\n---\n\n"));
    },
  );

  server.registerTool(
    "search_docs",
    {
      title: "ค้นหาในเอกสาร",
      description: "ค้นหาคำในทุกเอกสาร (ทุกคำต้องอยู่ในหัวข้อเดียวกัน) คืนตำแหน่งหัวข้อและบรรทัดที่พบ",
      inputSchema: {
        query: z.string().describe("คำค้น คั่นหลายคำด้วยช่องว่าง เช่น 'PIN ล็อก' หรือ 'Ref.1'"),
        limit: z.number().int().min(1).max(50).optional().describe("จำนวนผลสูงสุด (ค่าเริ่มต้น 10)"),
      },
    },
    async ({ query, limit }) => {
      const hits = searchDocs(DOCS_DIR, query, limit ?? 10);
      if (!hits.length) return text(`ไม่พบ "${query}"`);
      return text(hits.map((h) => `### ${h.doc} › ${h.path}\n${h.snippet}`).join("\n\n"));
    },
  );

  server.registerTool(
    "list_screens",
    {
      title: "รายการหน้าจอ",
      description: "รายการหน้าจอทั้งหมด (รหัส P-/B-) พร้อมชื่อ หน้าจอ Figma ที่ตรงกัน และหน้าจอที่เสนอเพิ่ม",
      inputSchema: {},
    },
    async () => {
      const rows = listScreens(DOCS_DIR).map(
        (s) => `| ${s.code} | ${s.name} | ${s.figma.join("<br>") || "—"} | ${s.proposed ? "เสนอเพิ่ม" : ""} |`,
      );
      return text(["| รหัส | ชื่อหน้าจอ | Figma | หมายเหตุ |", "|---|---|---|---|", ...rows].join("\n"));
    },
  );

  server.registerTool(
    "get_screen",
    {
      title: "รายละเอียดหน้าจอ",
      description:
        "รายละเอียดหน้าจอจากรหัส P-/B- (เช่น B-05) หรือรหัส Figma (เช่น D09) รวม UI จาก Figma และข้อกำหนด/TOR จากรายการหน้าจอ",
      inputSchema: { id: z.string().describe("รหัสหน้าจอ เช่น B-05, P-01M, D10, S01") },
    },
    async ({ id }) => {
      const out = getScreen(DOCS_DIR, id);
      return out ? text(out) : notFound(`ไม่พบหน้าจอ "${id}" — เรียก list_screens เพื่อดูรหัสทั้งหมด`);
    },
  );

  server.registerTool(
    "get_design_tokens",
    {
      title: "Design Token",
      description: "Font, Type scale, สี (Vuetify theme + Semantic), Spacing, Radius, Elevation และ Layout จาก Figma",
      inputSchema: {},
    },
    async () => {
      const d = readDoc(DOCS_DIR, "flamework");
      if (!d) return notFound("ไม่พบ flamework.md");
      const wanted = ["Font", "Color Tokens", "Vuetify Defaults"];
      const parts = parseSections(d.text)
        .filter((s) => s.level === 1 && wanted.some((w) => s.title.includes(w)))
        .map((s) => s.content);
      return text(parts.join("\n\n"));
    },
  );

  return server;
}
