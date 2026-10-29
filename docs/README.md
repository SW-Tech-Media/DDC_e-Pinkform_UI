# เอกสารพัฒนาระบบ DDC e-Pinkforms

โฟลเดอร์นี้เก็บผลงานของแต่ละบทบาท (agent ใน `.claude/agents/`) เพื่อให้ Prototype ต่อยอดเป็นระบบจริงได้ทั้ง frontend และ backend
เอกสารต้นทาง (TOR, Flow, รายการหน้าจอ) ยังอยู่ที่ `md/` และโฟลเดอร์ `../1_Flow` – `../4_เอกสารอธิบาย` — ที่นี่เก็บเฉพาะสิ่งที่ทีม **ตัดสินใจและออกแบบต่อจากนั้น**

| โฟลเดอร์ | เจ้าของ | เนื้อหา |
| --- | --- | --- |
| `adr/` | solution-architect | Architecture Decision Record (`NNNN-<หัวข้อ>.md`) — รวมถึงการเลือก backend stack |
| `architecture/` | solution-architect | ภาพรวม (C4), module / bounded context, non-functional ตาม TOR |
| `requirements/` | business-analyst | User story + acceptance criteria ต่อ module, กฎทางธุรกิจ (BR-xxx), traceability, glossary |
| `design/` | ux-ui-designer | Spec หน้าจอและการเปลี่ยนแปลง UI (อ้างรหัสหน้าจอ P-xx / B-xx) |
| `api/` | backend-developer | `openapi.yaml` — contract ภายในระหว่าง frontend กับ backend |
| `data/` | backend-developer | Data model, state machine ของคำขอ / การชำระ / ใบรับรอง |
| `integration/` | integration-engineer | ข้อความ ebXML / XSD / sequence / error handling / PKI และ `external-api.yaml` (API ทางเลือกให้ NSP / ระบบภายนอก) |
| `test/` | qa-engineer | Test plan, test case (TC-xxx), รายงานผลทดสอบ |
| `ops/` | devops-engineer | Environment, CI/CD, Backup/DR, Monitoring |

Security reviewer ไม่มีโฟลเดอร์ของตัวเอง — รายงานผลรีวิวในบทสนทนา และประเด็นที่ต้องแก้ส่งต่อเจ้าของงาน

## แหล่งความจริง (ถ้าข้อมูลขัดกัน ให้ยึดตามนี้ และแจ้งเจ้าของอีกฝั่งให้แก้ตาม)

| เรื่อง | ยึดตาม | ฝั่งที่ต้องตาม |
| --- | --- | --- |
| ข้อกำหนด | TOR v.4 (11-9-69) → `md/system-overview.md` | ทุกบทบาท |
| กฎทางธุรกิจ (BR-xxx) | `requirements/business-rules.md` | data/state-machines, หน้าจอ, test case |
| สถานะและการเปลี่ยนสถานะ | `data/state-machines.md` (เมื่อมีแล้ว) — ก่อนหน้านั้นคือ `requestStatuses` ใน `src/mocks/requests.js` | mock / store ฝั่ง frontend, integration sequences |
| รูปข้อมูล API ภายใน | `api/openapi.yaml` (เมื่อมีแล้ว) — ก่อนหน้านั้นคือ `src/mocks/` | `src/api/` ฝั่ง frontend |
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
