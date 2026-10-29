import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
// --- ใช้บรรทัดข้างล่าง เพื่อเปิด vueDevTool --- //
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vue(),
    // Vue DevTools — ทำงานเฉพาะตอน npm run dev (ไม่ถูกรวมใน build)
    // เปิดด้วยปุ่มลอยด้านล่างของหน้า หรือกด Option(⌥) + Shift + D · เปิดแบบหน้าเต็มที่ /__devtools__/
    vueDevTools(),
    // ใช้ Sass settings ของเราเพื่อให้ Vuetify อ่าน radius / font จาก Design Token
    vuetify({
      autoImport: true,
      styles: { configFile: "src/assets/styles/settings.scss" },
    }),
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  css: {
    preprocessorOptions: {
      sass: { api: "modern-compiler" },
      scss: { api: "modern-compiler" },
    },
  },
  // ไม่ให้ Vite สแกนโฟลเดอร์ MCP server
  optimizeDeps: { entries: ["index.html", "src/**/*.{vue,js}"] },
  server: { watch: { ignored: ["**/mcp/**", "**/md/**"] } },
});
