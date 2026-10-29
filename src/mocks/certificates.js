// ข้อมูลจำลองหน้า B-10 · ข้อมูลใบรับรองฯ (TOR 4.4.3) — สอดคล้องกับ mocks/requests.js และ mocks/payments.js
// eLicensing ใช้ key ใน eLicensingStatuses
import { requestDetails } from "./requests.js";
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

// สินค้าตัวอย่างของแต่ละบริษัท (ใช้สร้างตัวอย่างใบรับรองฯ ของรายการที่ไม่มีรายละเอียดฉบับเต็ม)
const p = (nameTh, nameEn, hs, source, sourceEn, qty) => ({ nameTh, nameEn, hs, source, sourceEn, qty });
const catalogue = {
  "บริษัท สยามฟรุ๊ต เอ็กซ์ปอร์ต จำกัด": [
    p("มะม่วงน้ำดอกไม้สด", "Fresh Mango (Nam Dok Mai)", "0804.50.20", "ฉะเชิงเทรา", "Chachoengsao", "1,000 CTN"),
    p("มังคุดสด", "Fresh Mangosteen", "0804.50.30", "จันทบุรี", "Chanthaburi", "500 CTN"),
    p("ลำไยอบแห้ง", "Dried Longan", "0813.40.10", "เชียงใหม่", "Chiang Mai", "300 CTN"),
  ],
  "บริษัท ไทยเฟรช ฟู้ด จำกัด": [
    p("ทุเรียนหมอนทองสด", "Fresh Durian (Monthong)", "0810.60.00", "จันทบุรี", "Chanthaburi", "900 CTN"),
    p("มะพร้าวน้ำหอม", "Aromatic Coconut", "0801.19.10", "ราชบุรี", "Ratchaburi", "1,500 CTN"),
  ],
  "บริษัท โกลเด้นไรซ์ เทรดดิ้ง จำกัด": [
    p("ข้าวหอมมะลิ", "Thai Hom Mali Rice", "1006.30.30", "สุรินทร์", "Surin", "2,000 BAG"),
    p("ข้าวกล้องหอมมะลิ", "Brown Hom Mali Rice", "1006.20.10", "ร้อยเอ็ด", "Roi Et", "800 BAG"),
  ],
  "บริษัท อันดามัน ซีฟู้ด จำกัด": [
    p("กุ้งขาวแช่แข็ง", "Frozen Vannamei Shrimp", "0306.17.19", "สุราษฎร์ธานี", "Surat Thani", "600 CTN"),
    p("ปลาหมึกแช่แข็ง", "Frozen Squid", "0307.43.10", "ภูเก็ต", "Phuket", "400 CTN"),
  ],
  "บริษัท เชียงใหม่ ออร์แกนิค จำกัด": [p("ผักสลัดออร์แกนิก", "Organic Lettuce", "0705.11.00", "เชียงใหม่", "Chiang Mai", "250 CTN")],
  "บริษัท ทรอปิคอล แพค จำกัด": [
    p("สับปะรดกระป๋อง", "Canned Pineapple", "2008.20.10", "ประจวบคีรีขันธ์", "Prachuap Khiri Khan", "1,200 CTN"),
    p("ข้าวโพดหวานกระป๋อง", "Canned Sweet Corn", "2005.80.00", "กาญจนบุรี", "Kanchanaburi", "700 CTN"),
  ],
  "ห้างหุ้นส่วนจำกัด ราชบุรี เวจจี้": [
    p("พริกสด", "Fresh Chili", "0709.60.10", "ราชบุรี", "Ratchaburi", "200 CTN"),
    p("กะเพราสด", "Fresh Holy Basil", "1211.90.99", "นครปฐม", "Nakhon Pathom", "120 CTN"),
  ],
  "บริษัท มหาชัย โฟรเซ่น จำกัด": [p("ปลาทูน่าแช่แข็ง", "Frozen Tuna Loin", "0304.87.00", "สมุทรสาคร", "Samut Sakhon", "500 CTN")],
};

const consignees = {
  ไต้หวัน: ["Formosa Fresh Trading Co., Ltd.", "Taiwan (TW)", "Taiwan", "THLCH แหลมฉบัง → TWKHH Kaohsiung"],
  ญี่ปุ่น: ["Tokyo Rice Wholesale K.K.", "Japan (JP)", "Japan", "THLCH แหลมฉบัง → JPTYO Tokyo"],
  ฮ่องกง: ["Ocean Mart (HK) Ltd.", "Hong Kong (HK)", "Hong Kong", "THLCH แหลมฉบัง → HKHKG Hong Kong"],
  มาเลเซีย: ["KL Organic Hub Sdn. Bhd.", "Malaysia (MY)", "Malaysia", "THSDO สะเดา → MYKUL Kuala Lumpur"],
  สิงคโปร์: ["Lion City Foods Pte. Ltd.", "Singapore (SG)", "Singapore", "THLCH แหลมฉบัง → SGSIN Singapore"],
  จีน: ["Shanghai Fresh Import Co., Ltd.", "China (CN)", "China", "THLCH แหลมฉบัง → CNSHA Shanghai"],
  เวียดนาม: ["Saigon Seafood JSC", "Vietnam (VN)", "Vietnam", "THBKK กรุงเทพ → VNSGN Ho Chi Minh"],
  เกาหลีใต้: ["Seoul Green Market Co., Ltd.", "South Korea (KR)", "South Korea", "THLCH แหลมฉบัง → KRPUS Busan"],
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
