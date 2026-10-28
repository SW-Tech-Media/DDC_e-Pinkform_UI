import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    vue(),
    // ใช้ Sass settings ของเราเพื่อให้ Vuetify อ่าน radius / font จาก Design Token
    vuetify({ autoImport: true, styles: { configFile: "src/assets/styles/settings.scss" } }),
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
