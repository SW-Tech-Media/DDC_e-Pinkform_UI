// ผลการพิจารณาคำขอ (D10 / D11) เก็บข้ามหน้า — Checklist, ข้อความตอบกลับ, ข้อมูลที่เจ้าหน้าที่แก้ไข,
// ผลอนุมัติ / ไม่อนุมัติ / ยกเลิกการอนุมัติ และเหตุการณ์ที่ใช้แสดงในประวัติสถานะ
import { defineStore } from "pinia";
import { checklistItems, defaultReplyCode, replyMessages, undoWindowMinutes } from "@/mocks/review.js";
import { requestDetails, requests } from "@/mocks/requests.js";
import { reviewText } from "@/content/review.js";

const statusByRef = Object.fromEntries(requests.map((r) => [r.ref, r.status]));

// คำขอที่มีผลแล้วในข้อมูลจำลอง (d.decision) เริ่มต้นด้วยผลนั้น — seeded = ไม่ได้บันทึกในรอบนี้ สถานะจึงตามข้อมูลจำลอง
const newRecord = (ref) => {
  const d = requestDetails[ref];
  const seeded = d?.decision ? { ...d.decision, seeded: true } : null;
  const note = d?.outbreakNote && !seeded ? reviewText.reply.defaultNote(d.outbreakNote.item, d.outbreakNote.freeAt) : "";
  return {
    checks: checklistItems.filter((c) => c.checked || seeded?.type === "approved").map((c) => c.id),
    replyCode: seeded ? (seeded.replyCode ?? null) : d?.outbreakNote ? defaultReplyCode : null,
    note,
    edits: { exporter: {}, consignee: {} },
    lastEdit: null,
    decision: seeded, // { type: 'approved' | 'rejected' | 'invalid', at, by, replyCode, note, seeded? }
    events: [], // ใหม่ → เก่า
  };
};

export const useReviewStore = defineStore("review", {
  state: () => ({ records: {} }),
  getters: {
    record: (state) => (ref) => state.records[ref],
    replyOf: () => (code) => replyMessages.find((r) => r.code === code) ?? null,
    // รายละเอียดคำขอหลังรวมข้อมูลที่เจ้าหน้าที่แก้ไข
    detailOf: (state) => (ref) => {
      const d = requestDetails[ref];
      if (!d) return null;
      const e = state.records[ref]?.edits ?? { exporter: {}, consignee: {} };
      return { ...d, exporter: { ...d.exporter, ...e.exporter }, consignee: { ...d.consignee, ...e.consignee } };
    },
    // สถานะปัจจุบัน (key ใน requestStatuses) — ผลที่เจ้าหน้าที่บันทึกในรอบนี้มาก่อนสถานะในข้อมูลจำลอง
    statusOf: (state) => (ref) => {
      const dec = state.records[ref]?.decision;
      return dec && !dec.seeded ? dec.type : statusByRef[ref];
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
    saveEdits(ref, edits, by, changedLabels) {
      const r = this.ensure(ref);
      r.edits = { exporter: { ...r.edits.exporter, ...edits.exporter }, consignee: { ...r.edits.consignee, ...edits.consignee } };
      const at = new Date().toISOString();
      r.lastEdit = { at, by };
      if (changedLabels.length) {
        r.events.unshift({ event: "edited", detail: reviewText.history.editedDetail(changedLabels.join(", ")), at, by });
      }
    },
    approve(ref, by) {
      const r = this.ensure(ref);
      const at = new Date().toISOString();
      r.decision = { type: "approved", at, by, replyCode: r.replyCode, note: r.note };
      r.events.unshift({
        event: "approved",
        detail: reviewText.history.approvedDetail(r.checks.length, checklistItems.length),
        at,
        by,
      });
    },
    reject(ref, by) {
      const r = this.ensure(ref);
      const at = new Date().toISOString();
      r.decision = { type: "rejected", at, by, replyCode: r.replyCode, note: r.note };
      const reply = this.replyOf(r.replyCode);
      r.events.unshift({
        event: "rejected",
        detail: reviewText.history.rejectedDetail(reply ? reviewText.reply.item(reply) : r.note),
        at,
        by,
      });
    },
    undoApproval(ref, by, reason) {
      const r = this.ensure(ref);
      r.decision = null;
      r.events.unshift({ event: "undone", detail: reviewText.history.undoneDetail(reason), at: new Date().toISOString(), by });
    },
  },
});
