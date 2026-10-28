// tone → ชื่อสีใน Design Token สำหรับ component ที่มีหลายโทน

// IconTile: [พื้น, สีไอคอน]
export const iconTileTones = {
  teal: ["accent-teal-subtle", "icon-brand"],
  pink: ["accent-pink-subtle", "icon-accent"],
  blue: ["accent-blue-subtle", "status-info-fg"],
  green: ["accent-green-subtle", "status-success-fg"],
  amber: ["accent-amber-subtle", "status-warning-fg"],
  red: ["accent-red-subtle", "status-danger-fg"],
  neutral: ["bg-subtle", "icon-default"],
};

// StatusBadge / AlertBox: [พื้น, สีตัวอักษร]
export const badgeTones = {
  success: ["status-success-bg", "status-success-fg"],
  warning: ["status-warning-bg", "status-warning-fg"],
  danger: ["status-danger-bg", "status-danger-fg"],
  info: ["status-info-bg", "status-info-fg"],
  neutral: ["status-neutral-bg", "status-neutral-fg"],
  accent: ["accent-pink-subtle", "text-accent"],
};

// ไอคอนเริ่มต้นของ AlertBox ตาม tone
export const alertIcons = {
  success: "fas fa-circle-check",
  warning: "fas fa-triangle-exclamation",
  danger: "fas fa-circle-exclamation",
  info: "fas fa-circle-info",
  neutral: "fas fa-circle-info",
  accent: "fas fa-circle-info",
};
