// ข้อมูลจำลองหน้า B-10 · ข้อมูลใบรับรองฯ (TOR 4.4.3) — สอดคล้องกับ mocks/requests.js และ mocks/payments.js
// eLicensing ใช้ key ใน eLicensingStatuses
import { catalogue, consignees, requestDetails } from "./requests.js";
import { operators } from "./operators.js";

export const certificateToday = "2026-10-26";

// สถานะการส่งข้อมูลใบรับรองฯ ไประบบ e-Licensing กรมศุลกากร (ผ่าน ebXML Gateway)
export const eLicensingStatuses = {
  sent: { label: "ส่งแล้ว (ACK)", tone: "success" },
  pending: { label: "รอส่ง", tone: "warning" },
  failed: { label: "ส่งไม่สำเร็จ", tone: "danger" },
};

export const certificateKpis = [
  { key: "today", icon: "fas fa-award", tone: "pink", label: "ออกวันนี้", value: 41, caption: "ฉบับ · ณ 11:20 น." },
  { key: "month", icon: "far fa-calendar", tone: "teal", label: "เดือนนี้ (ต.ค. 2569)", value: 1286, caption: "เพิ่มขึ้น 8% จากเดือนก่อน" },
  { key: "year", icon: "fas fa-chart-column", tone: "blue", label: "ปีนี้ (2569)", value: 12904, caption: "ปีงบประมาณ 2569" },
  { key: "eLicensing", icon: "fas fa-arrow-right-arrow-left", tone: "green", label: "ส่ง e-Licensing แล้ววันนี้", value: 39, caption: "รอส่ง 1 · ไม่สำเร็จ 1" },
];

const operatorByName = Object.fromEntries(operators.map((o) => [o.nameTh, o]));

const c = (certNo, ref, sentAt, invoice, company, country, items, eLicensing = "sent", receiptNo = "") => ({
  id: certNo,
  certNo,
  ref,
  sentAt,
  invoice,
  company,
  companyEn: operatorByName[company]?.nameEn ?? "",
  taxId: operatorByName[company]?.taxId ?? "",
  country,
  items,
  eLicensing,
  receiptNo,
});

// ใบรับรองฯ ที่ออกแล้ว ใหม่ → เก่า (sentAt = วันเวลาที่ส่งข้อมูลใบรับรองฯ)
export const certificates = [
  c("DDC-PF 69/012847", "PF6910260018", "2026-10-26T10:22:05", "INV-6910-1059", "บริษัท ทรอปิคอล แพค จำกัด", "สิงคโปร์", 3, "pending", "R69-0104414"),
  c("DDC-PF 69/012845", "PF6910260003", "2026-10-26T10:02:41", "INV-6910-1024", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "ไต้หวัน", 4, "sent", "R69-0104412"),
  c("DDC-PF 69/012844", "PF6910260012", "2026-10-26T09:59:10", "INV-6910-1045", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ฮ่องกง", 3, "sent", "R69-0104411"),
  c("DDC-PF 69/012843", "PF6910260009", "2026-10-26T09:45:02", "INV-6910-1038", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "ญี่ปุ่น", 6, "sent", "R69-0104410"),
  c("DDC-PF 69/012840", "PF6910250185", "2026-10-26T08:56:12", "INV-6910-0991", "บริษัท เชียงใหม่ ออร์แกนิค จำกัด", "มาเลเซีย", 1, "failed", "R69-0104407"),
  c("DDC-PF 69/012838", "PF6910250181", "2026-10-26T08:37:30", "INV-6910-0985", "บริษัท ทรอปิคอล แพค จำกัด", "สิงคโปร์", 2, "sent", "R69-0104405"),
  c("DDC-PF 69/012831", "PF6910250172", "2026-10-25T15:40:18", "INV-6910-0962", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "จีน", 2, "sent", "R69-0104398"),
  c("DDC-PF 69/012826", "PF6910250160", "2026-10-25T14:05:44", "INV-6910-0950", "บริษัท มหาชัย โฟรเซ่น จำกัด", "เวียดนาม", 1, "sent", "R69-0104391"),
  c("DDC-PF 69/012819", "PF6910250144", "2026-10-25T11:12:09", "INV-6910-0936", "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด", "ไต้หวัน", 3, "sent", "R69-0104384"),
  c("DDC-PF 69/012802", "PF6910240098", "2026-10-24T16:20:33", "INV-6910-0904", "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้", "เกาหลีใต้", 2, "sent", "R69-0104367"),
  c("DDC-PF 69/012788", "PF6910240071", "2026-10-24T10:48:51", "INV-6910-0881", "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด", "ญี่ปุ่น", 2, "sent", "R69-0104353"),
  c("DDC-PF 69/012745", "PF6910200033", "2026-10-20T13:31:27", "INV-6910-0802", "บริษัท อันดามัน ซีฟู้ด จำกัด", "ฮ่องกง", 1, "sent", "R69-0104310"),
  c("DDC-PF 69/012703", "PF6910150012", "2026-10-15T09:14:06", "INV-6910-0733", "บริษัท ไทยเฟรช ฟู้ด จำกัด", "จีน", 2, "sent", "R69-0104268"),
];

// รายละเอียดสำหรับแสดงตัวอย่างใบรับรองฯ (รูปแบบเดียวกับ requestDetails ใช้กับ review/CertificatePreview)
export function certificateDetail(cert) {
  if (requestDetails[cert.ref]) return requestDetails[cert.ref];
  const goods = catalogue[cert.company] ?? [];
  const [consignee, country, countryEn, route] = consignees[cert.country];
  const day = cert.sentAt.slice(0, 10);
  return {
    ref: cert.ref,
    exporter: { nameTh: cert.company, nameEn: cert.companyEn, invoice: cert.invoice, invoiceDate: day },
    consignee: { name: consignee, country, countryEn, route, portOfLoading: route.split(" → ")[0] },
    items: Array.from({ length: cert.items }, (_, i) => ({ ...goods[i % goods.length], producedAt: day })),
  };
}
