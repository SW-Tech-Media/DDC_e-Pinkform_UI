# 🛠️ Language & Frameworks

| ประเภท                 | เครื่องมือ                 | เวอร์ชัน |
| ---------------------- | -------------------------- | -------- |
| **Language**           | JavaScript (ESM) + Vue SFC | —        |
| **Frontend Framework** | Vue 3 (Composition API)    | ^3.4.31  |
| **UI Library**         | Vuetify 3                  | ^3.6.11  |
| **Build Tool**         | Vite                       | ^5.3.3   |
| **State Management**   | Pinia                      | ^2.1.7   |
| **Routing**            | Vue Router 4               | ^4.3.3   |
| **HTTP Client**        | Axios                      | ^1.7.2   |
| **Map**                | Leaflet                    | ^1.9.4   |
| **CSS Preprocessor**   | Sass                       | ^1.77.8  |

---

# 🔤 Font

อ้างอิง Figma: [DDC e-Pinkforms › 01 · Foundations](https://www.figma.com/design/O1QKAG1dNDQ7DROItvmJhU/DDC-e-Pinkforms) (variable `font-family/base`)

- **Noto Sans Thai** ใช้ฟอนต์เดียวทั้งภาษาไทย อังกฤษ และตัวเลข
- น้ำหนักที่ใช้: Regular 400 / SemiBold 600 / Bold 700
- โหลดผ่าน Google Fonts, Import ใน `src/assets/styles/main.css`

```css
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700&display=swap");

:root {
  --font-family: "Noto Sans Thai", sans-serif;
}

body,
.v-application {
  font-family: var(--font-family) !important;
}
```

> ใน `src/plugins/vuetify.js` / Sass variables ให้ตั้ง `$body-font-family` เป็นค่าเดียวกัน

## Type Scale (Text Style ใน Figma)

| Text Style                         | Size / Line height | Weight         |
| ---------------------------------- | ------------------ | -------------- |
| Display                            | 44 / 60            | Bold 700       |
| Heading/H1                         | 32 / 46            | Bold 700       |
| Heading/H2                         | 28 / 40            | Bold 700       |
| Heading/H3                         | 22 / 32            | Bold 700       |
| Heading/H4                         | 18 / 28            | SemiBold 600   |
| Body/Large (+ Strong)              | 18 / 28            | 400 (600)      |
| Body/Medium (+ Strong)             | 16 / 24            | 400 (600)      |
| Body/Small (+ Strong)              | 14 / 22            | 400 (600)      |
| Label/Large · Medium · Small       | 16 · 14 · 12       | SemiBold 600   |
| Caption/Regular · Strong           | 12 / 18            | 400 · 600      |
| Number/KPI                         | 28 / 40            | Bold 700       |

---

# 🎨 Icons

- **Font Awesome 7**
  - Solid (`fas`)
  - Regular (`far`)
  - Brands (`fab`)
- **MDI Font 7** (Fallback)
- รองรับการสร้าง Custom Icon Alias ผ่าน `vuetify.js`

> ใน Figma ใช้ไอคอนเส้น (Outline) ชื่อแบบ Lucide เช่น `shield-check`, `clipboard-check`, `route`, `receipt`, `key`, `server` (หน้า 02 · Components › Icons) ให้เลือกไอคอน Font Awesome แบบ Regular/Solid ที่ใกล้เคียง หรือเพิ่ม Lucide ถ้าต้องการให้ตรงกับดีไซน์

---

# 🌈 Color Tokens

อ้างอิงค่าจาก Figma (Light mode)

## Themes

- Light Theme
- Dark Theme — Figma ออกแบบไว้ครบทุกหน้าจอแล้ว (Semantic Colors › Mode Dark)

## Vuetify Theme (Light)

| Token        | ค่า       | Figma variable                         |
| ------------ | --------- | -------------------------------------- |
| `primary`    | `#0A6578` | `color/action/primary/bg`              |
| `secondary`  | `#4F5D66` | `color/action/secondary/bg`            |
| `accent`     | `#DB2B6E` | `color/action/accent/bg` (Pink)        |
| `success`    | `#15803D` | `color/action/success/bg`              |
| `warning`    | `#F59E0B` | `color/action/warning/bg`              |
| `error`      | `#DC2626` | `color/action/danger/bg`               |
| `info`       | `#2563EB` | `color/action/info/bg`                 |
| `background` | `#F3F6F7` | `color/bg/canvas`                      |
| `surface`    | `#FFFFFF` | `color/bg/surface`                     |

## Semantic Colors (Light)

| กลุ่ม        | Token → ค่า                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Background  | canvas `#F3F6F7` · surface `#FFFFFF` · surface-muted `#F8FAFB` · subtle `#E8EDEF` · inverse (Sidebar) `#073B47` · inverse-hover `#08434F` · inverse-active `#0B5260` · row-highlight `#FDEEF4` |
| Text        | primary `#141C21` · secondary `#4F5D66` · tertiary `#62717A` · brand `#0B5260` · link `#0A6578` · accent `#DB2B6E` · on-inverse `#FFFFFF` · on-inverse-muted `#CDE7EB` · on-inverse-accent `#EF7AA5` |
| Border      | default `#DCE3E6` · strong `#C3CDD2` · focus `#127C8E` · accent `#F6A9C6` · inverse `#08434F`                                                      |
| Icon        | default `#4F5D66` · muted `#94A3AB` · brand `#0A6578` · accent `#DB2B6E`                                                                          |
| Status (bg / fg) | success `#E9F7EE` / `#15803D` · warning `#FEF6E7` / `#B45309` · danger `#FDECEC` / `#B91C1C` · info `#EBF2FE` / `#1D4ED8` · neutral `#E8EDEF` / `#4F5D66` |
| Action      | dark `#073B47` · light `#FFFFFF` (outline `#DCE3E6`) · link `#0A6578`                                                                            |
| Accent subtle | teal `#E8F4F6` · pink `#FDEEF4` · blue `#EBF2FE` · green `#E9F7EE` · amber `#FEF6E7` · red `#FDECEC`                                           |
| Chart       | series-1 `#0B5260` · series-2 `#EF7AA5` · series-3 `#DB2B6E` · muted `#C3CDD2` · track `#E8EDEF`                                                 |

> ทุกคู่สีตัวอักษร/พื้นผ่าน WCAG 2.1 AA (≥ 4.5:1) ตามตาราง Contrast ใน Figma
> แนะนำให้กำหนด Theme ทั้งหมดไว้ใน `src/plugins/vuetify.js` และ Semantic Colors เป็น CSS variables

## Spacing · Radius · Elevation

- **Spacing** (ฐาน 4): 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120
- **Radius**: none 0 · xs 4 · sm 6 · md 10 · lg 14 · xl 20 · full 999
- **Elevation**
  - Card: `0 1px 2px #0D262E0D, 0 6px 16px -4px #0D262E0F`
  - Modal: `0 24px 48px -8px #051A1F38`
  - Brand (ปุ่ม/โลโก้ Pink): `0 6px 14px -2px #DB2B6E4D`
  - Focus ring: `0 0 0 3px #127D8F59`

## Layout & Breakpoints

| รายการ        | ค่า                                                                                     |
| ------------- | --------------------------------------------------------------------------------------- |
| Desktop       | ออกแบบ 1440, ทดสอบ 1280, min-height 900                                                 |
| Portal        | Grid 12 คอลัมน์, container 1200, gutter 24, header 80                                     |
| Back Office   | Sidebar 264 (เต็มความสูง) + Content, Topbar 72, body padding 32, min-height 1080, ช่องค้นหาใน Topbar 360 |
| Mobile        | ออกแบบ 390 (ทดสอบ 360 / 430), Grid 4 คอลัมน์, margin 20, gutter 16                        |
| Control size  | sm 32 · md 40 · lg 48                                                                   |
| Icon size     | sm 16 · md 20 · lg 24 (icon tile 44 / 52)                                                |
| ตาราง         | คอลัมน์หลักขยายเต็มพื้นที่ที่เหลือ อื่น ๆ กว้างคงที่, ข้อความยาวตัดด้วย …, ตัวเลขชิดขวา               |

---

# ⚙️ Vuetify Defaults

กำหนดค่ามาตรฐานของ Component ทั้งระบบ

```js
VBtn
- rounded: "lg"

VCard
- rounded: "xl"
- elevation: 0

VTextField
VSelect
VTextarea
VAutocomplete
VCombobox
VFileInput

- variant: "outlined"
- density: "default"
- rounded: "lg"
```

---

# 🌐 Locale

- รองรับภาษา
  - 🇹🇭 ไทย
  - 🇺🇸 English
- ใช้ Vuetify Locale
- รองรับการเพิ่ม Date Adapter (เช่น Buddhist Calendar)

---

# 📂 Structure หลัก

```text
src/
│
├── assets/
│   └── styles/
│       └── main.css
│
├── components/
├── layouts/
├── plugins/
│   ├── vuetify.js
│   └── fontawesome.js
│
├── router/
├── stores/
├── services/
│   └── api/
├── views/
│
├── App.vue
└── main.js
```

---

# 📚 Libraries

## Core

- Vue 3
- Vuetify 3
- Vue Router 4
- Pinia

## API

- Axios

## Map

- Leaflet

## Styling

- Sass

## Icons

- Font Awesome 7
- MDI Font

---

# 🚀 Build Tools

| เครื่องมือ               | รายละเอียด                      |
| ------------------------ | ------------------------------- |
| Vite                     | Development Server & Build Tool |
| @vitejs/plugin-vue       | รองรับ Vue SFC                  |
| vite-plugin-vuetify      | Auto Import Components          |
| vite-plugin-vue-devtools | Vue Devtools                    |

---

# 📜 Scripts

| Command           | รายละเอียด                      |
| ----------------- | ------------------------------- |
| `npm run dev`     | เริ่ม Development Server        |
| `npm run build`   | Build Production                |
| `npm run preview` | Preview Build                   |
| `npm run lint`    | ตรวจสอบและแก้ไข Code ตาม ESLint |

---

# 📦 Project Information

| รายการ           | ค่า         |
| ---------------- | ----------- |
| **Project Name** | gap-cert-ui |
| **Version**      | 1.0.13      |
| **Module Type**  | ES Module   |
| **Private**      | true        |

---

# 📌 Dependency Overview

## Dependencies

| Package                             | Version |
| ----------------------------------- | ------- |
| vue                                 | ^3.4.31 |
| vuetify                             | ^3.6.11 |
| vue-router                          | ^4.3.3  |
| pinia                               | ^2.1.7  |
| axios                               | ^1.7.2  |
| leaflet                             | ^1.9.4  |
| @fortawesome/fontawesome-svg-core   | ^7.2.0  |
| @fortawesome/free-solid-svg-icons   | ^7.2.0  |
| @fortawesome/free-regular-svg-icons | ^7.2.0  |
| @fortawesome/free-brands-svg-icons  | ^7.2.0  |
| @fortawesome/vue-fontawesome        | ^3.1.3  |
| @mdi/font                           | ^7.4.47 |

## Dev Dependencies

| Package                  | Version |
| ------------------------ | ------- |
| vite                     | ^5.3.3  |
| @vitejs/plugin-vue       | ^5.0.5  |
| vite-plugin-vuetify      | ^2.0.3  |
| vite-plugin-vue-devtools | ^7.5.4  |
| sass                     | ^1.77.8 |

---

> เอกสารนี้ใช้เป็น **Project Starter Template** สำหรับโปรเจกต์ Vue 3 + Vuetify โดยสามารถเปลี่ยนเฉพาะชื่อโปรเจกต์ เวอร์ชัน และ Theme Tokens เพื่อใช้กับระบบใหม่ได้ทันที
