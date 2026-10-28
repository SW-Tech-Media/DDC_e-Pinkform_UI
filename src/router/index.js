import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const APP_TITLE = "DDC e-Pinkforms Prototype";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView, meta: { title: APP_TITLE } },
    {
      path: "/prototype",
      name: "prototype",
      component: () => import("@/views/PlaceholderView.vue"),
      meta: { title: "Prototype ระบบ" },
    },
    {
      path: "/design-system",
      name: "design-system",
      component: () => import("@/views/PlaceholderView.vue"),
      meta: { title: "คู่มือ Design System" },
    },
    { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

router.afterEach((to) => {
  document.title = to.meta.title === APP_TITLE ? APP_TITLE : `${to.meta.title} · ${APP_TITLE}`;
});

export default router;
