<script setup>
// ตัวอย่างใบเสร็จรับเงินอิเล็กทรอนิกส์ (B-12) — สไตล์เดียวกับ review/CertificatePreview แต่โทน teal
// receipt = รายการจาก mocks/receipts.js
import { computed } from "vue";
import { receiptsText } from "@/content/receipts.js";
import { banks } from "@/mocks/payments.js";
import { receiptFee, receiptSigners } from "@/mocks/receipts.js";
import { formatDateTimeSec, formatMoney, formatThaiDate } from "@/utils/format.js";

const props = defineProps({
  receipt: { type: Object, required: true },
});
const t = receiptsText.preview;

const signer = computed(() => receiptSigners[props.receipt.signer]);
const qty = computed(() => Math.max(1, Math.round(props.receipt.amount / receiptFee)));
const fields = computed(() => {
  const r = props.receipt;
  return [
    [t.fields.payer, r.company],
    [t.fields.taxId, `${r.taxId} (${t.fields.branch} ${r.branch})`],
    [t.fields.requestNo, r.requestNo],
    [t.fields.reference, r.reference],
    [t.fields.ref, `${r.ref1} / ${r.ref2}`],
    [t.fields.bank, `${r.bankCode} · ${banks[r.bankCode]}`],
    ...(r.certificateNo ? [[t.fields.certificate, r.certificateNo]] : []),
  ];
});
</script>

<template>
  <article class="doc bg-surface rounded-lg pa-6 pa-md-8">
    <header class="d-flex flex-wrap align-start ga-4 pb-4 doc__head">
      <div class="doc__logo bg-primary rounded-lg d-flex align-center justify-center">
        <v-icon icon="fas fa-shield-halved" color="text-text-on-inverse" />
      </div>
      <div class="flex-grow-1 min-w-0">
        <div class="pf-type-h4 text-text-primary">{{ t.org }}</div>
        <div class="pf-type-body-sm text-text-secondary">{{ t.division }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ t.address }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ t.orgTaxId }}</div>
      </div>
      <span class="pf-type-label-sm text-text-brand bg-accent-teal-subtle rounded-pill px-3 py-1">{{ t.original }}</span>
    </header>

    <div class="d-flex flex-wrap align-end justify-space-between ga-4 my-5">
      <div>
        <h3 class="pf-type-h3 text-text-primary">{{ t.docTitle }}</h3>
        <div class="pf-type-body-sm text-text-secondary">{{ t.docTitleEn }}</div>
      </div>
      <dl class="doc__meta">
        <dt class="pf-type-body-sm text-text-secondary">{{ t.fields.receiptNo }}</dt>
        <dd class="pf-type-body-md-strong text-text-brand">{{ receipt.receiptNo }}</dd>
        <dt class="pf-type-body-sm text-text-secondary">{{ t.fields.issuedAt }}</dt>
        <dd class="pf-type-body-sm-strong text-text-primary">{{ formatThaiDate(receipt.issuedAt) }}</dd>
      </dl>
    </div>

    <dl class="doc__fields mb-5">
      <template v-for="[label, value] in fields" :key="label">
        <dt class="pf-type-body-sm text-text-secondary">{{ label }}</dt>
        <dd class="pf-type-body-sm-strong text-text-primary">{{ value }}</dd>
      </template>
    </dl>

    <div class="doc__table-wrap rounded-sm mb-5">
      <table class="doc__table">
        <thead class="bg-bg-surface-muted">
          <tr class="pf-type-label-sm text-text-secondary">
            <th>{{ t.table.no }}</th>
            <th>{{ t.table.item }}</th>
            <th class="text-end">{{ t.table.qty }}</th>
            <th class="text-end">{{ t.table.price }}</th>
            <th class="text-end">{{ t.table.amount }}</th>
          </tr>
        </thead>
        <tbody class="pf-type-body-sm text-text-primary">
          <tr>
            <td>1</td>
            <td class="doc__item">{{ t.feeItem }}</td>
            <td class="text-end">{{ qty }}</td>
            <td class="text-end">{{ formatMoney(receiptFee) }}</td>
            <td class="text-end">{{ formatMoney(receipt.amount) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-accent-teal-subtle">
            <td colspan="4" class="pf-type-body-sm-strong text-text-primary text-end">{{ t.total }}</td>
            <td class="pf-type-body-md-strong text-text-brand text-end text-no-wrap">{{ formatMoney(receipt.amount) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <footer class="d-flex flex-wrap align-end justify-space-between ga-6">
      <div class="doc__qr rounded-sm d-flex flex-column align-center justify-center ga-1 text-center pa-2">
        <v-icon icon="fas fa-qrcode" color="icon-muted" />
        <span class="pf-type-caption text-text-tertiary">{{ t.qr }}</span>
      </div>
      <div class="doc__sign text-center">
        <div v-if="receipt.status === 'signed'" class="d-inline-flex align-center ga-2 pf-type-caption-strong text-status-success-fg bg-status-success-bg rounded-pill px-3 py-1 mb-2">
          <v-icon icon="fas fa-file-signature" size="x-small" />
          {{ t.signedDigitally }}
        </div>
        <div class="doc__sign-line pt-2 pf-type-body-md-strong text-text-primary">{{ signer.name }}</div>
        <div class="pf-type-caption text-text-secondary mt-1">{{ signer.position }}</div>
        <div class="pf-type-caption text-text-tertiary">{{ t.signTitle }}</div>
        <template v-if="receipt.status === 'signed'">
          <div class="pf-type-caption text-text-tertiary mt-1">{{ t.signedAt(formatDateTimeSec(receipt.issuedAt)) }}</div>
          <div class="pf-type-caption text-text-tertiary">{{ t.serial(signer.serial) }}</div>
        </template>
      </div>
    </footer>

    <div v-if="receipt.status === 'cancelled'" class="doc__mark pf-type-display text-status-danger-fg" aria-hidden="true">
      {{ t.cancelledMark }}
    </div>
  </article>
</template>

<style scoped>
.doc {
  position: relative;
  overflow: hidden;
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
.doc__head {
  border-bottom: var(--pf-space-2) solid rgb(var(--v-theme-primary));
}
.doc__logo {
  width: var(--pf-size-icon-tile-lg);
  height: var(--pf-size-icon-tile-lg);
  flex-shrink: 0;
}
.doc__meta,
.doc__fields {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: var(--pf-space-4) var(--pf-space-24);
}
.doc__fields {
  gap: var(--pf-space-4) var(--pf-space-40);
}
.doc__table-wrap {
  overflow-x: auto;
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
.doc__table {
  width: 100%;
  border-collapse: collapse;
}
.doc__table th,
.doc__table td {
  text-align: start;
  padding: var(--pf-space-12) var(--pf-space-16);
  border-bottom: var(--pf-stroke-default) solid rgb(var(--v-theme-border-default));
}
.doc__table .text-end {
  text-align: end;
}
.doc__table tfoot td {
  border-bottom: 0;
}
.doc__item {
  min-width: calc(var(--pf-space-120) * 1.5);
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
.doc__mark {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-24deg) scale(2);
  opacity: 0.16;
  pointer-events: none;
  user-select: none;
}
</style>
