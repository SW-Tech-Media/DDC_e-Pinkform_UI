// ข้อมูลจำลองของหน้า Portal (Figma D01 · D02 · D03) — ตัวเลขตามดีไซน์

// ---------- D01 · หน้าแรก ----------
export const homeStats = [
  { key: "certificates", value: 18452, label: "ใบรับรองฯ ที่ออกในปี 2569", short: "ใบรับรองฯ ปีนี้" },
  { key: "operators", value: 1236, label: "ผู้ประกอบการที่ลงทะเบียน", short: "ผู้ประกอบการ" },
  { key: "countries", value: 42, label: "ประเทศปลายทาง", short: "ประเทศ" },
  { key: "lead-time", value: "< 1 วัน", label: "ระยะเวลาดำเนินการเฉลี่ย", short: "เฉลี่ยต่อคำขอ", desktopOnly: true },
];

// tone = สีพื้นภาพปก (primary · accent · info)
export const news = [
  {
    id: "N001",
    category: "ประชาสัมพันธ์",
    date: "2026-10-20",
    title: "เปิดให้บริการระบบ DDC e-Pinkforms รูปแบบใหม่ ผ่าน National Single Window",
    icon: "fas fa-globe",
    cover: "primary",
  },
  {
    id: "N002",
    category: "ประกาศ",
    date: "2026-10-18",
    title: "ประกาศพื้นที่เฝ้าระวังโรคระบาด จังหวัดจันทบุรี และจังหวัดตาก",
    icon: "far fa-map",
    cover: "accent",
  },
  {
    id: "N003",
    category: "อบรม",
    date: "2026-10-10",
    title: "เชิญผู้ประกอบการ ธนาคาร NSP และ Gateway เข้าร่วมประชุมเชิงปฏิบัติการ",
    icon: "fas fa-user-group",
    cover: "info",
  },
];

// ---------- D02 · Dashboard ----------
export const dashboardUpdatedAt = "2026-10-26T11:00:00";
export const dashboardYears = [2569, 2568, 2567];
export const monthLabels = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export const quarterLabels = ["ไตรมาส 1", "ไตรมาส 2", "ไตรมาส 3", "ไตรมาส 4"];

// คำขอ / ใบรับรองฯ รายเดือน (ปี 2569 มีถึง ต.ค.)
export const monthlyStats = {
  2569: {
    requests: [1620, 1590, 1910, 2230, 2480, 2170, 1930, 1760, 1720, 1700],
    certificates: [1580, 1540, 1860, 2180, 2440, 2100, 1890, 1700, 1650, 1512],
  },
  2568: {
    requests: [1480, 1450, 1720, 2010, 2260, 1980, 1760, 1640, 1590, 1590, 1530, 1655],
    certificates: [1420, 1390, 1660, 1950, 2190, 1920, 1700, 1580, 1530, 1540, 1480, 1600],
  },
  2567: {
    requests: [1360, 1340, 1590, 1860, 2080, 1820, 1620, 1510, 1460, 1470, 1420, 1530],
    certificates: [1300, 1280, 1520, 1790, 2010, 1760, 1560, 1450, 1400, 1410, 1360, 1470],
  },
};

// ยอดรวมรายปี (ย้อนหลัง 5 ปี)
export const yearlyTotals = [
  { year: 2565, requests: 14210, certificates: 13650 },
  { year: 2566, requests: 15880, certificates: 15120 },
  { year: 2567, requests: 19060, certificates: 18310 },
  { year: 2568, requests: 20665, certificates: 19960 },
  { year: 2569, requests: 19110, certificates: 18452 },
];

// ผู้ประกอบการ / ประเทศ / แนวโน้ม ของแต่ละปี
export const yearSummary = {
  2569: { direct: 1018, agent: 218, countries: 42, trend: 6.2 },
  2568: { direct: 962, agent: 196, countries: 40, trend: 8.4 },
  2567: { direct: 901, agent: 174, countries: 38, trend: 20.0 },
};
export const fiveYearSummary = { direct: 1102, agent: 251, countries: 47, trend: 34.5 };

// อันดับประเทศปลายทาง (ปี 2569)
export const countryRanking = [
  { name: "จีน", value: 5120 },
  { name: "ไต้หวัน", value: 3864 },
  { name: "ฮ่องกง", value: 2410 },
  { name: "ญี่ปุ่น", value: 1955 },
  { name: "มาเลเซีย", value: 1408 },
  { name: "สิงคโปร์", value: 1102 },
  { name: "เวียดนาม", value: 876 },
  { name: "เกาหลีใต้", value: 642 },
];

// สินค้าที่ส่งออกมากที่สุด (ปี 2569) — ใช้เป็นตัวเลือก "ประเภทสินค้า" ด้วย
export const productRanking = [
  { name: "ทุเรียนสด", value: 4210 },
  { name: "มังคุดสด", value: 2980 },
  { name: "มะม่วงสด", value: 2455 },
  { name: "ลำไยอบแห้ง", value: 1830 },
  { name: "ข้าวหอมมะลิ", value: 1512 },
  { name: "มะพร้าวน้ำหอม", value: 1104 },
];

// ---------- D02 / D03 · สถิติพื้นที่โรคระบาด (จำนวนตำบล) ----------
export const outbreakMonthly = {
  2569: [0, 1, 0, 2, 1, 1, 2, 1, 2, 1, 0, 0],
  2568: [1, 0, 2, 1, 2, 3, 1, 2, 3, 2, 0, 0],
};
export const outbreakFiveYears = [
  { year: 2565, value: 14 },
  { year: 2566, value: 22 },
  { year: 2567, value: 9 },
  { year: 2568, value: 17 },
  { year: 2569, value: 11 },
];

// ---------- D03 · พื้นที่โรคระบาด ----------
// วันที่อ้างอิงของข้อมูล (ตาม Figma) — ใช้คำนวณจำนวนวันที่เหลือจนปลอดโรค
export const outbreakAsOf = "2026-10-26";
// ระยะเวลาปลอดโรคนับจากวันที่เกิดโรค
export const outbreakFreeDays = 21;

// จังหวัด → อำเภอ → ตำบล · outbreak = วันที่เกิดโรค (ไม่มี = ไม่อยู่ในพื้นที่โรคระบาด)
export const areas = [
  {
    name: "จันทบุรี",
    districts: [
      {
        name: "เมืองจันทบุรี",
        subdistricts: [{ name: "ท่าช้าง", outbreak: "2026-10-12" }, { name: "วัดใหม่" }, { name: "ตลาด" }, { name: "พลับพลา" }],
      },
      { name: "ท่าใหม่", subdistricts: [{ name: "เขาแก้ว" }, { name: "ทุ่งเบญจา" }] },
      { name: "ขลุง", subdistricts: [{ name: "ขลุง" }, { name: "บ่อ" }] },
    ],
  },
  {
    name: "ตาก",
    districts: [
      { name: "แม่สอด", subdistricts: [{ name: "ท่าสายลวด", outbreak: "2026-10-08" }, { name: "แม่ตาว" }, { name: "พระธาตุผาแดง" }] },
      { name: "เมืองตาก", subdistricts: [{ name: "ระแหง" }, { name: "หนองหลวง" }] },
    ],
  },
  {
    name: "ระนอง",
    districts: [
      { name: "เมืองระนอง", subdistricts: [{ name: "ปากน้ำ", outbreak: "2026-10-21" }, { name: "เขานิเวศน์" }, { name: "บางริ้น" }] },
      { name: "กระบุรี", subdistricts: [{ name: "น้ำจืด" }, { name: "ปากจั่น" }] },
    ],
  },
  {
    name: "เชียงใหม่",
    districts: [
      { name: "แม่ริม", subdistricts: [{ name: "ริมใต้" }, { name: "ริมเหนือ" }, { name: "สันโป่ง" }] },
      { name: "สันทราย", subdistricts: [{ name: "สันทรายหลวง" }, { name: "หนองหาร" }] },
    ],
  },
  {
    name: "ระยอง",
    districts: [
      { name: "แกลง", subdistricts: [{ name: "ทางเกวียน" }, { name: "วังหว้า" }] },
      { name: "เมืองระยอง", subdistricts: [{ name: "ท่าประดู่" }, { name: "เชิงเนิน" }] },
    ],
  },
];

// ค่าเริ่มต้นของหน้า D03 (ตาม Figma)
export const outbreakDefault = { province: "จันทบุรี", district: "เมืองจันทบุรี", subdistrict: "ท่าช้าง" };
