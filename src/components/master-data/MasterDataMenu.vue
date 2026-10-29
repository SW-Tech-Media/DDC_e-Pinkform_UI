<script setup>
// เมนูเลือกชุดข้อมูลหลัก (B-15) — จอใหญ่เป็นรายการด้านซ้าย / จอเล็กเป็น dropdown
// datasets: [{ key, no, label, icon, kind?, to? }] · counts: { key: number } · v-model = key ที่เลือก
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import FieldLabel from "@/components/FieldLabel.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { masterText as t } from "@/content/master-data.js";
import { formatNumber } from "@/utils/format.js";

const props = defineProps({
  datasets: { type: Array, required: true },
  counts: { type: Object, default: () => ({}) },
});
const model = defineModel({ type: String, required: true });
const router = useRouter();
const { lgAndUp } = useDisplay();

const pickItems = props.datasets.map((d) => ({ value: d.key, title: `${t.torNo(d.no)} ${d.label}` }));
const pick = (key) => {
  const d = props.datasets.find((x) => x.key === key);
  if (d.kind === "link") router.push(d.to);
  else model.value = key;
};
</script>

<template>
  <v-card v-if="lgAndUp" class="pf-bordered">
    <div class="px-5 py-4 pf-bordered-bottom">
      <h2 class="pf-type-h4 text-text-primary">{{ t.menuTitle }}</h2>
      <p class="pf-type-caption text-text-tertiary">{{ t.menuCaption(datasets.length) }}</p>
    </div>
    <v-list density="compact" nav class="pa-2" :aria-label="t.menuTitle">
      <v-list-item
        v-for="d in datasets"
        :key="d.key"
        :active="model === d.key"
        :to="d.kind === 'link' ? d.to : undefined"
        color="primary"
        rounded="lg"
        class="master-menu__item"
        @click="d.kind === 'link' ? undefined : (model = d.key)"
      >
        <template #prepend>
          <span class="pf-type-caption text-text-tertiary master-menu__no">{{ d.no }}</span>
          <v-icon :icon="d.icon" size="small" :color="model === d.key ? 'primary' : 'icon-default'" class="me-3" />
        </template>
        <v-list-item-title class="pf-type-body-sm" :class="model === d.key ? 'pf-type-body-sm-strong' : ''">
          {{ d.label }}
        </v-list-item-title>
        <template #append>
          <v-icon v-if="d.kind === 'link'" icon="fas fa-arrow-up-right-from-square" size="x-small" color="icon-muted" />
          <span v-else-if="counts[d.key] !== undefined" class="pf-type-caption text-text-tertiary">
            {{ formatNumber(counts[d.key]) }}
          </span>
        </template>
      </v-list-item>
    </v-list>
  </v-card>

  <v-card v-else class="pf-bordered pa-5">
    <FieldLabel :label="t.pickLabel" for="md-pick" />
    <v-select id="md-pick" :model-value="model" :items="pickItems" hide-details @update:model-value="pick">
      <template #item="{ props: itemProps, item }">
        <v-list-item v-bind="itemProps">
          <template v-if="datasets.find((d) => d.key === item.value)?.kind === 'link'" #append>
            <StatusBadge tone="info">{{ t.externalBadge }}</StatusBadge>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </v-card>
</template>

<style scoped>
.master-menu__no {
  display: inline-block;
  min-width: var(--pf-space-24);
}
.master-menu__item :deep(.v-list-item__prepend > .v-icon ~ .v-list-item__spacer) {
  width: 0;
}
</style>
