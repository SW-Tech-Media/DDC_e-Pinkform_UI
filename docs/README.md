# เอกสารพัฒนาระบบ DDC e-Pinkforms

โฟลเดอร์นี้เก็บผลงานของแต่ละบทบาท (agent ใน `.claude/agents/`) เพื่อให้ Prototype ต่อยอดเป็นระบบจริงได้ทั้ง frontend และ backend — ที่นี่เก็บเฉพาะสิ่งที่ทีม **ตัดสินใจและออกแบบต่อจากเอกสารต้นทาง**

## ไฟล์ที่มีอยู่ตอนนี้ (30/10/2569)

| ไฟล์ | เจ้าของ | เนื้อหา |
| --- | --- | --- |
| `README.md` | ทุกบทบาท | ไฟล์นี้ — โครงสร้าง แหล่งความจริง การประสานงาน ข้อตกลงร่วม |
| `Traceability_TOR_Flow_Prototype.md` | business-analyst | Traceability TOR (F-001 – F-105, NF-01 – NF-57) ↔ Flow 4 – 11 ↔ หน้าจอ Prototype, รายการ Gap (G-xx), คำถามลูกค้า (Q-xx) — อัปเดตล่าสุดตาม **Prototype v0.3.6** (เดิมอยู่ที่ `docs/5_วิเคราะห์ความครบถ้วน/`) |

## เอกสารต้นทาง (อยู่ที่ไหน)

| เอกสาร | ตำแหน่ง |
| --- | --- |
| สรุประบบ / Flow / สถานะ / รายการหน้าจอ / ตารางตรวจ TOR | `../md/system-overview.md` (อ่านผ่าน MCP `pinkforms-docs` ใน `../mcp/` ได้) |
| รายละเอียด UI รายหน้าจอจาก Figma | `../md/screens.md` |
| Framework / Font / Design Token | `../md/flamework.md`, `../src/design/tokens.js`, `../src/components/README.md` |
| ทะเบียนหน้าจอและ route (P-xx / B-xx / รหัส Figma D-xx) | `../src/router/screens.js` และหน้ารวมหน้าจอ `/prototype` |
| ประวัติการเปลี่ยนแปลง Prototype | `../src/content/patch-notes.js` (ปุ่ม Patch Notes ในแอป) |
| TOR v.4 (.docx), Flow (.drawio / .png), `Checklist_TOR_DDC_ePinkforms.xlsx`, `รายการหน้าจอ_DDC_ePinkforms.xlsx`, เอกสารสถาปัตยกรรม (.docx) | **ไม่อยู่ใน repo แล้ว** (ผู้ใช้ย้ายออก) — ขอจากผู้ใช้เมื่อต้องอ้างต้นฉบับ · ระหว่างนี้ใช้ `md/` และตารางใน `Traceability_TOR_Flow_Prototype.md` |

## โครงสร้างที่วางไว้ (สร้างเมื่อเริ่มงานของบทบาทนั้น — ตอนนี้ยังไม่มีโฟลเดอร์ใดถูกสร้าง)

| โฟลเดอร์ | เจ้าของ | เนื้อหา |
| --- | --- | --- |
| `adr/` | solution-architect | Architecture Decision Record (`NNNN-<หัวข้อ>.md`) — รวมถึงการเลือก backend stack |
| `architecture/` | solution-architect | ภาพรวม (C4), module / bounded context, non-functional ตาม TOR |
| `requirements/` | business-analyst | User story + acceptance criteria ต่อ module, กฎทางธุรกิจ (`business-rules.md`, BR-xxx), `traceability.md` (TOR ↔ BR / Story ↔ หน้าจอ ↔ API ↔ Test case), `glossary.md` — เมื่อสร้าง `traceability.md` แล้วให้ย้าย / อ้างตารางจาก `Traceability_TOR_Flow_Prototype.md` |
| `design/` | ux-ui-designer | Spec หน้าจอและการเปลี่ยนแปลง UI (อ้างรหัสหน้าจอ P-xx / B-xx) |
| `api/` | backend-developer | `openapi.yaml` — contract ภายในระหว่าง frontend กับ backend (endpoint ที่เสนอไว้แล้ว: `src/api/auth.js`) |
| `data/` | backend-developer | Data model, state machine ของคำขอ / การชำระ / ใบรับรอง |
| `integration/` | integration-engineer | ข้อความ ebXML / XSD / sequence / error handling / PKI และ `external-api.yaml` (API ทางเลือกให้ NSP / ระบบภายนอก) |
| `test/` | qa-engineer | Test plan, test case (TC-xxx), รายงานผลทดสอบ |
| `ops/` | devops-engineer | Environment, CI/CD, Backup/DR, Monitoring |

Security reviewer ไม่มีโฟลเดอร์ของตัวเอง — รายงานผลรีวิวในบทสนทนา และประเด็นที่ต้องแก้ส่งต่อเจ้าของงาน

## แหล่งความจริง (ถ้าข้อมูลขัดกัน ให้ยึดตามนี้ และแจ้งเจ้าของอีกฝั่งให้แก้ตาม)

| เรื่อง | ยึดตาม | ฝั่งที่ต้องตาม |
| --- | --- | --- |
| ข้อกำหนด | TOR v.4 (11-9-69) → `md/system-overview.md` · ความครบถ้วนเทียบ Prototype: `Traceability_TOR_Flow_Prototype.md` | ทุกบทบาท |
| กฎทางธุรกิจ (BR-xxx) | `requirements/business-rules.md` (เมื่อมีแล้ว) — ก่อนหน้านั้นคือกฎใน `src/stores/review.js` (Checklist ครบ, ประเภทข้อความตอบกลับ, ยกเลิก 15 นาที, อนุมัติ → คำสั่งชำระ) | data/state-machines, หน้าจอ, test case |
| สถานะและการเปลี่ยนสถานะ | `data/state-machines.md` (เมื่อมีแล้ว) — ก่อนหน้านั้นคือ `requestStatuses` ใน `src/mocks/requests.js` และ `paymentStatuses` ใน `src/mocks/payments.js` | mock / store ฝั่ง frontend, integration sequences |
| สิทธิ์รายเมนู | `requirements/business-rules.md` (เมื่อมีแล้ว) — ก่อนหน้านั้นคือร่าง `permissionTemplate` ใน `src/mocks/users-roles.js` (รอยืนยัน Q-15) | router guard, Sidebar, backend |
| นโยบายรหัสผ่าน / การล็อก / อายุลิงก์ | ก่อนมี BR: `src/utils/password.js`, `src/mocks/auth.js` (สมมติฐาน รอยืนยัน Q-20) | backend, B-01.x |
| ชื่อข้อความ ebXML | `integration/` (เมื่อมีแล้ว) — ก่อนหน้านั้นคือ `src/mocks/message-types.js` (รอยืนยัน Q-10) | B-17, B-04, backend / Gateway |
| รูปข้อมูล API ภายใน | `api/openapi.yaml` (เมื่อมีแล้ว) — ก่อนหน้านั้นคือ `src/mocks/` และ `src/api/` | `src/api/` ฝั่ง frontend |
| หน้าตา / Token / Component | Figma → `src/design/tokens.js` + `src/components/README.md` | design spec, หน้าจอ |
| โครงสร้าง / stack | ADR สถานะ Accepted | ทุกบทบาท |

## ลำดับการทำงานของฟีเจอร์ใหม่

1. **business-analyst** — story + acceptance criteria + BR จาก TOR
2. **solution-architect** — ถ้ากระทบโครงสร้าง / การเชื่อมระบบ เขียน ADR
3. **ux-ui-designer** — spec หน้าจอจาก Design System
4. **backend-developer** (+ **integration-engineer**) — อัปเดต OpenAPI / data model / state machine
5. **frontend-developer** — ทำหน้าจอผ่านชั้น `src/api/` (mock ตาม contract จนกว่า backend พร้อม)
6. **qa-engineer** — test case และทดสอบหน้าจอจริง
7. **security-reviewer** — รีวิวก่อน merge งานที่แตะสิทธิ์ ข้อมูลส่วนบุคคล หรือการเชื่อมภายนอก

## การประสานงาน

- Agent เรียก agent อื่นเองไม่ได้ — session หลัก (ผู้ใช้ / Claude หลัก) เป็นผู้ส่งงานต่อ ทุก agent จึงต้องจบรายงานด้วยหัวข้อ **"ส่งต่อ"**: บทบาทที่ต้องทำต่อ + งานที่ต้องทำ + ไฟล์ที่เกี่ยวข้อง
- ไฟล์ของบทบาทอื่นแก้ได้เฉพาะส่วนที่ได้รับมอบ (เช่น qa-engineer เติมคอลัมน์ Test case ใน `requirements/traceability.md`) นอกนั้นเสนอผ่านหัวข้อ "ส่งต่อ"
- งานที่รันพร้อมกันหลาย agent: ก่อนเปิด `npm run dev` ให้ตรวจว่ามี dev server รันอยู่แล้วหรือไม่ (ใช้ตัวเดิม หรือระบุ `--port` อื่น) และเก็บ screenshot ใน scratchpad ของตัวเอง

## ข้อตกลงร่วม

- อ้างเลขข้อ TOR (ฉบับ v.4 11-9-69) และรหัส BR / TC / หน้าจอ ทุกครั้งที่ทำได้
- รหัสหน้าจอหลักใช้ตามรายการหน้าจอ (P-xx / B-xx) และวงเล็บรหัส Figma (D-xx) เมื่อจำเป็น เช่น B-05 (D09) — ดูตารางเทียบใน `md/system-overview.md`
- แยก **ข้อกำหนดจาก TOR** ออกจาก **ข้อเสนอ / ข้อสันนิษฐาน** ให้ชัด
- เอกสารเขียนภาษาไทย ศัพท์เทคนิคใช้ภาษาอังกฤษได้ · แผนภาพใช้ mermaid
- ADR ที่ Accepted แล้วแก้ไม่ได้ ถ้าเปลี่ยนใจให้เขียน ADR ใหม่ที่ Supersede ฉบับเดิม
- ไม่มี agent ใด commit / push / deploy เอง — ผู้ใช้เป็นผู้สั่ง
- รายงานทุกฉบับเป็นภาษาไทย
