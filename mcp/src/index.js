#!/usr/bin/env node
// จุดเริ่มต้น MCP server เอกสาร DDC e-Pinkforms
//   node src/index.js                       → stdio (ให้ Claude Code / Desktop เรียกตรง)
//   node src/index.js --http                → HTTP ที่ http://localhost:3333/mcp
//   node src/index.js --http --host         → เปิดให้เครื่องอื่นในเครือข่ายเชื่อมต่อได้ (0.0.0.0)
//   node src/index.js --http --host 10.0.0.5 --port 4000

import { createServer as createHttpServer } from "node:http";
import { networkInterfaces } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";

const DOCS_DIR = process.env.PINKFORMS_DOCS_DIR
  ? resolve(process.env.PINKFORMS_DOCS_DIR)
  : resolve(dirname(fileURLToPath(import.meta.url)), "../../md");

// --host ไม่ระบุค่า = 0.0.0.0 แบบเดียวกับ Vite จึงต้องแยกกรณีนี้ก่อนส่งให้ parseArgs
const argv = process.argv.slice(2);
const hostIdx = argv.indexOf("--host");
if (hostIdx >= 0 && (argv[hostIdx + 1] === undefined || argv[hostIdx + 1].startsWith("--"))) {
  argv.splice(hostIdx + 1, 0, "0.0.0.0");
}
const { values: opts } = parseArgs({
  args: argv,
  options: {
    http: { type: "boolean", default: false },
    host: { type: "string" },
    port: { type: "string", default: process.env.PORT ?? "3333" },
  },
});

if (!opts.http && !opts.host) {
  await createServer(DOCS_DIR).connect(new StdioServerTransport());
} else {
  startHttp(opts.host ?? "localhost", Number(opts.port));
}

function readJson(req) {
  return new Promise((ok, fail) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        ok(body ? JSON.parse(body) : undefined);
      } catch (e) {
        fail(e);
      }
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(data));
}

function startHttp(host, port) {
  const http = createHttpServer(async (req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");

    if (pathname === "/health") return sendJson(res, 200, { status: "ok", docs: DOCS_DIR });
    if (pathname !== "/mcp") return sendJson(res, 404, { error: "ใช้ endpoint /mcp" });

    // Stateless: สร้าง server + transport ใหม่ทุก request เพราะทุก tool อ่านไฟล์ใหม่อยู่แล้ว ไม่มี state ต้องเก็บ
    if (req.method !== "POST") {
      return sendJson(res, 405, { jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed" }, id: null });
    }
    try {
      const body = await readJson(req);
      const server = createServer(DOCS_DIR);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on("close", () => {
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (e) {
      if (!res.headersSent) {
        sendJson(res, 400, { jsonrpc: "2.0", error: { code: -32700, message: String(e.message ?? e) }, id: null });
      }
    }
  });

  http.listen(port, host, () => {
    const lines = [`\n  pinkforms-docs MCP (HTTP)  docs: ${DOCS_DIR}\n`, `  ➜  Local:   http://localhost:${port}/mcp`];
    if (host === "0.0.0.0" || host === "::") {
      const ips = Object.values(networkInterfaces())
        .flat()
        .filter((a) => a?.family === "IPv4" && !a.internal)
        .map((a) => a.address);
      if (!ips.length) lines.push("  ➜  Network: (ไม่พบ IP ของเครือข่าย)");
      for (const ip of ips) lines.push(`  ➜  Network: http://${ip}:${port}/mcp`);
    } else if (host !== "localhost") {
      lines.push(`  ➜  Network: http://${host}:${port}/mcp`);
    } else {
      lines.push("  ➜  Network: use --host to expose");
    }
    console.log(lines.join("\n") + "\n");
  });
}
