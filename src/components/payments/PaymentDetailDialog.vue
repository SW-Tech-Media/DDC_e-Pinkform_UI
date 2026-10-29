<script setup>
// Dialog รายละเอียดการชำระเงิน (D13 › ปุ่ม View)
import { computed } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import AlertBox from "@/components/AlertBox.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { paymentsText } from "@/content/payments.js";
import { common } from "@/content/common.js";
import { banks, paymentStatuses } from "@/mocks/payments.js";
import { formatDateTime, formatMoney } from "@/utils/format.js";

const props = defineProps({
  payment: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });

const t = paymentsText.detail;
const f = t.fields;
const dash = (v) => v ?? t.empty;

const sections = computed(() => {
  const p = props.payment;
  if (!p) return [];
  return [
    {
      title: t.payer,
      items: [
        { label: f.company, value: p.company },
        { label: f.taxId, value: p.taxId },
        { label: f.requestNo, value: p.requestNo },
        { label: f.id, value: p.id },
      ],
    },
    {
      title: t.bill,
      items: [
        { label: f.ref1, value: p.ref1 },
        { label: f.ref2, value: p.ref2 },
        { label: f.bank, value: `${p.bankCode} · ${banks[p.bankCode]}` },
        { label: f.amount, value: formatMoney(p.amount) },
        { label: f.sentAt, value: formatDateTime(p.sentAt) },
      ],
    },
    {
      title: t.result,
      items: [
        { label: f.status, value: p.status, badge: true },
        { label: f.paidAt, value: p.paidAt ? formatDateTime(p.paidAt) : dash() },
        { label: f.receiptNo, value: dash(p.receiptNo) },
      ],
    },
  ];
});
</script>

<template>
  <AppDialog v-model="open" :title="t.title" :subtitle="payment?.id">
    <template v-if="payment">
      <section v-for="(s, i) in sections" :key="s.title" :class="{ 'mt-6': i }">
        <h3 class="pf-type-label-lg text-text-primary mb-3">{{ s.title }}</h3>
        <KeyValueList :items="s.items" :columns="2">
          <template #value="{ item }">
            <StatusBadge v-if="item.badge" :tone="paymentStatuses[item.value].tone" dot>
              {{ paymentStatuses[item.value].label }}
            </StatusBadge>
            <template v-else>{{ item.value }}</template>
          </template>
        </KeyValueList>
      </section>
      <AlertBox v-if="payment.status === 'failed'" tone="danger" :title="payment.failReason" class="mt-6">
        {{ t.failedNote }}
      </AlertBox>
      <AlertBox v-else-if="payment.status === 'pending'" tone="warning" class="mt-6">{{ t.pendingNote }}</AlertBox>
      <AlertBox v-else-if="payment.status === 'cancelled'" tone="neutral" :title="t.cancelledTitle" class="mt-6">
        {{ t.cancelledNote(formatDateTime(payment.cancelledAt), payment.cancelReason) }}
      </AlertBox>
    </template>
    <template #actions>
      <v-btn variant="outlined" color="secondary" @click="open = false">{{ common.actions.close }}</v-btn>
    </template>
  </AppDialog>
</template>
