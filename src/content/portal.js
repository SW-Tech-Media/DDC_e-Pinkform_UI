// ข้อความของหน้า Portal (Figma D01 · D02 · D03 และมือถือ S01 · S02)
// ตัวเลข / ข้อมูลจำลองอยู่ที่ src/mocks/portal.js

const crumbHome = { title: "หน้าแรก", to: { name: "portal-home" } };

// ---------- D01 / S01 · หน้าแรก ----------
export const homeText = {
  hero: {
    tag: "บริการอิเล็กทรอนิกส์ผ่าน National Single Window",
    tagShort: "บริการผ่าน National Single Window",
    titleLines: ["ใบรับรองแหล่งผลิต", "แหล่งกำเนิดอาหารปลอดโรค"],
    titleAccent: "(Pinkforms)",
    description: [
      "ยื่นคำขอ ชำระค่าบริการ และรับใบรับรองฯ แบบไร้เอกสาร",
      "เพื่อใช้ประกอบพิธีการศุลกากรสำหรับการส่งออกอาหาร ผัก และผลไม้",
    ],
    descriptionShort: "ยื่นคำขอ ชำระเงิน และรับใบรับรองฯ แบบไร้เอกสาร",
    primary: { label: "ขั้นตอนการขอใบรับรองฯ", to: { name: "portal-home", hash: "#steps" } },
    secondary: { label: "ตรวจสอบพื้นที่โรคระบาด", icon: "far fa-map", to: { name: "portal-outbreak" } },
  },
  // ภาพประกอบใบรับรองจำลอง
  illustration: {
    certTitle: ["CERTIFICATE OF DISEASE-FREE", "FOOD PRODUCTION SOURCE"],
    signed: "Digitally Signed",
    signer: "Authorized Officer",
    issued: { title: "ออกใบรับรองฯ เรียบร้อย", caption: "สถานะคำขอ" },
    nsw: { title: "National Single Window", caption: "ส่งข้อมูลผ่าน" },
  },
  steps: {
    title: "ขั้นตอนการขอใบรับรองฯ",
    subtitle: "ผู้ประกอบการดำเนินการผ่านระบบ NSW ไม่ต้องเดินทางมายื่นเอกสาร",
    items: [
      {
        no: "01",
        icon: "fas fa-user-check",
        tone: "teal",
        title: "ลงทะเบียนผู้ใช้บริการ",
        description: "สมัครสมาชิก NSW และเพิ่มบริการ Pinkforms พร้อมเลือกผู้ให้บริการ NSP",
        mobileTitle: "ลงทะเบียนผ่าน NSW",
        mobileDescription: "เพิ่มบริการ Pinkforms และเลือก NSP",
      },
      {
        no: "02",
        icon: "far fa-paper-plane",
        tone: "teal",
        title: "ยื่นคำขอผ่าน NSP",
        description: "ส่งคำขอใบรับรองฯ แบบอิเล็กทรอนิกส์พร้อมลายมือชื่อดิจิทัล ผ่านระบบ NSW",
        mobileTitle: "ยื่นคำขอผ่าน NSP",
        mobileDescription: "พร้อมลายมือชื่อดิจิทัล",
      },
      {
        no: "03",
        icon: "far fa-credit-card",
        tone: "teal",
        title: "ชำระค่าบริการ",
        description: "ชำระผ่าน Mobile Banking, Internet Banking หรือ Counter Service",
        mobileTitle: "ชำระค่าบริการ",
        mobileDescription: "Mobile / Internet Banking / Counter",
      },
      {
        no: "04",
        icon: "fas fa-award",
        tone: "pink",
        title: "รับใบรับรองฯ",
        description: "รับใบรับรองฯ และใบเสร็จอิเล็กทรอนิกส์ ใช้อ้างอิงในใบขนสินค้า e-Customs",
        mobileTitle: "รับใบรับรองฯ",
        mobileDescription: "ใบรับรองฯ และใบเสร็จอิเล็กทรอนิกส์",
      },
    ],
  },
  news: {
    title: "ข่าวประชาสัมพันธ์",
    subtitle: "ข่าวสารและประกาศล่าสุดจากกองโรคติดต่อทั่วไป",
    viewAll: "ดูทั้งหมด",
    readMore: "อ่านต่อ",
    to: { name: "portal-news" },
  },
  // Quick Links ท้ายหน้า (เดสก์ท็อป)
  quickLinks: [
    { icon: "fas fa-scale-balanced", title: "กฎหมายที่เกี่ยวข้อง", caption: "พ.ร.บ. ประกาศ และระเบียบ", to: { name: "portal-laws" } },
    { icon: "fas fa-book", title: "คู่มือการใช้งาน", caption: "สำหรับผู้ประกอบการ", to: { name: "portal-laws", query: { tab: "manual" } } },
    { icon: "fas fa-clipboard-check", title: "แบบสอบถาม", caption: "ประเมินความพึงพอใจ", to: { name: "portal-survey" } },
    { icon: "fas fa-mobile-screen", title: "ติดต่อเจ้าหน้าที่", caption: "กองโรคติดต่อทั่วไป", to: { name: "portal-laws" } },
  ],
  // เมนูลัดแบบ Tile (มือถือ S01)
  mobileTiles: [
    { icon: "far fa-map", tone: "pink", title: "พื้นที่โรคระบาด", to: { name: "portal-outbreak" } },
    { icon: "fas fa-chart-column", tone: "teal", title: "Dashboard", to: { name: "portal-dashboard" } },
    { icon: "fas fa-scale-balanced", tone: "blue", title: "กฎหมาย", to: { name: "portal-laws" } },
    { icon: "fas fa-clipboard-check", tone: "green", title: "แบบสอบถาม", to: { name: "portal-survey" } },
  ],
  cookie: {
    message:
      "เว็บไซต์นี้ใช้คุกกี้ เพื่อพัฒนาการให้บริการและนับจำนวนผู้เข้าชม ท่านสามารถเลือกยอมรับหรือปฏิเสธคุกกี้ที่ไม่จำเป็นได้",
    policy: "อ่านนโยบายคุกกี้",
    policyTo: { name: "portal-cookies" },
    settings: "ตั้งค่าคุกกี้",
    reject: "ปฏิเสธ",
    accept: "ยอมรับทั้งหมด",
  },
};

// ตัวเลือกช่วงข้อมูล (ใช้ทั้ง D02 และ D03)
export const rangeOptions = [
  { value: "monthly", label: "รายเดือน" },
  { value: "yearly", label: "รายปี" },
  { value: "fiveYears", label: "ย้อนหลัง 5 ปี" },
];

// ---------- D02 · Dashboard ----------
export const dashboardText = {
  title: "Dashboard สถิติใบรับรองฯ",
  description: (updated) => `ข้อมูลการให้บริการใบรับรองแหล่งผลิตแหล่งกำเนิดอาหารปลอดโรค · อัปเดตล่าสุด ${updated} น.`,
  breadcrumb: [crumbHome, { title: "Dashboard" }],
  filter: {
    range: "ช่วงข้อมูล",
    year: (y) => `ปี พ.ศ. ${y}`,
    allProducts: "ทุกประเภทสินค้า",
    download: "ดาวน์โหลดข้อมูล",
    downloaded: "จำลองการดาวน์โหลดไฟล์ข้อมูลสถิติ (.xlsx) เรียบร้อย",
  },
  kpi: {
    requests: { icon: "far fa-file-lines", tone: "teal", label: "จำนวนการยื่นคำขอ", trendText: "เทียบช่วงเดียวกันปีก่อน" },
    certificates: { icon: "fas fa-award", tone: "pink", label: "ใบรับรองฯ ที่ออกแล้ว", caption: (pct) => `คิดเป็น ${pct}% ของคำขอ` },
    operators: { icon: "far fa-building", tone: "blue", label: "ผู้ประกอบการที่ขอใบรับรองฯ", caption: (n) => `ลงทะเบียน ${n}` },
    countries: { icon: "fas fa-globe", tone: "green", label: "ประเทศปลายทาง", caption: "ประเทศ" },
  },
  requestsChart: {
    title: {
      monthly: (y) => `จำนวนคำขอและใบรับรองฯ รายเดือน`,
      yearly: (y) => `จำนวนคำขอและใบรับรองฯ รายไตรมาส ปี ${y}`,
      fiveYears: () => "จำนวนคำขอและใบรับรองฯ ย้อนหลัง 5 ปี",
    },
    requests: "คำขอ",
    certificates: "ใบรับรองฯ",
  },
  countries: { title: "ใบรับรองฯ ตามประเทศผู้รับสินค้าปลายทาง" },
  products: { title: "สินค้าที่ส่งออกมากที่สุด", chip: "จำนวนใบรับรองฯ" },
  operators: { title: "ผู้ประกอบการที่ขอใบรับรองฯ", unit: "ราย", direct: "ลงทะเบียนโดยตรง", agent: "ร่วมผูกสัมพันธ์ (ตัวแทน)" },
  outbreak: {
    title: "พื้นที่โรคระบาดย้อนหลัง 5 ปี",
    more: "ดูรายละเอียด",
    to: { name: "portal-outbreak" },
    series: "พื้นที่โรคระบาด",
    axis: "จำนวนพื้นที่ (ตำบล) ที่ได้รับรายงาน",
  },
};

// ---------- D03 / S02 · ตรวจสอบพื้นที่โรคระบาด ----------
export const outbreakText = {
  title: "ตรวจสอบข้อมูลพื้นที่โรคระบาด",
  titleMobile: "ตรวจสอบพื้นที่โรคระบาด",
  description: "ตรวจสอบแหล่งผลิตก่อนยื่นคำขอใบรับรองฯ · ข้อมูลจากกองระบาดวิทยา กรมควบคุมโรค",
  breadcrumb: [crumbHome, { title: "พื้นที่โรคระบาด" }],
  form: {
    province: "จังหวัด",
    district: "อำเภอ",
    subdistrict: "ตำบล",
    provincePlaceholder: "เลือกจังหวัด",
    districtPlaceholder: "เลือกอำเภอ",
    subdistrictPlaceholder: "เลือกตำบล",
    submit: "ตรวจสอบ",
    hint: "เลือกจังหวัด อำเภอ และตำบล แล้วกด “ตรวจสอบ” เพื่อดูสถานะพื้นที่",
  },
  place: (sub, dist, prov) => `ต.${sub} อ.${dist} จ.${prov}`,
  found: {
    status: "อยู่ในพื้นที่โรคระบาด",
    detail: (reported, free, days) =>
      `พบรายงานโรคระบาดเมื่อ ${reported} · คาดว่าจะปลอดโรคในวันที่ ${free} (นับจากวันที่เกิดโรค ${days} วัน)`,
    detailMobile: (reported, free) => `เกิดโรค ${reported} · ปลอดโรค ${free}`,
    daysLabel: "วันจะปลอดโรค",
    daysLabelMobile: "จะปลอดโรคในอีก",
    daysUnit: "วัน",
  },
  notFound: {
    status: "ไม่อยู่ในพื้นที่โรคระบาด",
    detail: "ไม่พบรายงานโรคระบาดในพื้นที่นี้ สามารถยื่นคำขอใบรับรองฯ สำหรับแหล่งผลิตในพื้นที่นี้ได้",
  },
  table: {
    title: "พื้นที่ที่ยังไม่ปลอดโรคระบาด",
    titleMobile: (n) => `พื้นที่ที่ยังไม่ปลอดโรค (${n})`,
    count: (n) => `${n} พื้นที่`,
    headers: [
      { title: "#", key: "no", sortable: false },
      { title: "จังหวัด", key: "province", sortable: false },
      { title: "อำเภอ", key: "district", sortable: false },
      { title: "ตำบล", key: "subdistrict", sortable: false },
      { title: "วันที่เกิดโรค", key: "reportedAt", sortable: false },
      { title: "วันที่ปลอดโรค", key: "freeAt", sortable: false },
      { title: "สถานะ", key: "status", sortable: false },
    ],
    remaining: (n) => `อีก ${n} วัน`,
    remainingShort: (n) => `${n} วัน`,
    areaName: (sub, dist) => `ต.${sub} อ.${dist}`,
    freeShort: (prov, free) => `จ.${prov} · ปลอดโรค ${free}`,
    note: "พื้นที่จะถูกนำออกจากรายการโดยอัตโนมัติเมื่อครบกำหนดวันที่ปลอดโรคระบาด",
  },
  stats: {
    title: "สถิติพื้นที่โรคระบาด",
    year: (y) => `ปี ${y}`,
    total: "จำนวนพื้นที่",
    axis: "จำนวนพื้นที่ (ตำบล) ที่ได้รับรายงาน",
  },
};
