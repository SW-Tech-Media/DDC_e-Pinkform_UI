import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { screens } from "./screens.js";

const APP_TITLE = "DDC e-Pinkforms Prototype";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView, meta: { title: APP_TITLE } },
    {
      path: "/prototype",
      name: "prototype",
      component: () => import("@/views/PrototypeView.vue"),
      meta: { title: "Prototype ระบบ" },
    },
    {
      path: "/design-system",
      name: "design-system",
      component: () => import("@/views/PlaceholderView.vue"),
      meta: { title: "คู่มือ Design System" },
    },
    ...screens.map((x) => ({ path: x.path, name: x.name, component: x.component, meta: { title: x.title, screen: x } })),
    { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
  ],
  scrollBehavior: (to) => (to.hash ? { el: to.hash, behavior: "smooth" } : { top: 0 }),
});

router.afterEach((to) => {
  document.title = to.meta.title === APP_TITLE ? APP_TITLE : `${to.meta.title} · ${APP_TITLE}`;
});

export default router;
