<script setup>
// Dialog ดูข้อมูลผู้ประกอบการ (ปุ่ม "ดู" ในตาราง D08) — emit edit เพื่อเปิดฟอร์มแก้ไขต่อ
import { computed } from "vue";
import KeyValueList from "@/components/KeyValueList.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { operatorsText as t } from "@/content/operators.js";
import { common } from "@/content/common.js";
import { operatorAccess, operatorServices, operatorTypes } from "@/mocks/operators.js";
import { size } from "@/design/tokens.js";
import { formatDate } from "@/utils/format.js";
import { useDisplay } from "vuetify";

const props = defineProps({
  operator: { type: Object, default: null },
});
const emit = defineEmits(["edit"]);
const model = defineModel({ type: Boolean, default: false });
const { smAndUp } = useDisplay();

const c = t.columns;
const items = computed(() => {
  const o = props.operator;
  if (!o) return [];
  return [
    { label: t.dialogs.nameTh, value: o.nameTh },
    { label: t.dialogs.nameEn, value: o.nameEn },
    { label: c.taxId, value: `${o.taxId} / ${o.branch}` },
    { label: c.nswId, value: o.nswId },
    { label: c.type, value: operatorTypes[o.type].label },
    { label: c.service, value: operatorServices[o.service].label },
    { label: c.access, value: o.access, badge: true },
    { label: c.lastRequest, value: o.lastRequestAt ? formatDate(o.lastRequestAt) : "–" },
  ];
});
</script>

<template>
  <v-dialog v-model="model" :max-width="size['dialog-md']">
    <v-card v-if="operator" class="pf-elevation-modal">
      <div class="px-6 py-5 pf-bordered-bottom">
        <h2 class="pf-type-h4 text-text-primary">{{ t.dialogs.viewTitle }}</h2>
      </div>
      <div class="pa-6">
        <KeyValueList :items="items" :columns="smAndUp ? 2 : 1">
          <template #value="{ item }">
            <StatusBadge v-if="item.badge" :tone="operatorAccess[item.value].tone" dot>
              {{ operatorAccess[item.value].label }}
            </StatusBadge>
            <template v-else>{{ item.value }}</template>
          </template>
        </KeyValueList>
      </div>
      <div class="d-flex justify-end ga-3 px-6 py-4 pf-bordered-top">
        <v-btn variant="outlined" color="secondary" :height="size['control-md']" @click="model = false">
          {{ common.actions.close }}
        </v-btn>
        <v-btn color="primary" prepend-icon="fas fa-pen" :height="size['control-md']" @click="emit('edit', operator)">
          {{ common.actions.edit }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
