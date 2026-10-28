// Design Token ของ DDC e-Pinkforms — แหล่งเดียว (single source) สำหรับทั้งระบบ
// ค่ามาจาก Figma › 01 · Foundations (ดู md/flamework.md)
// ห้ามใช้ค่าสี / ขนาด / ระยะ ตรง ๆ ในหน้าจอหรือ component ให้อ้างอิงจากไฟล์นี้เท่านั้น
//   - สี: ผ่าน Vuetify theme เช่น color="primary", class="bg-surface", rgb(var(--v-theme-text-secondary))
//   - ค่าอื่น: ผ่าน CSS variable --pf-* (สร้างโดย install-tokens.js) และ class .pf-type-*

// ---------- สี (Light mode) ----------
// key ตรงกับชื่อ variable ใน Figma โดยตัด "color/" และเปลี่ยน "/" เป็น "-"
export const colors = {
  light: {
    // Vuetify theme หลัก
    primary: "#0A6578", // action/primary/bg
    secondary: "#4F5D66", // action/secondary/bg
    accent: "#DB2B6E", // action/accent/bg (Pink)
    success: "#15803D",
    warning: "#F59E0B",
    error: "#DC2626",
    info: "#2563EB",
    background: "#F3F6F7", // bg/canvas
    surface: "#FFFFFF", // bg/surface

    // Background
    "bg-surface-muted": "#F8FAFB",
    "bg-subtle": "#E8EDEF",
    "bg-inverse": "#073B47",
    "bg-inverse-hover": "#08434F",
    "bg-inverse-active": "#0B5260",
    "bg-row-highlight": "#FDEEF4",

    // Text
    "text-primary": "#141C21",
    "text-secondary": "#4F5D66",
    "text-tertiary": "#62717A",
    "text-brand": "#0B5260",
    "text-link": "#0A6578",
    "text-accent": "#DB2B6E",
    "text-on-inverse": "#FFFFFF",
    "text-on-inverse-muted": "#CDE7EB",
    "text-on-inverse-accent": "#EF7AA5",

    // Border
    "border-default": "#DCE3E6",
    "border-strong": "#C3CDD2",
    "border-focus": "#127C8E",
    "border-accent": "#F6A9C6",
    "border-inverse": "#08434F",

    // Icon
    "icon-default": "#4F5D66",
    "icon-muted": "#94A3AB",
    "icon-brand": "#0A6578",
    "icon-accent": "#DB2B6E",

    // Status (fg ใช้กับตัวอักษร/ไอคอน, bg ใช้เป็นพื้น badge)
    "status-success-fg": "#15803D",
    "status-success-bg": "#E9F7EE",
    "status-warning-fg": "#B45309",
    "status-warning-bg": "#FEF6E7",
    "status-danger-fg": "#B91C1C",
    "status-danger-bg": "#FDECEC",
    "status-info-fg": "#1D4ED8",
    "status-info-bg": "#EBF2FE",
    "status-neutral-fg": "#4F5D66",
    "status-neutral-bg": "#E8EDEF",

    // Accent subtle (พื้นไอคอน tile / การ์ด)
    "accent-teal-subtle": "#E8F4F6",
    "accent-pink-subtle": "#FDEEF4",
    "accent-blue-subtle": "#EBF2FE",
    "accent-green-subtle": "#E9F7EE",
    "accent-amber-subtle": "#FEF6E7",
    "accent-red-subtle": "#FDECEC",

    // Chart
    "chart-series-1": "#0B5260",
    "chart-series-2": "#EF7AA5",
    "chart-series-3": "#DB2B6E",
    "chart-series-muted": "#C3CDD2",
    "chart-track": "#E8EDEF",
  },
};

// ---------- Typography ----------
export const font = {
  family: "'Noto Sans Thai', sans-serif",
  weight: { regular: 400, semibold: 600, bold: 700 },
  // [ขนาด, line-height, น้ำหนัก] ตาม Text Style ใน Figma
  scale: {
    display: [44, 60, "bold"],
    h1: [32, 46, "bold"],
    h2: [28, 40, "bold"],
    h3: [22, 32, "bold"],
    h4: [18, 28, "semibold"],
    "body-lg": [18, 28, "regular"],
    "body-lg-strong": [18, 28, "semibold"],
    "body-md": [16, 24, "regular"],
    "body-md-strong": [16, 24, "semibold"],
    "body-sm": [14, 22, "regular"],
    "body-sm-strong": [14, 22, "semibold"],
    "label-lg": [16, 24, "semibold"],
    "label-md": [14, 22, "semibold"],
    "label-sm": [12, 18, "semibold"],
    caption: [12, 18, "regular"],
    "caption-strong": [12, 18, "semibold"],
    kpi: [28, 40, "bold"],
  },
};

// ---------- Spacing (ฐาน 4) — ตรงกับ utility ของ Vuetify (pa-4 = 16px) ----------
export const space = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120];

// ---------- เส้นขอบ ----------
export const stroke = { default: 1 };

// ---------- Radius ----------
export const radius = { none: 0, xs: 4, sm: 6, md: 10, lg: 14, xl: 20, full: 999 };

// ---------- Elevation ----------
export const shadow = {
  card: "0 1px 2px #0D262E0D, 0 6px 16px -4px #0D262E0F",
  modal: "0 24px 48px -8px #051A1F38",
  brand: "0 6px 14px -2px #DB2B6E4D",
  focus: "0 0 0 3px #127D8F59",
};

// ---------- ขนาด / Layout ----------
export const size = {
  "control-sm": 32,
  "control-md": 40,
  "control-lg": 48,
  "icon-sm": 16,
  "icon-md": 20,
  "icon-lg": 24,
  "icon-tile-md": 44,
  "icon-tile-lg": 52,
  "avatar-md": 40,
  container: 1200,
  "dialog-md": 640,
  "portal-header": 80,
  sidebar: 264,
  topbar: 72,
};

// ---------- Motion ----------
export const motion = {
  "duration-fast": "150ms",
  "duration-base": "200ms",
  easing: "cubic-bezier(0.2, 0, 0, 1)",
};
