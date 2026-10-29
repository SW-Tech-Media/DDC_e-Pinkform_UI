# Components & กฎการสร้างหน้า

## กฎ

1. **ห้าม hardcode** สี / px / ฟอนต์ / เงา / radius ในหน้าหรือ component
   - สี → ชื่อสีใน `src/design/tokens.js` ผ่าน Vuetify: `color="primary"`, `class="bg-bg-subtle text-text-secondary"`, CSS `rgb(var(--v-theme-border-default))`
   - ระยะ / ขนาด / radius / เงา → `var(--pf-space-16)`, `var(--pf-size-control-md)`, `var(--pf-radius-lg)`, `var(--pf-shadow-card)`
   - ตัวอักษร → class `.pf-type-h2`, `.pf-type-body-sm`, `.pf-type-label-md`, `.pf-type-caption`, `.pf-type-kpi` … (ดู `font.scale` ใน tokens.js)
   - ⚠️ prop `color` ของ Vuetify **ตัดคำนำหน้า `bg-` / `text-` ออก** ชื่อสีที่ขึ้นต้นด้วย `bg-` หรือ `text-` (เช่น `bg-inverse`, `text-secondary`) จึงใส่ใน `color` ไม่ได้ ให้ใช้ class แทน (`class="bg-bg-inverse text-text-on-inverse"`) หรือเขียนคำนำหน้าซ้ำ (`color="bg-bg-inverse"`, `color="text-text-link"`) — ส่วนสีอื่น (`primary`, `accent-teal-subtle`, `border-strong`, `icon-muted` …) ใส่ใน `color` ได้ตามปกติ
   - class `rounded-*` ที่มี: `rounded-0`, `rounded-sm`, `rounded` (md), `rounded-lg`, `rounded-xl`, `rounded-pill`, `rounded-circle` — ถ้าต้องการ xs ใช้ `border-radius: var(--pf-radius-xs)`
   - ระยะห่างใช้ utility ของ Vuetify ได้ (`pa-6` = 24px = space-24, `ga-4` = 16px) เพราะฐาน 4 ตรงกับ token
   - ค่าที่ต้องเป็นตัวเลขใน JS (เช่น `:height` ของ v-btn) ใช้ `size[...]` จาก tokens.js
2. **ใช้ Component เสมอ** — ใช้ของในโฟลเดอร์นี้ก่อน ถ้าไม่มีให้สร้าง component ใหม่ แล้วค่อยใช้ในหน้า
3. **ข้อความอยู่ใน `src/content/`**, **ข้อมูลจำลองอยู่ใน `src/mocks/`** — template ไม่เขียนข้อความ/ข้อมูลตรง ๆ
4. วันที่ / เวลา / เงิน / ตัวเลข จัดรูปแบบด้วย `src/utils/format.js` (ปี พ.ศ. อัตโนมัติ)

## Layouts (`src/layouts/`)

| Layout          | ใช้กับ                         | Props / Slots                                                     |
| --------------- | ------------------------------ | ----------------------------------------------------------------- |
| `PortalLayout`  | หน้า Portal, หน้าแรก Prototype   | `portal` (แสดงเมนู Portal + Footer) · slot `actions`               |
| `AuthLayout`    | D04 – D06 เข้าสู่ระบบ             | slot default = ฟอร์มด้านขวา                                         |
| `AdminLayout`   | หน้า Back Office ทั้งหมด          | `breadcrumb: [{ title, to? }]` · Sidebar/Topbar มาจาก content/navigation.js |

## Components

| Component          | ใช้ทำอะไร (Figma)                         | Props สำคัญ                                                                                   |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| `AppBrand`         | โลโก้ (Brand/Logo)                        | `inverse`, `subtitle`, `size`: lg · sm                                                                        |
| `PageHeader`       | หัวหน้าจอ Back Office                      | `title`, `description` · slot `actions`                                                       |
| `PageHero`         | แถบหัวหน้าจอ Portal (Web/Page Hero)        | `title`, `description`, `breadcrumb`, `overlap` (เว้นที่ให้การ์ดซ้อน)                           |
| `SectionCard`      | การ์ดมีหัวข้อ (Card/Header)                | `title`, `subtitle`, `flush` (ไม่มี padding — ใช้กับตาราง) · slot `header`, `actions`, `footer`   |
| `KpiCard`          | การ์ดตัวเลข (Card/KPI)                     | `icon`, `tone`, `label`, `value`, `caption`, `trend: { direction, value, text }`              |
| `IconTile`         | กล่องไอคอนพื้นอ่อน                         | `icon`, `tone`: teal · pink · blue · green · amber · red · neutral, `size`: md · lg              |
| `StatusBadge`      | Badge สถานะ                              | `tone`: success · warning · danger · info · neutral · accent, `dot`                           |
| `SvgIcon`          | ไอคอนเส้นจาก Figma (Icon/*) สีตาม currentColor | `name` = ชื่อไฟล์ใน `src/assets/icons/` · กำหนดขนาดด้วย CSS width/height |
| `SidebarItem`      | เมนูด้านข้าง (Web/Sidebar Item)            | `to`, `icon` (ชื่อ SvgIcon), `label`, `badge`, `active` |
| `SecondaryButton`  | ปุ่มรอง พื้นขาว ขอบเทา ตัวอักษรเข้ม (Button/Secondary) | `icon`, `height` (ชื่อ size เช่น `control-lg`) · props อื่นส่งต่อให้ v-btn                 |
| `AlertBox`         | กล่องแจ้งเตือน / ข้อมูล                     | `tone`, `title`, `icon` · slot `aside` (ปุ่ม/ตัวเลขด้านขวา)                                   |
| `FilterCard`       | แผงตัวกรอง + ปุ่ม ค้นหา / ล้าง               | `showReset` · emit `search`, `reset` · ใส่ `<v-col>` + field ใน slot                           |
| `FieldLabel`       | ป้ายชื่อเหนือช่องกรอก (Form/Field)          | `label`, `required`, `for`                                                                   |
| `StatusTabs`       | แท็บพร้อมตัวนับ (Tab/Item)                  | `tabs: [{ value, label, count? }]` · `v-model`                                              |
| `AppDataTable`     | ตาราง + Pagination (Table, Pagination)    | `headers`, `items`, `itemValue`, `paginate`, `perPage`, `showPerPage`, `total` (จำนวนรวมในระบบ), `rowClass(item)` (`'pf-row-highlight'` = แถวชมพู) · slot `item.<key>`, `no-data` · emit `click:row` |
| `TablePagination`  | แถบเลื่อนหน้าแยก                           | `total` · `v-model:page`, `v-model:per-page`                                                |
| `BarChart`         | กราฟแท่ง (Chart/Bar Group)                 | `labels`, `series: [{ name, color: 'chart-series-1', data }]`, `ticks`, `max`, `axisLabel`, `hideLegend`     |
| `StepIndicator`    | ขั้นตอนแนวนอน (Stepper)                    | `steps: [{ label, caption? }]`, `current`, `complete`, `compact` (แบบบรรทัดเดียว ใช้หน้า Login)  |
| `KeyValueList`     | รายการ ชื่อ–ค่า (List/Key Value)            | `items: [{ label, value }]`, `columns` · slot `value`                                         |
| `EntryCard`        | การ์ดลิงก์ (Card/Quick Link)               | `icon`, `tone`, `title`, `description`, `cta`, `to`                                          |
| `EmptyState`       | สถานะว่าง (State/Empty & Error)            | `icon`, `tone`, `title`, `description` · slot `actions`                                       |
| `PatchNotesDialog` | Dialog Patch Notes                       | `v-model`                                                                                    |
| `PortalFooter`     | Footer ของ Portal (อยู่ใน PortalLayout แล้ว) | —                                                                                            |
| `AppDialog`        | Dialog มาตรฐาน (Modal/Dialog)             | `title`, `subtitle`, `wide` · `v-model` · slot default, `actions`                            |
| `ConfirmDialog`    | Dialog ยืนยัน                             | `title`, `message`, `confirmText`, `icon`, `tone`, `danger` · `v-model` · emit `confirm`      |
| `DateField`        | ช่องเลือกวันที่ / ช่วงวันที่ (ปี พ.ศ.)          | `range`, `placeholder`, `clearable`, `id`, `min` · `v-model` (ISO string หรือ [from, to])     |
| `SegmentedControl` | ปุ่มเลือกแบบแบ่งช่อง (Segmented/Item)        | `options: [{ value, label }]`, `label` · `v-model`                                          |
| `CodeViewer`       | แสดงโค้ด XML / JSON พื้นเข้ม (ebXML Header, Payload, CPA, API) | ดู props ในไฟล์ |
| `TableIconButton`  | ปุ่มไอคอนในตาราง (ดู / แก้ไข / ลบ)          | `icon`, `label` (aria), `tone` (ชื่อสีไอคอน), `disabled` · emit `click`                        |

> อ่านรายละเอียด props จริงในไฟล์ก่อนใช้ทุกครั้ง · ห้ามสร้างตัวซ้ำของ component ในตารางนี้

> คู่มือแบบดูได้จริง (สี ตัวอักษร ระยะ ไอคอน และตัวอย่าง Component ทุกตัว) อยู่ที่หน้า `/design-system` (`src/views/DesignSystemView.vue`) — เพิ่ม Component ใหม่ในตารางนี้แล้วให้เพิ่มตัวอย่างใน `src/content/design-system.js` ด้วย

Component เฉพาะกลุ่มหน้าจอ ให้สร้างในโฟลเดอร์ย่อย เช่น `components/portal/`, `components/auth/`, `components/requests/`

## ข้อมูลที่ใช้ร่วมกัน

- `src/mocks/requests.js` — คำขอ, สถานะคำขอ (`requestStatuses` → label + tone), ขั้นตอน 9 ขั้น, รายละเอียดคำขอทุกรายการ (`requestDetails` — PF6910260003 เขียนครบตาม Figma ส่วนรายการอื่นสร้างจาก `requests` — คำขอที่มี `outcome` ได้ประวัติสถานะ / Stepper / ผลการพิจารณาด้วย) · สถานะปัจจุบันของคำขออ่านจาก `useReviewStore().statusOf(ref)`
- `src/mocks/users.js` — เจ้าหน้าที่ตัวอย่าง, badge sidebar, ตัวนับผู้เข้าชม
- `src/utils/csv.js` — `downloadCsv(filename, headers, rows)` ส่งออก CSV (UTF-8 + BOM) ใช้ทุกหน้าที่มีปุ่มส่งออก
- `src/stores/session.js` — ผู้ใช้ที่แสดงบน Topbar (`signInAs('prapaporn')` ฯลฯ)
- `src/router/screens.js` — ชื่อ route ของทุกหน้าจอ
