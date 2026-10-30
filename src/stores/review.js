// ผลการพิจารณาคำขอ (D10 / D11) เก็บข้ามหน้า — Checklist, ข้อความตอบกลับ, ข้อมูลที่เจ้าหน้าที่แก้ไข,
// ผลอนุมัติ / ไม่อนุมัติ / ยกเลิกการอนุมัติ และเหตุการณ์ที่ใช้แสดงในประวัติสถานะ
// ผลที่บันทึกส่งต่อไปยังคำสั่งชำระ (stores/payments.js → B-11) และ Audit Log (stores/audit.js → B-19)
// ชั่วคราวจนกว่าจะมี API: backend เป็นผู้ตรวจกฎ (Checklist ครบ, ประเภทข้อความตอบกลับ, ช่วงยกเลิก 15 นาที) และเปลี่ยนสถานะคำขอ
import { defineStore } from "pinia";
import { checklistItems, defaultReplyCode, replyMessages, undoWindowMinutes } from "@/mocks/review.js";
import { emailEvent, emailNotice, requestDetails, requestStatuses, requests } from "@/mocks/requests.js";
import { reviewText } from "@/content/review.js";
import { useAuditStore } from "@/stores/audit.js";
import { usePaymentsStore } from "@/stores/payments.js";
import { nowThaiIso } from "@/utils/format.js";

const statusByRef = Object.fromEntries(requests.map((r) => [r.ref, r.status]));
const replyByCode = Object.fromEntries(replyMessages.map((m) => [m.code, m]));
const replyLabel = (code) => (replyByCode[code] ? reviewText.reply.item(replyByCode[code]) : null);
const S = (key) => requestStatuses[key].label;
const t = reviewText.info;
const editLabels = {
  exporter: { nameTh: t.companyNameTh, nameEn: t.companyNameEn, brand: t.brand, invoice: t.invoice },
  consignee: { name: t.consigneeName, route: t.route, transport: t.transport },
};

// คำขอที่มีผลแล้วในข้อมูลจำลอง (d.decision) เริ่มต้นด้วยผลนั้น — seeded = ไม่ได้บันทึกในรอบนี้ สถานะจึงตามข้อมูลจำลอง
// replyType = ประเภทข้อความตอบกลับที่เลือกดู (approve | reject) — คำขอที่พบแหล่งผลิตในพื้นที่โรคระบาดเริ่มที่ "ไม่อนุมัติ" (R05 ตาม Figma D10)
const newRecord = (ref) => {
  const d = requestDetails[ref];
  const seeded = d?.decision ? { ...d.decision, seeded: true } : null;
  const note = d?.outbreakNote && !seeded ? reviewText.reply.defaultNote(d.outbreakNote.item, d.outbreakNote.freeAt) : "";
  const replyCode = seeded ? (seeded.replyCode ?? null) : d?.outbreakNote ? defaultReplyCode : null;
  return {
    checks: checklistItems.filter((c) => c.checked || seeded?.type === "approved").map((c) => c.id),
    replyType: replyByCode[replyCode]?.type ?? (seeded?.type === "rejected" ? "reject" : "approve"),
    replyCode,
    note,
    defaultNote: note, // ข้อความแนะนำการแก้ไขแหล่งผลิต (ใช้กับการไม่อนุมัติ)
    edits: { exporter: {}, consignee: {} },
    lastEdit: null,
    decision: seeded, // { type: 'approved' | 'rejected' | 'invalid', at, by, replyCode, note, paymentId?, notification?, seeded? }
    events: [], // ใหม่ → เก่า
  };
};

export const useReviewStore = defineStore("review", {
  state: () => ({ records: {} }),
  getters: {
    record: (state) => (ref) => state.records[ref],
    replyOf: () => (code) => replyByCode[code] ?? null,
    // รายการข้อความตอบกลับตามประเภทการตัดสิน (TOR 4.4.2 (6)) — approve | reject
    repliesOf: () => (type) => replyMessages.filter((m) => m.type === type),
    // รายละเอียดคำขอหลังรวมข้อมูลที่เจ้าหน้าที่แก้ไข
    detailOf: (state) => (ref) => {
      const d = requestDetails[ref];
      if (!d) return null;
      const e = state.records[ref]?.edits ?? { exporter: {}, consignee: {} };
      return { ...d, exporter: { ...d.exporter, ...e.exporter }, consignee: { ...d.consignee, ...e.consignee } };
    },
    // สถานะปัจจุบัน (key ใน requestStatuses) — ผลที่เจ้าหน้าที่บันทึกในรอบนี้มาก่อนสถานะในข้อมูลจำลอง
    // อนุมัติในรอบนี้ = "รอการชำระเงิน" ทันที เพราะระบบสร้างและส่งคำสั่งชำระทันทีที่อนุมัติ (Flow 7 ขั้น 6–7, Flow 9 ขั้น 4 → 5)
    // ระหว่างนี้ยังยกเลิกการอนุมัติได้ภายใน 15 นาที (undoDeadline) — ยกเลิกแล้วคำสั่งชำระถูกยกเลิกและคำขอกลับไปรอพิจารณา
    statusOf: (state) => (ref) => {
      const dec = state.records[ref]?.decision;
      if (!dec || dec.seeded) return statusByRef[ref];
      return dec.type === "approved" ? "awaitingPayment" : dec.type;
    },
    undoDeadline: (state) => (ref) => {
      const dec = state.records[ref]?.decision;
      return dec?.type === "approved" ? new Date(dec.at).getTime() + undoWindowMinutes * 60 * 1000 : null;
    },
  },
  actions: {
    ensure(ref) {
      if (!this.records[ref]) this.records[ref] = newRecord(ref);
      return this.records[ref];
    },
    setChecks(ref, ids) {
      this.ensure(ref).checks = ids;
    },
    setReply(ref, code, note) {
      const r = this.ensure(ref);
      r.replyCode = code;
      r.note = note;
    },
    // เปลี่ยนประเภทข้อความตอบกลับ — ข้อความที่เลือกไว้ซึ่งไม่ตรงประเภทถูกล้าง (เช่น R05 ไม่ติดไปกับการอนุมัติ)
    // ข้อความเพิ่มเติมที่ระบบเติมให้ (แนะนำแก้แหล่งผลิต) ถูกล้างเมื่อเปลี่ยนเป็นอนุมัติ และกลับมาเมื่อเปลี่ยนเป็นไม่อนุมัติ — ข้อความที่ผู้ใช้พิมพ์เองคงไว้
    setReplyType(ref, type) {
      const r = this.ensure(ref);
      r.replyType = type;
      if (r.replyCode && replyByCode[r.replyCode]?.type !== type) r.replyCode = null;
      if (type === "approve" && r.note === r.defaultNote) r.note = "";
      if (type === "reject" && !r.note) r.note = r.defaultNote;
    },
    saveEdits(ref, edits, by, changedLabels) {
      const r = this.ensure(ref);
      const before = this.detailOf(ref);
      r.edits = { exporter: { ...r.edits.exporter, ...edits.exporter }, consignee: { ...r.edits.consignee, ...edits.consignee } };
      const at = nowThaiIso();
      r.lastEdit = { at, by };
      if (!changedLabels.length) return;
      r.events.unshift({ event: "edited", detail: reviewText.history.editedDetail(changedLabels.join(", ")), at, by });
      const changes = Object.entries(editLabels).flatMap(([g, labels]) =>
        Object.entries(labels)
          .filter(([k]) => k in edits[g] && edits[g][k] !== before[g][k])
          .map(([k, field]) => ({ field, before: before[g][k], after: edits[g][k] }))
      );
      useAuditStore().record("requests", "update", `${ref} ${before.exporter.nameTh}`, changes);
    },
    // อนุมัติ: ต้องทำ Checklist ครบ และข้อความตอบกลับ (ถ้ามี) ต้องเป็นประเภท "อนุมัติ" — คืน false ถ้าไม่ผ่านเงื่อนไข
    approve(ref, by) {
      const r = this.ensure(ref);
      if (r.decision || r.checks.length !== checklistItems.length) return false;
      if (r.replyCode && replyByCode[r.replyCode]?.type !== "approve") return false;
      const at = nowThaiIso();
      const payment = usePaymentsStore().createOrder(ref, at);
      r.decision = { type: "approved", at, by, replyCode: r.replyCode, note: r.note, paymentId: payment.id };
      r.events.unshift(
        {
          status: "awaitingPayment",
          detail: reviewText.history.orderedDetail(payment.ref1, payment.ref2, payment.id),
          at,
          by: reviewText.history.system,
        },
        { event: "approved", detail: reviewText.history.approvedDetail(r.checks.length, checklistItems.length), at, by }
      );
      useAuditStore().record("requests", "approve", `${ref} ${requestDetails[ref].exporter.nameTh}`, [
        { field: reviewText.audit.status, before: S("pending"), after: S("awaitingPayment") },
        { field: reviewText.audit.reply, before: null, after: replyLabel(r.replyCode) },
        ...(r.note ? [{ field: reviewText.audit.note, before: null, after: r.note }] : []),
        { field: reviewText.audit.payment, before: null, after: reviewText.audit.paymentValue(payment.id, payment.ref1) },
      ]);
      return true;
    },
    // ไม่อนุมัติ: ต้องเลือกข้อความตอบกลับประเภท "ไม่อนุมัติ" — คืน false ถ้าไม่ผ่านเงื่อนไข
    reject(ref, by) {
      const r = this.ensure(ref);
      if (r.decision || replyByCode[r.replyCode]?.type !== "reject") return false;
      const at = nowThaiIso();
      // แจ้งผู้ยื่นทางอีเมลอัตโนมัติ (G-06 · TOR 7.8.32) — ชั่วคราวจนกว่าจะมี API: backend ส่งอีเมลและบันทึกผลการส่ง
      const d = requestDetails[ref];
      const notification = emailNotice("rejected", { ref, company: d.exporter.nameTh, invoice: d.exporter.invoice }, at, {
        reason: replyLabel(r.replyCode),
        note: r.note,
      });
      r.decision = { type: "rejected", at, by, replyCode: r.replyCode, note: r.note, notification };
      r.events.unshift(
        emailEvent(notification),
        { event: "rejected", detail: reviewText.history.rejectedDetail(replyLabel(r.replyCode)), at, by }
      );
      useAuditStore().record("requests", "reject", `${ref} ${requestDetails[ref].exporter.nameTh}`, [
        { field: reviewText.audit.status, before: S("pending"), after: S("rejected") },
        { field: reviewText.audit.reply, before: null, after: replyLabel(r.replyCode) },
        ...(r.note ? [{ field: reviewText.audit.note, before: null, after: r.note }] : []),
      ]);
      return true;
    },
    // ยกเลิกการอนุมัติภายใน 15 นาที (TOR 4.4.2 (3)) — ยกเลิกคำสั่งชำระ คำขอกลับไปรอพิจารณา บันทึกเหตุผลลง Log
    undoApproval(ref, by, reason) {
      const r = this.ensure(ref);
      const deadline = this.undoDeadline(ref);
      if (!deadline || deadline <= Date.now()) return false;
      const at = nowThaiIso();
      const cancelled = usePaymentsStore().cancelOrder(ref, at, reason);
      r.decision = null;
      r.events.unshift({ event: "undone", detail: reviewText.history.undoneDetail(reason, cancelled?.id), at, by });
      useAuditStore().record("requests", "undoApprove", `${ref} ${requestDetails[ref].exporter.nameTh}`, [
        { field: reviewText.audit.status, before: S("awaitingPayment"), after: S("pending") },
        ...(cancelled
          ? [{ field: reviewText.audit.payment, before: reviewText.audit.paymentValue(cancelled.id, cancelled.ref1), after: reviewText.audit.paymentCancelled }]
          : []),
        { field: reviewText.audit.reason, before: null, after: reason },
      ]);
      return true;
    },
  },
});
