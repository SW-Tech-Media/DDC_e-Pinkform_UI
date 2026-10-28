<script setup>
// D11 Preview ใบรับรองฯ และยืนยันผลการพิจารณา (Modal)
// ยืนยันอนุมัติได้เมื่อ Checklist ครบเท่านั้น (แก้ข้อมูลขัดกันใน Figma — ถ้ายังไม่ครบ ปุ่ม disabled พร้อมเหตุผล)
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import AlertBox from "@/components/AlertBox.vue";
import IconTile from "@/components/IconTile.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import CertificatePreview from "./CertificatePreview.vue";
import KeyValueRows from "./KeyValueRows.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { reviewText } from "@/content/review.js";
import { formatMoney } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  detail: { type: Object, required: true },
  checked: { type: Number, required: true },
  total: { type: Number, required: true },
  decided: { type: Boolean, default: false }, // บันทึกผลแล้ว → ดู Preview อย่างเดียว
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["confirm"]);
const t = reviewText.preview;
const { smAndDown } = useDisplay();

const variants = Object.keys(t.tabs);
const variant = ref("cert");
const complete = computed(() => props.checked === props.total);

const summary = computed(() => [
  { label: t.summary.exporter, value: props.detail.exporter.nameTh },
  { label: t.summary.country, value: props.detail.consignee.country.replace(/\s*\(.*\)$/, "") },
  { label: t.summary.items, value: t.itemsValue(props.detail.items.length) },
  {
    label: t.summary.checklist,
    value: complete.value ? t.checklistDone(props.checked, props.total) : t.checklistPartial(props.checked, props.total),
    warn: !complete.value,
  },
  { label: t.summary.fee, value: t.fee(formatMoney(props.detail.fee)) },
]);

const confirm = () => {
  emit("confirm");
  open.value = false;
};
</script>

<template>
  <v-dialog v-model="open" :max-width="size.container" :fullscreen="smAndDown" scrollable>
    <v-card class="pf-elevation-modal" :rounded="smAndDown ? 0 : 'xl'">
      <div class="d-flex align-center flex-wrap ga-3 px-6 py-5 pf-bordered-bottom">
        <h2 class="pf-type-h4 text-text-primary">{{ t.title }}</h2>
        <StatusBadge tone="neutral">{{ detail.ref }}</StatusBadge>
        <v-spacer />
        <v-btn icon="fas fa-xmark" variant="text" size="small" :aria-label="t.close" @click="open = false" />
      </div>

      <v-card-text class="pa-0">
        <div class="d-flex flex-column flex-md-row">
          <!-- ซ้าย: Preview เอกสาร -->
          <section class="flex-grow-1 min-w-0 pa-6">
            <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
              <v-btn-toggle
                v-model="variant"
                mandatory
                variant="text"
                class="seg pf-bordered rounded-lg pa-1"
                selected-class="seg--active"
                density="comfortable"
              >
                <v-btn v-for="v in variants" :key="v" :value="v" class="pf-type-label-md px-4" rounded="md">
                  {{ t.tabs[v] }}
                </v-btn>
              </v-btn-toggle>
              <span class="pf-type-body-sm text-text-tertiary">
                {{ t.page(variants.indexOf(variant) + 1, variants.length) }}
              </span>
            </div>
            <CertificatePreview :detail="detail" :variant="variant" />
          </section>

          <!-- ขวา: สรุป + ยืนยัน -->
          <aside class="d-flex flex-column pa-6" :class="smAndDown ? 'pf-bordered-top' : 'confirm'">
            <IconTile icon="fas fa-file-circle-check" tone="green" size="lg" />
            <h3 class="pf-type-h3 text-text-primary mt-4">{{ decided ? t.viewTitle : t.confirmTitle }}</h3>
            <p class="pf-type-body-sm text-text-secondary mt-2 mb-4">{{ t.confirmDescription }}</p>

            <div class="bg-bg-surface-muted rounded-lg pa-4 mb-4">
              <KeyValueRows :items="summary" dense>
                <template #value="{ item }">
                  <span :class="item.warn ? 'text-status-warning-fg' : ''">{{ item.value }}</span>
                </template>
              </KeyValueRows>
            </div>

            <div class="d-flex flex-column ga-3">
              <AlertBox v-if="!complete && !decided" tone="danger" :title="t.blockedTitle">
                {{ t.blocked(checked, total) }}
              </AlertBox>
              <AlertBox tone="warning" icon="far fa-clock">{{ t.undoNote }}</AlertBox>
              <AlertBox tone="info" icon="far fa-paper-plane">{{ t.billNote }}</AlertBox>
            </div>

            <v-spacer class="mt-6" />
            <div class="d-flex ga-3">
              <SecondaryButton
                class="flex-1-1"
                @click="open = false"
              >
                {{ decided ? t.close : t.cancel }}
              </SecondaryButton>
              <v-btn
                v-if="!decided"
                color="success"
                class="flex-1-1"
                prepend-icon="fas fa-check"
                :height="size['control-lg']"
                :disabled="!complete"
                @click="confirm"
              >
                {{ t.confirm }}
              </v-btn>
            </div>
          </aside>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.confirm {
  flex: 0 0 calc(var(--pf-size-desktop-search) + var(--pf-space-40));
  border-left: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
.seg :deep(.v-btn:not(.seg--active)) {
  color: rgb(var(--v-theme-text-secondary));
}
.seg--active {
  background: rgb(var(--v-theme-bg-inverse));
  color: rgb(var(--v-theme-text-on-inverse)) !important;
}
.seg {
  height: auto !important;
  max-width: 100%;
  overflow-x: auto;
}
</style>
