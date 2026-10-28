# pinkforms-docs MCP

MCP server สำหรับให้ AI (Claude Code, Claude Desktop ฯลฯ) อ่านรายละเอียดระบบ DDC e-Pinkforms ระหว่างสร้าง Prototype
ข้อมูลมาจากไฟล์ใน `../md` ทั้งหมด และอ่านใหม่ทุกครั้งที่เรียก แก้ md แล้วใช้ได้ทันทีโดยไม่ต้อง restart

| ไฟล์                  | เนื้อหา                                                         |
| -------------------- | -------------------------------------------------------------- |
| `system-overview.md` | ระบบ ผู้ใช้ สถาปัตยกรรม Flow สถานะคำขอ รายการหน้าจอ และตารางตรวจ TOR |
| `screens.md`         | รายละเอียด UI แต่ละหน้าจอจาก Figma                                 |
| `flamework.md`       | Framework, Font, Design Token, Vuetify defaults                 |

## ติดตั้ง

ต้องมี Node.js 18 ขึ้นไป

```bash
cd "Output/5_Prototype/mcp"
npm install
npm test        # ทดสอบ server กับไฟล์ md จริง
```

## รันแบบ HTTP (เหมือน Vite)

> ถ้ารันจากโฟลเดอร์ `5_Prototype` (ไม่ใช่ `mcp/`) ให้ใช้ `npm run mcp:dev -- --host` เพราะ `npm run dev` ที่นั่นคือ Prototype (Vite)

```bash
npm run dev              # http://localhost:3333/mcp  (restart อัตโนมัติเมื่อแก้โค้ดใน src/)
npm run dev -- --host    # เปิดให้เครื่องอื่นในวงแลนเชื่อมต่อได้ แสดง URL Network ให้
npm run dev -- --host --port 4000
npm run serve -- --host  # แบบเดียวกันแต่ไม่ watch (ใช้รันจริง)
```

```
  ➜  Local:   http://localhost:3333/mcp
  ➜  Network: http://192.168.x.x:3333/mcp
```

- ตรวจสถานะได้ที่ `GET /health`
- `--host` ไม่ระบุค่าจะ bind `0.0.0.0` และระบุ IP เองได้ เช่น `--host 192.168.1.10`
- ไม่มีการยืนยันตัวตน ทุกคนในเครือข่ายเดียวกันอ่านเอกสารได้ จึงควรใช้เฉพาะในวงแลนของทีม

เชื่อมต่อจากเครื่องอื่นด้วย Claude Code:

```bash
claude mcp add --transport http pinkforms-docs http://192.168.x.x:3333/mcp
```

## เพิ่มเข้า Claude Code (stdio บนเครื่องตัวเอง)

รันจากโฟลเดอร์โปรเจกต์ (Pinkform Proposal):

```bash
claude mcp add pinkforms-docs -- node "$(pwd)/Output/5_Prototype/mcp/src/index.js"
```

หรือเพิ่มใน `.mcp.json` ของโปรเจกต์ (ใช้ร่วมกันทั้งทีม):

```json
{
  "mcpServers": {
    "pinkforms-docs": {
      "command": "node",
      "args": ["Output/5_Prototype/mcp/src/index.js"]
    }
  }
}
```

## เพิ่มเข้า Claude Desktop

แก้ `~/Library/Application Support/Claude/claude_desktop_config.json` (ต้องใช้ path เต็ม):

```json
{
  "mcpServers": {
    "pinkforms-docs": {
      "command": "node",
      "args": ["/path/to/Pinkform Proposal/Output/5_Prototype/mcp/src/index.js"]
    }
  }
}
```

ถ้าเก็บไฟล์ md ไว้ที่อื่น ให้กำหนด `"env": { "PINKFORMS_DOCS_DIR": "/path/to/md" }`

## Tools

| Tool                | ใช้ทำอะไร                                                                      | ตัวอย่าง                                              |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- |
| `list_docs`         | รายการเอกสารและสารบัญ                                                          | —                                                    |
| `get_section`       | อ่านหัวข้อตามชื่อ (ไม่ต้องใส่อีโมจิ)                                                | `doc: "system-overview", heading: "สถานะคำขอ"`       |
| `search_docs`       | ค้นหาคำในทุกเอกสาร                                                             | `query: "PIN ล็อก"`                                  |
| `list_screens`      | รายการหน้าจอ P-/B- พร้อมชื่อ หน้าจอ Figma และหน้าจอที่เสนอเพิ่ม                      | —                                                    |
| `get_screen`        | รายละเอียดหน้าจอ รวม UI จาก Figma + ข้อกำหนด/TOR                                  | `id: "B-05"` หรือ `id: "D10"`                        |
| `get_design_tokens` | Font, สี, Type scale, Spacing, Radius, Elevation, Layout                       | —                                                    |

## Resources

ไฟล์ md ทั้งไฟล์: `pinkforms://docs/system-overview`, `pinkforms://docs/screens`, `pinkforms://docs/flamework`

## เพิ่มเอกสารใหม่

วางไฟล์ `.md` ใหม่ใน `../md` ได้เลย server จะเห็นเป็นเอกสารใหม่ทันที (ใส่คำอธิบายเพิ่มได้ที่ `DOC_DESCRIPTIONS` ใน `src/docs.js`)
`list_screens` / `get_screen` อ่านตามรูปแบบเดิม คือ ตารางที่คอลัมน์แรกเป็น "รหัส…" และหัวข้อ `## Dxx · ชื่อ — \`B-xx\`` ใน screens.md
