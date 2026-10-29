// ข้อมูลจำลองหน้า B-10 · ข้อมูลใบรับรองฯ (TOR 4.4.3) — สร้างจาก mocks/requests.js จึงตรงกับการชำระเงิน / ใบเสร็จ
// eLicensing ใช้ key ใน eLicensingStatuses
import { catalogue, consignees, requestDetails, requests } from "./requests.js";
import { operators } from "./operators.js";

export const certificateToday = "2026-10-26";

// สถานะการส่งข้อมูลใบรับรองฯ ไประบบ e-Licensing กรมศุลกากร (ผ่าน ebXML Gateway)
export const eLicensingStatuses = {
  sent: { label: "ส่งแล้ว (ACK)", tone: "success" },
  pending: { label: "รอส่ง", tone: "warning" },
  failed: { label: "ส่งไม่สำเร็จ", tone: "danger" },
};

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

// ใบรับรองฯ ที่ออกแล้ว ใหม่ → เก่า (sentAt = วันเวลาที่ออกและส่งข้อมูลใบรับรองฯ)
// สร้างจากคำขอที่ไปถึงขั้น "ออกเลขที่ใบรับรอง" (requestDetails[ref].issued) — เลขที่ใบเสร็จตรงกับ mocks/receipts.js
export const certificates = requests
  .filter((r) => requestDetails[r.ref].issued)
  .map((r) => {
    const i = requestDetails[r.ref].issued;
    return c(i.certificate, r.ref, i.at, r.invoice, r.company, r.country, r.items, i.eLicensing, i.receipt);
  })
  .sort((a, b) => b.sentAt.localeCompare(a.sentAt));

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
