<script setup>
// เมนูด้านข้าง (Figma: Web/Sidebar Item) — สูง 44, ระยะใน 12, มุม md
// State: Default / Hover (พื้นสว่างขึ้น) / Active (พื้นสว่างขึ้น + แถบชมพูชิดขอบ Sidebar + ตัวหนา)
import SvgIcon from "./SvgIcon.vue";

defineProps({
  to: { type: [String, Object], required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
  badge: { type: [String, Number], default: null },
  active: { type: Boolean, default: false },
});
</script>

<template>
  <router-link
    :to="to"
    class="sidebar-item d-flex align-center ga-3 px-3 rounded text-decoration-none"
    :class="{ 'sidebar-item--active': active }"
    :aria-current="active ? 'page' : undefined"
  >
    <SvgIcon :name="icon" class="sidebar-item__icon" />
    <span class="sidebar-item__label flex-grow-1 min-w-0">{{ label }}</span>
    <span
      v-if="badge !== null && badge !== undefined"
      class="sidebar-item__badge d-flex align-center px-2 rounded-pill bg-accent pf-type-caption-strong"
    >
      {{ badge }}
    </span>
  </router-link>
</template>

<style scoped>
.sidebar-item {
  position: relative;
  height: var(--pf-size-sidebar-item);
  color: rgb(var(--v-theme-text-on-inverse-muted));
  font-size: var(--pf-type-body-sm-size);
  line-height: var(--pf-type-body-sm-line);
  font-weight: var(--pf-type-body-sm-weight);
  transition: background-color var(--pf-motion-duration-fast) var(--pf-motion-easing);
}
.sidebar-item:hover {
  background: rgb(var(--v-theme-bg-inverse-hover));
}
.sidebar-item--active,
.sidebar-item--active:hover {
  background: rgb(var(--v-theme-bg-inverse-active));
  color: rgb(var(--v-theme-text-on-inverse));
  font-weight: var(--pf-font-weight-semibold);
}
/* แถบชมพูชิดขอบซ้ายของ Sidebar (นอกตัวเมนู ตามระยะ padding ของรายการเมนู) */
.sidebar-item--active::before {
  content: "";
  position: absolute;
  left: calc(-1 * var(--pf-space-16));
  top: 50%;
  transform: translateY(-50%);
  width: var(--pf-space-4);
  height: var(--pf-space-24);
  border-radius: calc(var(--pf-radius-xs) / 2);
  background: rgb(var(--v-theme-accent));
}
.sidebar-item__icon {
  width: var(--pf-size-icon-md);
  height: var(--pf-size-icon-md);
}
.sidebar-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sidebar-item__badge {
  height: var(--pf-size-icon-md);
  color: rgb(var(--v-theme-text-on-inverse));
}
</style>
