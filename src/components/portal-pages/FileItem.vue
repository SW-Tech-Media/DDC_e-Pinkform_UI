<script setup>
// แถวไฟล์ / เอกสารดาวน์โหลด (ไฟล์แนบข่าว P-04 · เอกสารกฎหมาย P-05)
// meta: ข้อความรอง เช่น "ราชกิจจานุเบกษา · ประกาศเมื่อ 8 ก.ย. 2558 · 1.2 MB" (ส่งเป็น array แล้วคั่นด้วยจุด)
import { useDisplay } from "vuetify";
import IconTile from "@/components/IconTile.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";

defineProps({
  title: { type: String, required: true },
  meta: { type: Array, default: () => [] },
  icon: { type: String, default: "far fa-file-pdf" },
  tone: { type: String, default: "red" },
  action: { type: String, required: true },
  actionIcon: { type: String, default: "fas fa-download" },
});
defineEmits(["download"]);

const { xs } = useDisplay();
</script>

<template>
  <div class="d-flex align-center ga-4 flex-wrap flex-sm-nowrap">
    <IconTile :icon="icon" :tone="tone" />
    <div class="flex-grow-1 min-w-0 file__text">
      <p class="pf-type-body-md-strong text-text-primary">{{ title }}</p>
      <div v-if="meta.length" class="d-flex flex-wrap align-center ga-2 pf-type-caption text-text-tertiary mt-1">
        <template v-for="(m, i) in meta" :key="i">
          <span v-if="i" aria-hidden="true">·</span>
          <span>{{ m }}</span>
        </template>
      </div>
      <slot />
    </div>
    <SecondaryButton :icon="actionIcon" height="control-md" class="flex-shrink-0" :block="xs" @click="$emit('download')">
      {{ action }}
    </SecondaryButton>
  </div>
</template>

<style scoped>
.file__text {
  flex-basis: 0;
}
</style>
