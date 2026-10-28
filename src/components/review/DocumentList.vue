<script setup>
// แท็บ "เอกสารประกอบ" ของ D10 — รายการไฟล์แนบ ดู / ดาวน์โหลด (จำลอง)
import { ref } from "vue";
import IconTile from "@/components/IconTile.vue";
import EmptyState from "@/components/EmptyState.vue";
import { reviewText } from "@/content/review.js";
import { common } from "@/content/common.js";
import { formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

defineProps({
  documents: { type: Array, required: true },
});
const emit = defineEmits(["download"]);
const t = reviewText.documents;
const viewing = ref(null);
</script>

<template>
  <div>
    <p class="pf-type-body-sm text-text-secondary mb-4">{{ t.subtitle }}</p>
    <div class="d-flex flex-column ga-3">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="pf-bordered rounded-lg pa-4 d-flex flex-wrap align-center ga-4"
      >
        <IconTile :icon="doc.icon" tone="teal" />
        <div class="flex-grow-1 min-w-0">
          <div class="pf-type-body-sm-strong text-text-primary text-break">{{ doc.name }}</div>
          <div class="pf-type-caption text-text-tertiary">
            {{ doc.type }} · {{ doc.size }} · {{ t.uploadedAt(formatDateTime(doc.at)) }}
          </div>
        </div>
        <div class="d-flex ga-2">
          <v-btn variant="outlined" color="primary" size="small" prepend-icon="far fa-eye" @click="viewing = doc">
            {{ t.view }}
          </v-btn>
          <v-btn
            variant="text"
            color="primary"
            size="small"
            icon="fas fa-download"
            :aria-label="t.download"
            @click="emit('download', doc.name)"
          />
        </div>
      </div>
    </div>

    <v-dialog :model-value="!!viewing" :max-width="size['dialog-md']" @update:model-value="viewing = null">
      <v-card v-if="viewing" class="pf-elevation-modal">
        <div class="d-flex align-center ga-3 px-6 py-4 pf-bordered-bottom">
          <h2 class="pf-type-h4 text-text-primary flex-grow-1 text-break">{{ viewing.name }}</h2>
          <v-btn icon="fas fa-xmark" variant="text" size="small" :aria-label="common.actions.close" @click="viewing = null" />
        </div>
        <EmptyState :icon="viewing.icon" :title="viewing.type" :description="t.previewNote" />
        <div class="d-flex justify-end ga-3 px-6 py-4 pf-bordered-top">
          <v-btn variant="outlined" color="secondary" @click="viewing = null">{{ common.actions.close }}</v-btn>
          <v-btn color="primary" prepend-icon="fas fa-download" @click="emit('download', viewing.name)">{{ t.download }}</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
