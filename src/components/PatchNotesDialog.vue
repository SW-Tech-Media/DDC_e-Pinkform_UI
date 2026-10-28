<script setup>
// Dialog แสดง Patch Notes ทุกเวอร์ชัน (เวอร์ชันล่าสุดเปิดไว้ก่อน)
import { ref } from "vue";
import StatusBadge from "./StatusBadge.vue";
import { changeTypes, patchNotes, patchNotesText } from "@/content/patch-notes.js";
import { formatThaiDate } from "@/utils/format.js";

const open = defineModel({ type: Boolean, default: false });
const expanded = ref([patchNotes[0]?.version]);
</script>

<template>
  <v-dialog v-model="open" class="patch-notes" :aria-label="patchNotesText.title">
    <v-card class="pf-elevation-modal">
      <div class="d-flex align-start ga-4 pa-6">
        <div class="flex-grow-1">
          <h2 class="pf-type-h3 text-text-primary">{{ patchNotesText.title }}</h2>
          <p class="pf-type-body-sm text-text-secondary mt-1">{{ patchNotesText.subtitle }}</p>
        </div>
        <v-btn icon="fas fa-xmark" variant="text" size="small" :aria-label="patchNotesText.close" @click="open = false" />
      </div>
      <v-divider color="border-default" class="border-opacity-100" />

      <v-card-text class="pa-6">
        <v-expansion-panels v-model="expanded" multiple variant="accordion" flat>
          <v-expansion-panel
            v-for="(note, i) in patchNotes"
            :key="note.version"
            :value="note.version"
            class="pf-bordered"
          >
            <v-expansion-panel-title>
              <div class="d-flex flex-wrap align-center ga-3">
                <span class="pf-type-label-lg text-text-primary">v{{ note.version }}</span>
                <StatusBadge v-if="i === 0" tone="info">{{ patchNotesText.latest }}</StatusBadge>
                <span class="pf-type-body-sm text-text-secondary">{{ note.title }}</span>
                <span class="pf-type-caption text-text-tertiary">{{ formatThaiDate(note.date) }}</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <ul class="change-list d-flex flex-column ga-3">
                <li v-for="(c, j) in note.changes" :key="j" class="d-flex align-start ga-3">
                  <StatusBadge :tone="changeTypes[c.type].tone">{{ changeTypes[c.type].label }}</StatusBadge>
                  <span class="pf-type-body-md text-text-primary">{{ c.text }}</span>
                </li>
              </ul>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-divider color="border-default" class="border-opacity-100" />
      <div class="d-flex justify-end pa-4">
        <v-btn variant="outlined" color="secondary" @click="open = false">{{ patchNotesText.close }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.patch-notes :deep(.v-overlay__content) {
  width: min(var(--pf-size-dialog-md), calc(100% - 2 * var(--pf-space-16)));
}
.change-list {
  list-style: none;
}
</style>
