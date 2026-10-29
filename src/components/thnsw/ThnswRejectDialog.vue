<script setup>
// ไม่อนุมัติ THNSW — บังคับกรอกเหตุผล (เลือกเหตุผลที่ใช้บ่อยเพื่อเติมข้อความได้) → emit confirm(reason)
import { ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { thnswText as t } from "@/content/thnsw.js";
import { common } from "@/content/common.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  request: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["confirm"]);

const reason = ref("");
const touched = ref(false);
watch(open, (v) => {
  if (v) {
    reason.value = "";
    touched.value = false;
  }
});
const pick = (text) => {
  reason.value = text;
  touched.value = true;
};
const submit = () => {
  touched.value = true;
  if (!reason.value.trim()) return;
  emit("confirm", reason.value.trim());
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="t.reject.title" :subtitle="props.request?.nameTh ?? ''">
    <div class="d-flex flex-column ga-4">
      <div>
        <div class="pf-type-label-sm text-text-secondary mb-2">{{ t.reject.presetsLabel }}</div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="p in t.reject.presets"
            :key="p"
            size="small"
            variant="outlined"
            :color="reason === p ? 'error' : 'border-strong'"
            class="pf-type-caption"
            :class="reason === p ? '' : 'text-text-secondary'"
            @click="pick(p)"
          >
            {{ p }}
          </v-chip>
        </div>
      </div>
      <div>
        <FieldLabel :label="t.reject.reasonLabel" for="thnsw-reason" required />
        <v-textarea
          id="thnsw-reason"
          v-model="reason"
          :placeholder="t.reject.reasonPlaceholder"
          rows="3"
          auto-grow
          :error-messages="touched && !reason.trim() ? [t.reject.required] : []"
          hide-details="auto"
          @blur="touched = true"
        />
      </div>
    </div>
    <template #actions>
      <SecondaryButton height="control-md" @click="open = false">{{ common.actions.cancel }}</SecondaryButton>
      <v-btn color="error" prepend-icon="fas fa-xmark" :height="size['control-md']" :disabled="!reason.trim()" @click="submit">
        {{ t.reject.confirm }}
      </v-btn>
    </template>
  </AppDialog>
</template>
