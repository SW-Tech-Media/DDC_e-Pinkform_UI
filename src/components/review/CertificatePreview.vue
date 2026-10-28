<script setup>
// Preview เอกสาร (Figma D11): ใบรับรองฯ (EN) · ใบแนบภาษาไทย · ใบแนบภาษาอังกฤษ — ใช้ข้อมูลจาก requestDetails
// variant: cert | annexTh | annexEn · certificateNo = เลขที่ใบรับรอง (ก่อนอนุมัติแสดง DDC-PF 69/XXXXXX)
import { computed } from "vue";
import { reviewText } from "@/content/review.js";
import { formatDate } from "@/utils/format.js";

const props = defineProps({
  detail: { type: Object, required: true },
  variant: { type: String, default: "cert", validator: (v) => ["cert", "annexTh", "annexEn"].includes(v) },
  certificateNo: { type: String, default: "" },
  watermark: { type: Boolean, default: true },
});
const t = reviewText.certificate;
const th = computed(() => props.variant === "annexTh");
const no = computed(() => props.certificateNo || t.placeholderNo);

const fields = computed(() => {
  const d = props.detail;
  if (th.value) {
    return [
      [t.labelsTh.ref, d.ref],
      [t.labelsTh.exporter, d.exporter.nameTh],
      [t.labelsTh.consignee, d.consignee.name],
      [t.labelsTh.country, d.consignee.country],
      [t.labelsTh.invoice, `${d.exporter.invoice} (${formatDate(d.exporter.invoiceDate)})`],
      [t.labelsTh.route, d.consignee.route],
    ];
  }
  const base = [
    [t.labels.exporter, d.exporter.nameEn],
    [t.labels.consignee, t.consigneeWithCountry(d.consignee.name, d.consignee.countryEn)],
    [t.labels.invoice, d.exporter.invoice],
    [t.labels.port, d.consignee.portOfLoading],
  ];
  return props.variant === "annexEn" ? [[t.labels.ref, d.ref], ...base] : base;
});

const showDate = computed(() => props.variant !== "cert");
const cols = computed(() => (th.value ? t.tableTh : t.table));
const rows = computed(() =>
  props.detail.items.map((it, i) => ({
    no: i + 1,
    goods: th.value ? it.nameTh : it.nameEn,
    hs: it.hs,
    source: th.value ? it.source : it.sourceEn,
    producedAt: formatDate(it.producedAt),
    qty: it.qty,
  }))
);
</script>

<template>
  <article class="doc bg-accent-pink-subtle rounded-lg pa-6 pa-md-8">
    <header class="d-flex flex-wrap align-center ga-4 pb-4 doc__head">
      <div class="doc__logo bg-accent rounded-lg d-flex align-center justify-center">
        <v-icon icon="fas fa-shield-halved" color="text-text-on-inverse" />
      </div>
      <div class="flex-grow-1 min-w-0">
        <div class="pf-type-h4 text-text-primary">{{ th ? t.deptTh : t.dept }}</div>
        <div class="pf-type-body-sm text-text-secondary">{{ th ? t.ministryTh : t.ministry }}</div>
      </div>
      <div class="text-end">
        <div class="pf-type-body-sm text-text-secondary">{{ th ? t.certNoTh : t.certNo }}</div>
        <div class="pf-type-h4 text-text-accent text-no-wrap">{{ no }}</div>
      </div>
    </header>

    <div class="text-center my-5">
      <h3 class="pf-type-h4 text-text-primary">
        {{ variant === "cert" ? t.title : th ? t.annexTitleTh : t.annexTitleEn }}
      </h3>
      <div class="pf-type-body-sm text-text-secondary">{{ th ? t.annexSubtitleTh : t.subtitle }}</div>
    </div>

    <dl class="doc__fields mb-5">
      <template v-for="[label, value] in fields" :key="label">
        <dt class="pf-type-body-sm text-text-secondary">{{ label }}</dt>
        <dd class="pf-type-body-sm-strong text-text-primary">{{ value }}</dd>
      </template>
    </dl>

    <div class="doc__table-wrap bg-surface rounded-sm mb-5">
      <table class="doc__table">
        <thead>
          <tr class="pf-type-label-sm text-text-secondary">
            <th>{{ cols.no }}</th>
            <th>{{ cols.goods }}</th>
            <th>{{ cols.hs }}</th>
            <th>{{ cols.source }}</th>
            <th v-if="showDate">{{ cols.producedAt }}</th>
            <th>{{ cols.qty }}</th>
          </tr>
        </thead>
        <tbody class="pf-type-body-sm text-text-primary">
          <tr v-for="r in rows" :key="r.no">
            <td>{{ r.no }}</td>
            <td>{{ r.goods }}</td>
            <td>{{ r.hs }}</td>
            <td>{{ r.source }}</td>
            <td v-if="showDate">{{ r.producedAt }}</td>
            <td class="text-no-wrap">{{ r.qty }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="pf-type-body-sm text-text-primary mb-6">{{ th ? t.statementTh : t.statement }}</p>

    <footer class="d-flex flex-wrap align-end justify-space-between ga-6">
      <div class="doc__qr rounded-sm d-flex flex-column align-center justify-center ga-1 text-center pa-2">
        <v-icon icon="fas fa-qrcode" color="icon-muted" />
        <span class="pf-type-caption text-text-tertiary">{{ t.qr }}</span>
      </div>
      <div class="doc__sign text-center">
        <div class="pf-type-caption text-text-secondary pb-2">{{ th ? t.signedByTh : t.signedBy }}</div>
        <div class="doc__sign-line pt-2 pf-type-body-md-strong text-text-primary">{{ th ? t.officerTh : t.officer }}</div>
        <div class="pf-type-caption text-text-secondary mt-1">{{ th ? t.divisionTh : t.division }}</div>
      </div>
    </footer>

    <div v-if="watermark" class="doc__watermark pf-type-display text-text-accent" aria-hidden="true">{{ t.watermark }}</div>
  </article>
</template>

<style scoped>
.doc {
  position: relative;
  overflow: hidden;
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-accent));
}
.doc__watermark {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transform: rotate(-28deg) scale(2.6);
  opacity: 0.14;
  pointer-events: none;
  user-select: none;
}
.doc__head {
  border-bottom: var(--pf-space-2) solid rgb(var(--v-theme-accent));
}
.doc__logo {
  width: var(--pf-size-icon-tile-lg);
  height: var(--pf-size-icon-tile-lg);
  flex-shrink: 0;
}
.doc__fields {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: var(--pf-space-4) var(--pf-space-40);
}
.doc__table-wrap {
  overflow-x: auto;
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-accent));
}
.doc__table {
  width: 100%;
  border-collapse: collapse;
}
.doc__table th,
.doc__table td {
  text-align: start;
  padding: var(--pf-space-12) var(--pf-space-16);
  border-bottom: var(--pf-stroke-default) solid rgb(var(--v-theme-border-accent));
}
.doc__table tbody tr:last-child td {
  border-bottom: 0;
}
.doc__qr {
  width: calc(var(--pf-size-control-lg) * 2);
  height: calc(var(--pf-size-control-lg) * 2);
  border: var(--pf-stroke-default) dashed rgb(var(--v-theme-border-strong));
}
.doc__sign {
  min-width: 0;
  flex: 0 1 calc(var(--pf-size-control-lg) * 6);
}
.doc__sign-line {
  border-top: var(--pf-stroke-default) solid rgb(var(--v-theme-text-primary));
}
</style>
