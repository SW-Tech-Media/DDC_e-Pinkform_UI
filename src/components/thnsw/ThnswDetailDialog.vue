<script setup>
// Dialog รายละเอียดคำขอขึ้นทะเบียนจาก NSW (B-04): ข้อมูลบริษัท / NSP ที่เลือก / ผลตรวจลายมือชื่อดิจิทัล + XML Schema
// emit approve, reject (เฉพาะรายการรอพิจารณา)
import { computed } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import IconTile from "@/components/IconTile.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { thnswText as t } from "@/content/thnsw.js";
import { common } from "@/content/common.js";
import { operatorAccess, operatorServices, operatorTypes } from "@/mocks/operators.js";
import { nspProviders, nspServices } from "@/mocks/thnsw.js";
import { formatDate, formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useDisplay } from "vuetify";
import { checkStatus, itemStatus } from "./check-status.js";

const props = defineProps({
  request: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["approve", "reject"]);
const { smAndUp } = useDisplay();

const f = t.detail.fields;
const r = computed(() => props.request);
const companyItems = computed(() => {
  const o = r.value;
  if (!o) return [];
  return [
    { label: f.taxId, value: o.taxId },
    { label: f.branch, value: o.branch },
    { label: f.nameTh, value: o.nameTh },
    { label: f.nameEn, value: o.nameEn },
    { label: f.type, value: operatorTypes[o.type].label },
    { label: f.registeredOn, value: o.registeredOn ? formatDate(o.registeredOn) : "–" },
    { label: f.capital, value: o.capital ?? "–" },
    { label: f.receivedAt, value: `${formatDateTime(o.receivedAt)} ${t.timeSuffix}` },
    { label: f.address, value: o.address ?? "–", wide: true },
    { label: f.contact, value: o.contact?.name ?? "–" },
    { label: f.email, value: o.contact?.email ?? "–" },
    { label: f.phone, value: o.contact?.phone ?? "–" },
  ];
});

const checks = computed(() => {
  const c = r.value?.checks;
  if (!c) return [];
  return [
    {
      key: "signature",
      icon: "fas fa-signature",
      title: t.detail.signature,
      caption: t.detail.signatureCaption(c.signature.issuer, c.signature.serial, formatDate(c.signature.validTo)),
      note: c.signature.note,
      state: itemStatus(c.signature.pass, c.signature.note),
    },
    {
      key: "schema",
      icon: "fas fa-code",
      title: t.detail.schema,
      caption: t.detail.schemaCaption(c.schema.version),
      note: c.schema.note,
      state: itemStatus(c.schema.pass, c.schema.note),
    },
  ];
});
const tileTone = { pass: "green", warn: "amber", fail: "red" };
const overall = computed(() => checkStatus(r.value?.checks));
const status = computed(() => t.status[r.value?.decision ?? "pending"]);
const pending = computed(() => r.value && !r.value.decision);
</script>

<template>
  <AppDialog
    v-model="open"
    :title="t.detail.title"
    :subtitle="r ? t.detail.subtitle(r.profileId, r.nswId) : ''"
    wide
  >
    <div v-if="r" class="d-flex flex-column ga-6">
      <div class="d-flex flex-wrap align-center ga-2">
        <StatusBadge :tone="status.tone" dot>{{ status.label }}</StatusBadge>
        <span class="pf-type-caption text-text-tertiary">{{ t.detail.messageId }} {{ r.checks?.messageId }}</span>
      </div>

      <!-- ผลการพิจารณา (รายการที่พิจารณาแล้ว) -->
      <AlertBox
        v-if="r.decision"
        :tone="r.decision === 'approved' ? 'success' : 'danger'"
        :title="`${t.detail.decision}: ${status.label}`"
      >
        {{ t.detail.decidedBy(r.decidedBy, formatDateTime(r.decidedAt)) }}
        <template v-if="r.decision === 'approved'">
          · {{ t.detail.accessLabel }} {{ operatorAccess[r.access].label }} · {{ t.detail.serviceLabel }}
          {{ operatorServices[r.service].label }}
        </template>
        <template v-else>
          <br />{{ t.detail.reasonLabel }}: {{ r.reason }}
        </template>
      </AlertBox>

      <section>
        <h3 class="pf-type-label-lg text-text-primary mb-3">{{ t.detail.company }}</h3>
        <KeyValueList :items="companyItems" :columns="smAndUp ? 2 : 1" />
      </section>

      <v-divider color="border-default" class="border-opacity-100" />

      <section>
        <h3 class="pf-type-label-lg text-text-primary mb-3">{{ t.detail.nsp }}</h3>
        <div class="d-flex flex-column ga-3">
          <div v-for="n in r.nsp" :key="n.provider" class="pf-bordered rounded-lg pa-4">
            <div class="d-flex flex-wrap align-center justify-space-between ga-2">
              <div class="min-w-0">
                <div class="pf-type-body-sm-strong">{{ nspProviders[n.provider].name }}</div>
                <div class="pf-type-caption text-text-tertiary">
                  {{ nspProviders[n.provider].code }} · {{ t.detail.nspSince(formatDate(n.since)) }}
                </div>
              </div>
            </div>
            <div class="d-flex flex-wrap ga-2 mt-3">
              <StatusBadge v-for="s in n.services" :key="s" tone="info">{{ s }} · {{ nspServices[s] }}</StatusBadge>
            </div>
          </div>
        </div>
      </section>

      <v-divider color="border-default" class="border-opacity-100" />

      <section>
        <div class="d-flex flex-wrap align-center ga-2 mb-3">
          <h3 class="pf-type-label-lg text-text-primary">{{ t.detail.checks }}</h3>
          <StatusBadge :tone="overall.tone" dot>{{ t.checkBadge[overall.key] }}</StatusBadge>
        </div>
        <div class="d-flex flex-column ga-3">
          <div v-for="c in checks" :key="c.key" class="d-flex align-start ga-3 pf-bordered rounded-lg pa-4">
            <IconTile :icon="c.icon" :tone="tileTone[c.state.key]" />
            <div class="flex-grow-1 min-w-0">
              <div class="d-flex flex-wrap align-center ga-2">
                <span class="pf-type-body-sm-strong">{{ c.title }}</span>
                <StatusBadge :tone="c.state.tone" dot>{{ t.checkBadge[c.state.key] }}</StatusBadge>
              </div>
              <div class="pf-type-caption text-text-tertiary mt-1 text-break">{{ c.caption }}</div>
              <div v-if="c.note" class="pf-type-caption mt-1" :class="c.state.key === 'fail' ? 'text-status-danger-fg' : 'text-status-warning-fg'">
                {{ c.note }}
              </div>
            </div>
          </div>
        </div>
        <AlertBox v-if="pending && overall.key === 'fail'" tone="danger" class="mt-3">{{ t.detail.failHint }}</AlertBox>
      </section>
    </div>

    <template #actions>
      <template v-if="pending">
        <SecondaryButton height="control-md" @click="open = false">{{ common.actions.close }}</SecondaryButton>
        <v-btn variant="outlined" color="error" prepend-icon="fas fa-xmark" :height="size['control-md']" @click="emit('reject', r)">
          {{ t.actions.reject }}
        </v-btn>
        <v-btn color="primary" prepend-icon="fas fa-check" :height="size['control-md']" @click="emit('approve', r)">
          {{ t.actions.approve }}
        </v-btn>
      </template>
      <v-btn v-else color="primary" :height="size['control-md']" @click="open = false">{{ common.actions.close }}</v-btn>
    </template>
  </AppDialog>
</template>
