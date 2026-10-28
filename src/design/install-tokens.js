// แปลง Design Token (ยกเว้นสีซึ่ง Vuetify theme จัดการ) เป็น CSS variable --pf-* บน :root
// และสร้าง class .pf-type-<style> สำหรับ Type Scale เพื่อให้ทุก component ใช้ค่าเดียวกัน

import { font, motion, radius, shadow, size, space, stroke } from "./tokens.js";

const px = (n) => `${n}px`;

export function tokenCss() {
  const vars = [
    `--pf-font-family: ${font.family}`,
    ...Object.entries(font.weight).map(([k, v]) => `--pf-font-weight-${k}: ${v}`),
    ...space.map((n) => `--pf-space-${n}: ${px(n)}`),
    ...Object.entries(stroke).map(([k, v]) => `--pf-stroke-${k}: ${px(v)}`),
    ...Object.entries(radius).map(([k, v]) => `--pf-radius-${k}: ${px(v)}`),
    ...Object.entries(shadow).map(([k, v]) => `--pf-shadow-${k}: ${v}`),
    ...Object.entries(size).map(([k, v]) => `--pf-size-${k}: ${px(v)}`),
    ...Object.entries(motion).map(([k, v]) => `--pf-motion-${k}: ${v}`),
    ...Object.entries(font.scale).flatMap(([k, [s, lh, w]]) => [
      `--pf-type-${k}-size: ${px(s)}`,
      `--pf-type-${k}-line: ${px(lh)}`,
      `--pf-type-${k}-weight: var(--pf-font-weight-${w})`,
    ]),
  ];

  const typeClasses = Object.keys(font.scale).map(
    (k) =>
      `.pf-type-${k} { font-size: var(--pf-type-${k}-size); line-height: var(--pf-type-${k}-line); font-weight: var(--pf-type-${k}-weight); letter-spacing: 0; }`
  );

  return `:root {\n  ${vars.join(";\n  ")};\n}\n${typeClasses.join("\n")}\n`;
}

export function installTokens(doc = document) {
  const id = "pf-design-tokens";
  const el = doc.getElementById(id) ?? doc.head.appendChild(Object.assign(doc.createElement("style"), { id }));
  el.textContent = tokenCss();
}
