<script setup>
// D10 พิจารณาคำขอใบรับรองฯ (Checklist Incomplete) + D11 Preview & Confirm (Modal) — Figma 17:1852, 18:2217
// ?preview = เปิด D11 ทันที · ?preview=complete = เปิด D11 พร้อมทำเครื่องหมาย Checklist ครบ (ใช้ทดสอบ)
// อนุมัติ / ไม่อนุมัติ ต้องผ่าน Preview (D11) ก่อนยืนยันทุกครั้ง (TOR 4.4.2 (5)(7)) · ปุ่มตัดสิน / ยกเลิก / แก้ไข แสดงตามสิทธิ์ (session.can)
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import AlertBox from "@/components/AlertBox.vue";
import EmptyState from "@/components/EmptyState.vue";
import RequestSummaryCard from "@/components/review/RequestSummaryCard.vue";
import RequestInfoPanel from "@/components/review/RequestInfoPanel.vue";
import ProductTable from "@/components/review/ProductTable.vue";
import DocumentList from "@/components/review/DocumentList.vue";
import ApprovalChecklist from "@/components/review/ApprovalChecklist.vue";
import ReplyMessageForm from "@/components/review/ReplyMessageForm.vue";
import ConfirmDecisionDialog from "@/components/review/ConfirmDecisionDialog.vue";
import UndoApprovalBanner from "@/components/review/UndoApprovalBanner.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import StatusHistoryTable from "@/components/tracking/StatusHistoryTable.vue";
import { reviewText as t } from "@/content/review.js";
import { emailText } from "@/content/notifications.js";
import { checklistItems, replyMessages, requestDocuments, reviewHistory } from "@/mocks/review.js";
import { requestStatuses } from "@/mocks/requests.js";
import { useReviewStore } from "@/stores/review.js";
import { usePaymentsStore } from "@/stores/payments.js";
import { useSessionStore } from "@/stores/session.js";
import { formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const route = useRoute();
const router = useRouter();
const store = useReviewStore();
const session = useSessionStore();
const paymentsStore = usePaymentsStore();

// สิทธิ์ในเมนูคำขอ (TOR 4.4.7) — ซ่อน/ปิดปุ่มเท่านั้น backend เป็นผู้ตรวจจริง
const canDecide = computed(() => session.can("requests", "approve")); // อนุมัติ / ไม่อนุมัติ / ยกเลิกการอนุมัติ
const canEdit = computed(() => session.can("requests", "edit"));

const refNo = computed(() => route.params.ref);
const detail = computed(() => store.detailOf(refNo.value));
watch(refNo, (r) => store.detailOf(r) && store.ensure(r), { immediate: true });
const rec = computed(() => store.record(refNo.value) ?? null);

const breadcrumb = computed(() => [
  { title: t.breadcrumb.group },
  { title: t.breadcrumb.requests, to: { name: "admin-requests" } },
  { title: refNo.value },
]);

// ----- สถานะ -----
const decision = computed(() => rec.value?.decision ?? null);
const status = computed(() => {
  const key = store.statusOf(refNo.value);
  return key === "pending" ? t.summary.inProgress : requestStatuses[key];
});

// ----- แท็บ -----
const tab = ref("info");
const documents = computed(() => requestDocuments[refNo.value] ?? []);
const tabs = computed(() => [
  { value: "info", label: t.tabs.info },
  { value: "products", label: t.tabs.products, count: detail.value.items.length },
  { value: "documents", label: t.tabs.documents, count: documents.value.length },
  { value: "history", label: t.tabs.history },
]);
const history = computed(() => [...(rec.value?.events ?? []), ...(reviewHistory[refNo.value] ?? [])]);
const flagged = computed(() => detail.value.items.filter((i) => i.result !== "ok").length);
const lastEdit = computed(() =>
  rec.value?.lastEdit ? t.info.edited(rec.value.lastEdit.by, formatDateTime(rec.value.lastEdit.at)) : ""
);

// ----- Checklist / ข้อความตอบกลับ -----
const checks = computed({
  get: () => rec.value.checks,
  set: (v) => store.setChecks(refNo.value, v),
});
const replyCode = computed({
  get: () => rec.value.replyCode,
  set: (v) => store.setReply(refNo.value, v, rec.value.note),
});
const replyType = computed({
  get: () => rec.value.replyType,
  set: (v) => store.setReplyType(refNo.value, v),
});
const note = computed({
  get: () => rec.value.note,
  set: (v) => store.setReply(refNo.value, rec.value.replyCode, v),
});
const complete = computed(() => checks.value.length === checklistItems.length);
const reply = computed(() => store.replyOf(replyCode.value));
const decidedReply = computed(() => store.replyOf(decision.value?.replyCode));
// อนุมัติไม่ได้ถ้าเลือกข้อความประเภทไม่อนุมัติ (เช่น R05) · ไม่อนุมัติได้เมื่อเลือกข้อความประเภทไม่อนุมัติแล้วเท่านั้น
const approveBlocked = computed(() => (reply.value?.type === "reject" ? t.actions.approveReplyHint : ""));
const canReject = computed(() => reply.value?.type === "reject");
const hints = computed(() => [
  ...(!complete.value ? [t.actions.approveHint(checks.value.length, checklistItems.length)] : []),
  ...(approveBlocked.value ? [approveBlocked.value] : []),
  ...(!canReject.value ? [t.actions.rejectHint] : []),
]);
// คำสั่งชำระล่าสุดของคำขอ (B-11)
const payment = computed(() => paymentsStore.latestOf(refNo.value));

// ----- Dialog: Preview ทุกครั้งก่อนยืนยัน (approve | reject) หรือดูอย่างเดียว (view) -----
const previewOpen = ref(false);
const previewMode = ref("view");
const openPreview = (mode) => {
  previewMode.value = mode;
  previewOpen.value = true;
};
const snack = ref({ show: false, text: "" });
const notify = (text) => (snack.value = { show: true, text });

// บันทึกผลแล้วกลับไปหน้ารายการคำขอ (หน้ารายการแจ้งผลด้วย Snackbar)
// เปิดแท็บที่คำขอย้ายไป (อนุมัติ → รอการชำระเงิน · ไม่อนุมัติ → ไม่อนุมัติ)
const backToList = (tab) => router.push({ name: "admin-requests", query: { decided: refNo.value, tab } });
const confirmDecision = () => {
  if (previewMode.value === "approve" && store.approve(refNo.value, session.user.name)) backToList("awaitingPayment");
  if (previewMode.value === "reject" && store.reject(refNo.value, session.user.name)) backToList("rejected");
};
const undo = (reason) => {
  if (store.undoApproval(refNo.value, session.user.name, reason)) notify(t.decided.undone);
};
const saveEdits = (edits, changed) => store.saveEdits(refNo.value, edits, session.user.name, changed);

onMounted(() => {
  if (!detail.value || !("preview" in route.query)) return;
  if (route.query.preview === "complete") checks.value = checklistItems.map((c) => c.id);
  openPreview(decision.value || !canDecide.value ? "view" : "approve");
});
</script>

<template>
  <AdminLayout :breadcrumb="breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <!-- ข้อความ ebXML ของคำขอนี้ (B-17) — แสดงตามสิทธิ์เมนู แบบเดียวกับหน้าติดตามสถานะ (backend เป็นผู้ตรวจจริง) -->
        <SecondaryButton
          v-if="detail && session.can('ebxml')"
          prepend-icon="fas fa-server"
          :to="{ name: 'admin-ebxml', query: { ref: refNo } }"
        >
          {{ t.openEbxml }}
        </SecondaryButton>
        <SecondaryButton
          prepend-icon="fas fa-chevron-left"
          :to="{ name: 'admin-requests' }"
        >
          {{ t.back }}
        </SecondaryButton>
      </template>
    </PageHeader>

    <v-card v-if="!detail" class="pf-bordered">
      <EmptyState icon="fas fa-file-circle-question" tone="amber" :title="t.notFound.title" :description="t.notFound.description(refNo)">
        <template #actions>
          <v-btn color="primary" :to="{ name: 'admin-request-review', params: { ref: 'PF6910260003' } }">{{ t.notFound.example }}</v-btn>
        </template>
      </EmptyState>
    </v-card>

    <template v-else>
      <RequestSummaryCard :detail="detail" :status="status" />

      <UndoApprovalBanner
        v-if="decision?.type === 'approved'"
        :decision="decision"
        :deadline="store.undoDeadline(refNo)"
        :can-undo="canDecide"
        @undo="undo"
      />
      <AlertBox
        v-else-if="decision?.type === 'rejected'"
        tone="danger"
        :title="t.decided.rejected(formatDateTime(decision.at), decision.by)"
        class="mb-6"
      >
        {{ t.decided.rejectedNote(decidedReply ? t.reply.item(decidedReply) : decision.note) }}
        <div v-if="decision.notification" class="mt-1">
          <v-icon icon="far fa-envelope" size="x-small" class="me-1" />
          {{ emailText.sentLine(decision.notification.to, formatDateTime(decision.notification.at)) }}
        </div>
      </AlertBox>
      <AlertBox
        v-else-if="decision?.type === 'invalid'"
        tone="danger"
        :title="t.decided.invalid(formatDateTime(decision.at))"
        class="mb-6"
      >
        {{ t.decided.invalidNote(decision.note) }}
        <div v-if="decision.notification" class="mt-1">
          <v-icon icon="far fa-envelope" size="x-small" class="me-1" />
          {{ emailText.sentLine(decision.notification.to, formatDateTime(decision.notification.at)) }}
        </div>
      </AlertBox>

      <v-row>
        <!-- ซ้าย: รายละเอียดคำขอ -->
        <v-col cols="12" lg="8" class="d-flex flex-column ga-6 min-w-0">
          <SectionCard flush>
            <div class="px-4 pf-bordered-bottom tabs-wrap">
              <StatusTabs v-model="tab" :tabs="tabs" />
            </div>
            <ProductTable v-if="tab === 'products'" :detail="detail" />
            <StatusHistoryTable v-else-if="tab === 'history'" :entries="history" />
            <div v-else class="pa-6">
              <RequestInfoPanel
                v-if="tab === 'info'"
                :detail="detail"
                :locked="!!decision || !canEdit"
                :locked-text="decision ? '' : t.info.noPermission"
                :last-edit="lastEdit"
                @save="saveEdits"
              />
              <DocumentList v-else-if="tab === 'documents'" :documents="documents" @download="(n) => notify(t.documents.downloaded(n))" />
            </div>
          </SectionCard>

          <SectionCard v-if="tab === 'info'" :title="t.products.title" flush>
            <template #header>
              <StatusBadge tone="neutral">{{ t.products.autoChecked(formatDateTime(detail.autoCheckedAt)) }}</StatusBadge>
            </template>
            <template #actions>
              <StatusBadge :tone="flagged ? 'warning' : 'success'" dot>
                {{ flagged ? t.products.flagged(flagged) : t.products.allPassed }}
              </StatusBadge>
            </template>
            <ProductTable :detail="detail" />
          </SectionCard>
        </v-col>

        <!-- ขวา: Checklist + ข้อความตอบกลับ + ปุ่ม -->
        <v-col cols="12" lg="4" class="d-flex flex-column ga-6 min-w-0">
          <ApprovalChecklist
            v-model="checks"
            :items="checklistItems"
            :readonly="!!decision || !canDecide"
            :readonly-text="decision ? '' : t.checklist.viewOnly"
          />
          <ReplyMessageForm
            v-model:type="replyType"
            v-model:code="replyCode"
            v-model:note="note"
            :messages="replyMessages"
            :readonly="!!decision || !canDecide"
          />
          <v-card class="pf-bordered pa-6 d-flex flex-column ga-3">
            <SecondaryButton
              prepend-icon="far fa-eye"
              block
              @click="openPreview('view')"
            >
              {{ t.actions.preview }}
            </SecondaryButton>
            <template v-if="!decision && canDecide">
              <div class="d-flex ga-3">
                <v-btn
                  variant="outlined"
                  color="error"
                  class="flex-1-1"
                  prepend-icon="fas fa-xmark"
                  :height="size['control-lg']"
                  :disabled="!canReject"
                  @click="openPreview('reject')"
                >
                  {{ t.actions.reject }}
                </v-btn>
                <v-btn
                  color="success"
                  class="flex-1-1"
                  prepend-icon="fas fa-check"
                  :height="size['control-lg']"
                  :disabled="!complete || !!approveBlocked"
                  @click="openPreview('approve')"
                >
                  {{ t.actions.approve }}
                </v-btn>
              </div>
              <p v-for="h in hints" :key="h" class="pf-type-caption text-text-tertiary text-center">{{ h }}</p>
              <p class="pf-type-caption text-text-tertiary text-center">{{ t.actions.previewNote }}</p>
            </template>
            <AlertBox v-else-if="!decision" tone="info" icon="fas fa-lock">{{ t.actions.noPermission }}</AlertBox>
            <template v-else>
              <v-btn
                v-if="payment && session.can('payments')"
                variant="text"
                color="primary"
                append-icon="fas fa-arrow-right"
                :to="{ name: 'admin-payments', query: { reference: refNo } }"
              >
                {{ t.actions.viewPayment }}
              </v-btn>
              <v-btn
                variant="text"
                color="primary"
                append-icon="fas fa-arrow-right"
                :to="{ name: 'admin-tracking', query: { ref: refNo } }"
              >
                {{ t.tracking }}
              </v-btn>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <ConfirmDecisionDialog
        v-model="previewOpen"
        :detail="detail"
        :checked="checks.length"
        :total="checklistItems.length"
        :mode="decision ? 'view' : previewMode"
        :reply="reply"
        :note="note"
        :blocked="approveBlocked"
        @confirm="confirmDecision"
      />
    </template>

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" timeout="3000">
      {{ snack.text }}
      <template #actions>
        <v-btn variant="text" color="text-text-on-inverse-accent" @click="snack.show = false">{{ t.snack.close }}</v-btn>
      </template>
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.tabs-wrap {
  overflow-x: auto;
}
</style>
