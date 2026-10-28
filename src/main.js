import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import fontawesome from "./plugins/fontawesome";
import { installTokens } from "./design/install-tokens";
import "./assets/styles/main.css";

// ต้องติดตั้ง CSS variable ของ Design Token ก่อน mount เพื่อให้ทุก component ใช้ได้ทันที
installTokens();

createApp(App).use(createPinia()).use(router).use(vuetify).use(fontawesome).mount("#app");
