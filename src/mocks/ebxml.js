// ข้อมูลจำลองหน้า D16 · ติดตามการรับ-ส่งข้อความ ebXML (B-17 — ตาม Figma node 22:4793)
// Transaction Log สร้างจากคำขอใน mocks/requests.js (ประวัติสถานะ / คำสั่งชำระ / ใบรับรองฯ) และคำขอขึ้นทะเบียนใน mocks/thnsw.js
// จึงอ้างเฉพาะคำขอ / เลขที่อ้างอิงการชำระ / ทะเบียนที่มีอยู่จริง และมีข้อความเท่าที่คำขอนั้นไปถึง (คำขอรอพิจารณาไม่มีคำสั่งชำระ / ใบรับรองฯ)
// ชื่อข้อความตาม Flow 10 / 11 (mocks/message-types.js) · ทุกข้อความรับ-ส่งผ่าน NSW ด้วย CPA เดียว (Flow 3 / 10 / 11)
//   รวมคำสั่งชำระ (3.1) และผลชำระ (4.1) ที่ส่งผ่าน NSW ไปธนาคาร ไม่ส่งตรง — รอยืนยัน Q-10 (ชื่อข้อความฝั่งธนาคารตาม TOR 10.2)
// ชั่วคราวจนกว่าจะมี API: backend อ่าน Transaction Log จาก ebXML Gateway
import { banks } from "./banks.js";
import { messageTypes } from "./message-types.js";
import { paymentRow } from "./payments.js";
import { paymentRefOf, requestDetails, requests } from "./requests.js";
import { thnswDecided, thnswRequests } from "./thnsw.js";

export { messageTypes };

export const ebxmlToday = "2026-10-26";
export const ebxmlNow = "2026-10-26T11:24:30+07:00";
export const maxRetry = 5;

export const directions = {
  in: { label: "รับ", tone: "info" },
  out: { label: "ส่ง", tone: "accent" },
};

// สถานะของแต่ละครั้งที่ส่ง (ประวัติ Queue / Retry)
export const attemptStatuses = {
  success: { label: "สำเร็จ", tone: "success" },
  timeout: { label: "Timeout", tone: "danger" },
  scheduled: { label: "รอ", tone: "neutral" },
  waitAck: { label: "รอ ACK", tone: "info" },
  rejected: { label: "Signature ไม่ผ่าน", tone: "danger" },
};

// PartyId ของ DDC และ NSW ใน ebXML Header — ปลายทางจริง (ธนาคาร / e-Licensing / NSP) อยู่ใน Payload
const DDC = "DDC-PINKFORMS";
const NSW = "THNSW";
const NSW_CPA = "NSW_DDC_CPA_v2";

const BKK = 7 * 3600 * 1000;
const plus = (iso, s) => `${new Date(new Date(iso).getTime() + s * 1000 + BKK).toISOString().slice(0, 19)}+07:00`;
const clock = (iso) => iso.slice(11, 19);

// Message ID (UUID) แบบคงที่ต่อข้อความ — สร้างจาก seed เพื่อให้ข้อมูลจำลองเหมือนเดิมทุกครั้งที่โหลด
const hex = (seed) => {
  let h = 2166136261;
  let out = "";
  for (let round = 0; out.length < 32; round++) {
    for (const ch of `${seed}#${round}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    out += h.toString(16).padStart(8, "0");
  }
  return out;
};
const uuid = (seed) => {
  const x = hex(seed);
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-4${x.slice(13, 16)}-a${x.slice(17, 20)}-${x.slice(20, 32)}`;
};

// ประวัติการส่ง — in = รับข้อความ (ตอบ ebMS ACK) · out = ส่งครั้งที่ 1 · waitAck = ส่งแล้วรอ ACK · retry = Timeout แล้วรอส่งซ้ำ
const attemptsOf = (kind, at, signature) => {
  const t = clock(at);
  if (kind === "in") return [{ time: t, label: "รับข้อความ", status: signature ? "success" : "rejected" }];
  if (kind === "waitAck")
    return [
      { time: t, label: "ส่งครั้งที่ 1", status: "success" },
      { time: t, label: "รอการตอบรับ (ACK)", status: "waitAck" },
    ];
  if (kind === "retry")
    return [
      { time: t, label: "ส่งครั้งที่ 1", status: "timeout" },
      { time: clock(plus(at, 60)), label: "ส่งครั้งที่ 2", status: "timeout" },
      { time: clock(plus(at, 180)), label: "ส่งครั้งที่ 3", status: "timeout" },
      { time: clock(plus(at, 420)), label: "ส่งครั้งที่ 4 (กำหนดการ)", status: "scheduled" },
    ];
  return [{ time: t, label: "ส่งครั้งที่ 1", status: "success" }];
};
const statusOf = { in: "success", out: "success", waitAck: "waitAck", retry: "retry" };

// สร้างข้อความ 1 รายการ
// o: { requestRef, reference, at, kind, step?, note?, route, sender, receiver, signature? }
const msg = (typeKey, o) => {
  const type = messageTypes[typeKey];
  const direction = o.kind === "in" ? "in" : "out";
  const signature = o.signature ?? true;
  const id = uuid(`${o.reference}-${typeKey}-${o.step ?? ""}-${o.at}`);
  return {
    id,
    short: `${id.slice(0, 8)}...${id.slice(-4)}`,
    at: o.at,
    date: o.at.slice(0, 10),
    time: clock(o.at),
    type: typeKey,
    code: type.code,
    docType: type.code ?? type.label,
    step: o.step ?? type.step ?? "",
    note: o.note ?? "",
    direction,
    route: o.route,
    routeLabel: `${o.step ? `${o.step}. ` : ""}${type.code ?? type.label} · ${o.route}`,
    requestRef: o.requestRef,
    reference: o.reference,
    signature,
    status: signature ? statusOf[o.kind] : "error",
    ...(o.kind === "retry" ? { retry: 3 } : {}),
    header: {
      from: direction === "in" ? NSW : DDC,
      to: direction === "in" ? DDC : NSW,
      cpaId: NSW_CPA,
      conversationId: o.requestRef,
      service: type.service,
      action: type.action,
    },
    parties: { sender: o.sender, receiver: o.receiver },
    attempts: attemptsOf(o.kind, o.at, signature),
  };
};

// ---------- ข้อความของคำขอใบรับรองฯ (Flow 10 ข้อ 1 – 10 + กรณีไม่ผ่าน) ----------
const NSP = "NSP";
const fromNsp = "NSP → NSW → DDC";
const toNsp = "DDC → NSW → NSP";
const accept = (req, at, step, note) =>
  msg("DDCPFREQ_ACCEPT", { requestRef: req.ref, reference: req.ref, at, kind: "out", step, note, route: toNsp, sender: DDC, receiver: NSP });

// ข้อความคำสั่งชำระ / ผลชำระของคำขอ ผ่าน NSW ไป-กลับธนาคาร — payRef = เลขที่อ้างอิงการชำระ (แถวใน B-11)
const payMessage = (requestRef, payRef, bankCode) => {
  const bank = `${banks[bankCode]} (${bankCode})`;
  const bankParty = `BANK-${bankCode}`;
  return (typeKey, at, kind, note) =>
    msg(typeKey, {
      requestRef,
      reference: payRef,
      at,
      kind,
      note,
      route: kind === "in" ? `${bank} → NSW → DDC` : `DDC → NSW → ${bank}`,
      sender: kind === "in" ? bankParty : DDC,
      receiver: kind === "in" ? DDC : bankParty,
    });
};

function requestMessages(req) {
  const d = requestDetails[req.ref];
  const out = [];
  const receivedAt = plus(req.submittedAt, 10);
  out.push(
    msg("DDCPFREQ", {
      requestRef: req.ref,
      reference: req.ref,
      at: receivedAt,
      kind: "in",
      step: "1",
      route: fromNsp,
      sender: NSP,
      receiver: DDC,
      signature: d.signatureValid,
    })
  );
  // ข้อมูลไม่ถูกต้อง (ลายมือชื่อ / XML Schema) — แจ้งกลับแล้วสิ้นสุด
  if (req.status === "invalid") {
    out.push(accept(req, plus(d.decision.at, 5), "", "ข้อมูลไม่ถูกต้อง"));
    return out;
  }
  out.push(accept(req, plus(req.submittedAt, 20), "2", "อยู่ระหว่างดำเนินการ"));
  if (!d.decision) return out;
  if (d.decision.type === "rejected") {
    out.push(accept(req, plus(d.decision.at, 5), "", `เจ้าหน้าที่ไม่อนุมัติ · ${d.decision.replyCode}`));
    return out;
  }
  out.push(accept(req, plus(d.decision.at, 5), "3", "เจ้าหน้าที่อนุมัติ"));

  // คำสั่งชำระ / ผลชำระ ผ่าน NSW (Flow 10 ข้อ 3.1 / 4.1)
  const p = d.payment;
  const pay = payMessage(req.ref, paymentRefOf(req.ref), p.bankCode);
  out.push(pay("paymentOrder", p.orderedAt, "out"));
  out.push(accept(req, plus(p.orderedAt, 20), "4", "รอการชำระเงิน BILLPAYMENT"));
  if (p.status === "failed") {
    out.push(pay("paymentResult", p.failedAt, "in", "ชำระไม่สำเร็จ"));
    out.push(accept(req, plus(p.failedAt, 5), "", "ชำระเงินไม่สำเร็จ"));
    return out;
  }
  if (p.status !== "paid") return out;
  out.push(pay("paymentResult", p.paidAt, "in", "ชำระสำเร็จ"));
  out.push(accept(req, plus(p.paidAt, 5), "5", "ได้รับการชำระ BILLPAYMENT เรียบร้อยแล้ว"));

  // ใบรับรองฯ → e-Licensing ผ่าน NSW (ข้อ 6) — สถานะตามผลส่ง e-Licensing ในรายละเอียดคำขอ
  const i = d.issued;
  if (!i) return out;
  const certRef = (step, at, kind, route, receiver) =>
    msg("DDCPINKFORM", { requestRef: req.ref, reference: req.ref, at, kind, step, note: i.certificate, route, sender: DDC, receiver });
  const eLicKind = { sent: "out", pending: "waitAck", failed: "retry" }[i.eLicensing];
  out.push(certRef("6", plus(i.at, 12), eLicKind, "DDC → NSW → e-Licensing", "E-LICENSING"));

  // ใบเสร็จ + ใบรับรองฯ ให้ผู้ประกอบการ (ข้อ 7 – 8) และแจ้งปิดคำขอ (ข้อ 9 – 10)
  if (!["readyToDeliver", "completed"].includes(req.status)) return out;
  const deliveredAt = plus(p.paidAt, 30);
  out.push(
    msg("DDCRECEIPT", { requestRef: req.ref, reference: req.ref, at: deliveredAt, kind: "out", note: i.receipt, route: toNsp, sender: DDC, receiver: NSP })
  );
  out.push(certRef("8", plus(deliveredAt, 1), "out", toNsp, NSP));
  out.push(accept(req, plus(p.paidAt, 35), "9", "พร้อมจ่าย"));
  if (req.status === "completed") out.push(accept(req, d.history[0].at, "10", "เสร็จสมบูรณ์"));
  return out;
}

// ---------- ข้อความที่เกิดจากการพิจารณาในรอบใช้งานนี้ (B-06) ----------
// อ่านผลจาก stores/payments.js (orders) และ stores/review.js (records) — หน้า B-17 รวมกับ messages ด้านล่าง
// รูปแบบเดียวกับ requestMessages: อนุมัติ = แจ้งอนุมัติ (ข้อ 3) → คำสั่งชำระ (3.1) → แจ้งรอชำระ (ข้อ 4)
//   ไม่อนุมัติ = แจ้งไม่อนุมัติพร้อมรหัสข้อความตอบกลับ
//   ยกเลิกการอนุมัติ (สมมติฐาน — Flow 10 ยังไม่มีข้อความยกเลิก รอยืนยัน Q-10): ส่งคำสั่งชำระฉบับยกเลิกไปธนาคารผ่าน NSW
//   แล้วแจ้ง NSP ด้วย DDCPFREQ_ACCEPT ว่ายกเลิกการอนุมัติ คำขอกลับไปอยู่ระหว่างดำเนินการ (ข้อ 2)
// ชั่วคราวจนกว่าจะมี API: backend / ebXML Gateway สร้างข้อความเหล่านี้เองเมื่อบันทึกผลพิจารณา และหน้าจออ่านจาก Transaction Log
// orders = { [ref]: [{ orderedAt, bankCode, status, seq, cancelledAt? }] } · records = { [ref]: { decision } }
export function sessionMessages(orders = {}, records = {}) {
  const out = [];
  Object.entries(orders).forEach(([ref, list]) => {
    list.forEach((o) => {
      const req = { ref };
      const pay = payMessage(ref, paymentRow(ref, o, o.seq).id, o.bankCode);
      out.push(accept(req, plus(o.orderedAt, 5), "3", "เจ้าหน้าที่อนุมัติ"));
      out.push(pay("paymentOrder", plus(o.orderedAt, 10), "out"));
      out.push(accept(req, plus(o.orderedAt, 20), "4", "รอการชำระเงิน BILLPAYMENT"));
      if (o.status !== "cancelled") return;
      // ข้อความยกเลิกต้องตามหลังข้อความอนุมัติเสมอ (กรณียกเลิกทันทีภายในไม่กี่วินาที)
      const cancelAt = [o.cancelledAt, plus(o.orderedAt, 20)].sort().at(-1);
      out.push(pay("paymentOrder", plus(cancelAt, 5), "out", "ยกเลิกคำสั่งชำระ"));
      out.push(accept(req, plus(cancelAt, 10), "2", "ยกเลิกการอนุมัติ · อยู่ระหว่างดำเนินการ"));
    });
  });
  Object.entries(records).forEach(([ref, r]) => {
    const dec = r?.decision;
    if (dec?.type !== "rejected" || dec.seeded) return;
    out.push(accept({ ref }, plus(dec.at, 5), "", `เจ้าหน้าที่ไม่อนุมัติ · ${dec.replyCode}`));
  });
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

// ---------- ข้อความขึ้นทะเบียนผู้ใช้บริการ (Flow 6 ข้อ 2 / 7) ----------
function registerMessages(r) {
  const base = { requestRef: r.nswId, reference: r.nswId };
  const out = [
    msg("register", { ...base, at: r.receivedAt, kind: "in", route: "NSW → DDC", sender: NSW, receiver: DDC, signature: r.checks.signature.pass }),
  ];
  if (r.decision) {
    out.push(
      msg("registerResult", {
        ...base,
        at: plus(r.decidedAt, 5),
        kind: "out",
        note: r.decision === "approved" ? "อนุมัติ" : "ไม่อนุมัติ",
        route: "DDC → NSW",
        sender: DDC,
        receiver: NSW,
      })
    );
  }
  return out;
}

// ใหม่ → เก่า · ไม่มีข้อความหลังเวลาปัจจุบันของหน้า
export const messages = [...requests.flatMap(requestMessages), ...[...thnswRequests, ...thnswDecided].flatMap(registerMessages)]
  .filter((m) => m.at <= ebxmlNow)
  .sort((a, b) => b.at.localeCompare(a.at));

// ข้อมูล CPA (Collaboration Protocol Agreement) สำหรับ Dialog ตั้งค่า CPA (TOR 4.6.1 (1))
// ข้อความใน B-17 ใช้ NSW_DDC_CPA_v2 ทั้งหมด (ผ่าน NSW ตาม Flow 3 / 10) — CPA ของธนาคาร / e-Licensing คงไว้สำหรับกรณีเชื่อมตรง รอยืนยัน Q-10
export const cpas = [
  { id: "NSW_DDC_CPA_v2", partner: "THNSW", endpoint: "https://gw.nsw.example/ebms", retries: 5, interval: 60, signature: true, encryption: true },
  { id: "DDC_BANK014_CPA_v2", partner: "BANK-014", endpoint: "https://ebms.bank-b.example/inbound", retries: 5, interval: 60, signature: true, encryption: true },
  { id: "DDC_BANK006_CPA_v2", partner: "BANK-006", endpoint: "https://ebms.bank-a.example/inbound", retries: 5, interval: 60, signature: true, encryption: true },
  { id: "DDC_ELIC_CPA_v1", partner: "E-LICENSING", endpoint: "https://elicensing.example/ebms", retries: 3, interval: 120, signature: true, encryption: false },
];
