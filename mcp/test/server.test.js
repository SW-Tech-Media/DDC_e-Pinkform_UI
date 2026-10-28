// ทดสอบ server จริงผ่าน stdio กับไฟล์ md ใน ../md
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "test", version: "1.0.0" });
const call = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  return { text: r.content[0].text, isError: r.isError };
};

before(async () => {
  await client.connect(
    new StdioClientTransport({ command: "node", args: [fileURLToPath(new URL("../src/index.js", import.meta.url))] })
  );
});
after(() => client.close());

test("มีครบทุก tool", async () => {
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), [
    "get_design_tokens", "get_screen", "get_section", "list_docs", "list_screens", "search_docs",
  ]);
});

test("resources ครบทั้ง 3 ไฟล์ และอ่านได้", async () => {
  const { resources } = await client.listResources();
  assert.deepEqual(resources.map((r) => r.name).sort(), ["flamework", "screens", "system-overview"]);
  const r = await client.readResource({ uri: "pinkforms://docs/flamework" });
  assert.match(r.contents[0].text, /Noto Sans Thai/);
});

test("list_docs แสดงสารบัญ", async () => {
  const { text } = await call("list_docs");
  assert.match(text, /## screens/);
  assert.match(text, /สถานะคำขอ/);
});

test("get_section หาเจอแม้ไม่ใส่อีโมจิ", async () => {
  const { text } = await call("get_section", { doc: "system-overview", heading: "สถานะคำขอ" });
  assert.match(text, /รอการชำระเงิน BILLPAYMENT/);
  const miss = await call("get_section", { doc: "system-overview", heading: "ไม่มีหัวข้อนี้" });
  assert.equal(miss.isError, true);
});

test("get_screen ด้วยรหัสระบบและรหัส Figma", async () => {
  const b05 = await call("get_screen", { id: "B-05" });
  assert.match(b05.text, /D09 · Admin \/ Requests/);
  assert.match(b05.text, /D18/);
  assert.match(b05.text, /system-overview\.md/);
  const d10 = await call("get_screen", { id: "d10" });
  assert.match(d10.text, /Checklist/);
  // B-01 ต้องไม่ดึง B-01.2 / B-01.3 มาปน
  const b01 = await call("get_screen", { id: "B-01" });
  assert.doesNotMatch(b01.text, /D05/);
  assert.equal((await call("get_screen", { id: "Z-99" })).isError, true);
});

test("list_screens รวมรหัส ชื่อ และ Figma", async () => {
  const { text } = await call("list_screens");
  assert.match(text, /\| B-05 \| รายการคำขอใบรับรองฯ/);
  assert.match(text, /\| B-21 \|.*เสนอเพิ่ม/);
  assert.match(text, /\| P-01M \|.*S01/);
});

test("โหมด HTTP: --host รับ request จากภายนอกได้", async () => {
  const { spawn } = await import("node:child_process");
  const { StreamableHTTPClientTransport } = await import("@modelcontextprotocol/sdk/client/streamableHttp.js");
  const proc = spawn("node", [fileURLToPath(new URL("../src/index.js", import.meta.url)), "--http", "--host", "--port", "3399"]);
  try {
    const out = await new Promise((ok) => proc.stdout.on("data", (d) => String(d).includes("Local") && ok(String(d))));
    assert.match(out, /Network: (http:\/\/|\(ไม่พบ IP)/);
    assert.doesNotMatch(out, /use --host/);
    const health = await fetch("http://127.0.0.1:3399/health").then((r) => r.json());
    assert.equal(health.status, "ok");
    const http = new Client({ name: "http-test", version: "1.0.0" });
    await http.connect(new StreamableHTTPClientTransport(new URL("http://127.0.0.1:3399/mcp")));
    const r = await http.callTool({ name: "get_screen", arguments: { id: "D10" } });
    assert.match(r.content[0].text, /Checklist/);
    await http.close();
  } finally {
    proc.kill();
  }
});

test("search_docs และ get_design_tokens", async () => {
  const s = await call("search_docs", { query: "ล็อก 15 นาที" });
  assert.match(s.text, /PIN/);
  const t = await call("get_design_tokens");
  assert.match(t.text, /#0A6578/);
  assert.match(t.text, /Type Scale/);
});
