<script setup>
// Dialog ตรวจความถูกต้องของข้อมูล (B-25) — เทียบฟิลด์ DDC e-Pinkforms กับ Back Office เดิม ✓ / ✗
import { computed } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import AlertBox from "@/components/AlertBox.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { backofficeSyncText } from "@/content/backoffice-sync.js";
import { common } from "@/content/common.js";
import { checkFields, mismatches, syncDocTypes } from "@/mocks/backoffice-sync.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  item: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["resend"]);
const t = backofficeSyncText.checkDialog;

const notSent = computed(() => props.item?.status === "pending");
const rows = computed(() => {
  const it = props.item;
  if (!it) return [];
  // ค่าไม่ตรงกันจะมีเฉพาะรายการที่ส่งผิดพลาด — ส่งซ้ำสำเร็จแล้วถือว่าข้อมูลถูกปรับปรุง
  const diff = it.status === "error" ? (mismatches[it.docNo] ?? {}) : {};
  return checkFields[it.docType].map((f) => {
    // ค่าฝั่ง DDC = ข้อมูลของเอกสารนั้น (it.values สร้างจากรายละเอียดคำขอ / การชำระเงิน)
    const ddc = f.key === "docNo" || f.key === "reference" ? it[f.key] : (it.values?.[f.key] ?? "—");
    const bo = notSent.value ? "—" : (diff[f.key] ?? ddc);
    return { ...f, ddc, bo, match: !notSent.value && bo === ddc };
  });
});
const mismatchCount = computed(() => rows.value.filter((r) => !r.match).length);
const resend = () => {
  emit("resend", props.item);
};
</script>

<template>
  <AppDialog
    v-model="open"
    :title="t.title"
    :subtitle="item ? t.subtitle(syncDocTypes[item.docType].label, item.docNo) : ''"
    wide
  >
    <template v-if="item">
      <AlertBox v-if="notSent" tone="info" :title="t.notSent" class="mb-4">{{ t.notSentBody }}</AlertBox>
      <AlertBox v-else-if="mismatchCount" tone="danger" :title="t.someMismatch(mismatchCount)" class="mb-4">
        {{ t.someMismatchBody }}
      </AlertBox>
      <AlertBox v-else tone="success" :title="t.allMatch" class="mb-4">{{ t.allMatchBody(rows.length) }}</AlertBox>

      <v-card class="pf-bordered">
        <AppDataTable :headers="t.headers" :items="rows" item-value="key" :paginate="false" :hover="false" class="check-table">
          <template #item.label="{ item: r }">
            <span class="text-text-secondary">{{ r.label }}</span>
          </template>
          <template #item.ddc="{ item: r }">
            <span class="pf-type-body-sm-strong">{{ r.ddc }}</span>
          </template>
          <template #item.bo="{ item: r }">
            <span :class="r.match ? 'pf-type-body-sm-strong' : 'pf-type-body-sm-strong text-status-danger-fg'">{{ r.bo }}</span>
          </template>
          <template #item.match="{ item: r }">
            <StatusBadge v-if="notSent" tone="neutral">—</StatusBadge>
            <StatusBadge v-else :tone="r.match ? 'success' : 'danger'">
              <v-icon :icon="r.match ? 'fas fa-check' : 'fas fa-xmark'" size="x-small" class="me-1" />
              {{ r.match ? t.match : t.mismatch }}
            </StatusBadge>
          </template>
        </AppDataTable>
      </v-card>
    </template>
    <template #actions>
      <v-btn
        v-if="item && item.status !== 'success'"
        variant="outlined"
        color="primary"
        prepend-icon="fas fa-arrows-rotate"
        :height="size['control-md']"
        @click="resend"
      >
        {{ t.resendFix }}
      </v-btn>
      <v-btn color="primary" :height="size['control-md']" @click="open = false">{{ common.actions.close }}</v-btn>
    </template>
  </AppDialog>
</template>

<style scoped>
.check-table :deep(td) {
  white-space: nowrap;
}
</style>
