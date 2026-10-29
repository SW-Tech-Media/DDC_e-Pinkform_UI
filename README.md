# DDC e-Pinkforms UI Prototype

Prototype ระบบบริการใบรับรองแหล่งผลิตแหล่งกำเนิดอาหารปลอดโรค (DDC e-Pinkforms) ผ่านระบบ National Single Window
Vue 3 + Vuetify 3 + Vite · ดีไซน์ตาม [Figma — DDC e-Pinkforms](https://www.figma.com/design/O1QKAG1dNDQ7DROItvmJhU/DDC-e-Pinkforms)

## เริ่มต้น

ต้องมี Node.js 18.11 ขึ้นไป

```bash
npm install              # ติดตั้ง Prototype และ MCP server
npm run dev              # http://localhost:5173
npm run dev -- --host    # เปิดให้เครื่องอื่นในวงแลนเข้าได้
npm run build            # build สำหรับ deploy (โฟลเดอร์ dist/)
```

## โครงสร้าง

| โฟลเดอร์            | เนื้อหา                                                                            |
| ------------------- | --------------------------------------------------------------------------------- |
| `src/design/`       | **Design Token** (`tokens.js`) — ค่าสี ฟอนต์ ระยะ ขนาด ทั้งหมดของระบบ                    |
| `src/components/`   | Component ที่ใช้ร่วมกัน                                                             |
| `src/layouts/`      | Layout ของหน้า                                                                     |
| `src/views/`        | หน้าจอ                                                                            |
| `src/content/`      | ข้อความของหน้า และ Patch Notes (`patch-notes.js`)                                    |
| `md/`               | เอกสารระบบ: ภาพรวม/Flow/TOR (`system-overview.md`), หน้าจอ (`screens.md`), Framework/Token (`flamework.md`) |
| `mcp/`              | MCP server ให้ AI อ่านเอกสารใน `md/` (ดู [mcp/README.md](mcp/README.md))              |
| `docs/`             | เอกสารออกแบบเพื่อพัฒนาต่อ (ADR, requirement, API, data, integration, test, ops) — ดู [docs/README.md](docs/README.md) |
| `.claude/agents/`   | Agent ตามบทบาททีมพัฒนาสำหรับ Claude Code                                            |

## กฎการสร้างหน้า

- **ห้าม hardcode** ค่าสี ขนาด ระยะ ฟอนต์ หรือเงา ให้ใช้ Design Token เสมอ
  - สี: ผ่าน Vuetify theme เช่น `color="primary"`, `class="bg-surface text-text-secondary"`
  - ค่าอื่น: CSS variable `--pf-*` และ class `.pf-type-*` (สร้างจาก `src/design/tokens.js`)
- **ใช้ Component เสมอ** ถ้ายังไม่มีให้สร้างใน `src/components/` ก่อน แล้วค่อยใช้ในหน้า
- ข้อความของหน้าเก็บใน `src/content/` ไม่เขียนกระจายใน template
- ทุกครั้งที่ปล่อยเวอร์ชันใหม่ ให้เพิ่มรายการไว้บนสุดของ `src/content/patch-notes.js`

## ทีม Agent (Claude Code)

โปรเจกต์นี้มองเป็นจุดเริ่มของระบบจริง ไม่ใช่ Prototype ทิ้ง — แต่ละบทบาทมี agent ใน `.claude/agents/` เรียกใช้ใน Claude Code ได้ด้วยการพิมพ์ชื่อบทบาท (เช่น "ให้ business-analyst เขียน story ของหน้าพิจารณาคำขอ") หรือ `@agent-<ชื่อ>`

| Agent | ใช้เมื่อ |
| --- | --- |
| `solution-architect` | ตัดสินใจโครงสร้าง, เลือก backend stack (ADR), ออกแบบการเชื่อมระบบ, non-functional |
| `business-analyst` | แปลง TOR เป็น story / acceptance criteria / กฎทางธุรกิจ / traceability |
| `ux-ui-designer` | ออกแบบ / รีวิวหน้าจอตาม Figma และ Design System, UX copy, accessibility |
| `frontend-developer` | สร้าง / แก้หน้าจอ Vue + Vuetify, เตรียมชั้น API ให้สลับ mock เป็น backend จริงได้ |
| `backend-developer` | OpenAPI, data model, state machine, audit log, โค้ด backend (หลัง ADR) |
| `integration-engineer` | ebXML / NSW, XML Schema / DSig, PKI, ธนาคาร, e-Licensing, Back Office เดิม |
| `qa-engineer` | Test plan / test case (Unit → UAT), ทดสอบหน้าจอจริง, regression |
| `security-reviewer` | รีวิวความปลอดภัย / PDPA / OWASP / CTAM (อ่านอย่างเดียว ไม่แก้โค้ด) |
| `devops-engineer` | Environment บน GDCC, CI/CD, Backup/DR, Monitoring |

ผลงานของแต่ละบทบาทเก็บใน `docs/` ตามที่ระบุใน [docs/README.md](docs/README.md)
