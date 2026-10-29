import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { screens } from "./screens.js";
import { adminNav } from "@/content/navigation.js";
import { useSessionStore } from "@/stores/session.js";

const APP_TITLE = "DDC e-Pinkforms Prototype";

// route ของเมนู Sidebar → key ในตารางสิทธิ์ (meta.permission)
const navPermission = Object.fromEntries(adminNav.flatMap((section) => section.items.map((item) => [item.to.name, item.key])));

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
      component: () => import("@/views/DesignSystemView.vue"),
      meta: { title: "คู่มือ Design System" },
    },
    ...screens.map((x) => ({
      path: x.path,
      name: x.name,
      component: x.component,
      meta: { title: x.title, screen: x, permission: x.permission ?? navPermission[x.name] },
    })),
    { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
  ],
  scrollBehavior: (to) => (to.hash ? { el: to.hash, behavior: "smooth" } : { top: 0 }),
});

// ตรวจสิทธิ์ดูเมนูก่อนเข้า route (TOR 4.4.7 · Flow 4 "ไม่มีสิทธิ์ แจ้งติดต่อผู้ดูแลระบบ")
// หน้าจอซ่อนเมนูตามสิทธิ์ แต่ backend ต้องตรวจสิทธิ์ทุกคำขอ API อีกครั้ง
// ?as=<username> = สลับบทบาทสาธิตผ่านลิงก์ (เฉพาะ Prototype / โหมด mock)
router.beforeEach((to) => {
  const session = useSessionStore();
  if (import.meta.env.VITE_API_MODE !== "http" && typeof to.query.as === "string") {
    session.useAccount(to.query.as);
    const { as: _as, ...query } = to.query;
    return { path: to.path, query, hash: to.hash, replace: true };
  }
  const menu = to.meta.permission;
  if (menu && !session.can(menu)) return { name: "admin-forbidden", query: { menu } };
});

router.afterEach((to) => {
  document.title = to.meta.title === APP_TITLE ? APP_TITLE : `${to.meta.title} · ${APP_TITLE}`;
});

export default router;
