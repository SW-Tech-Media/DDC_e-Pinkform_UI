// ข้อมูลจำลองหน้า D14 · ข้อมูลพื้นที่โรคระบาด (ตาม Figma node 20:3753)

// วันที่อ้างอิงของ Prototype (ใช้คำนวณ "อีก N วัน")
export const outbreakToday = "2026-10-26";
export const outbreakNow = "2026-10-26T11:20:00";

// จำนวนวันนับจากวันที่เกิดโรคระบาดจนถึงวันที่ปลอดโรค
export const diseaseFreeDays = 21;

// ข้อมูลหลักจังหวัด → อำเภอ → ตำบล (รหัสตามกรมการปกครอง)
export const geography = [
  {
    code: "22",
    name: "จันทบุรี",
    districts: [
      {
        code: "2201",
        name: "เมืองจันทบุรี",
        subdistricts: [
          { code: "220101", name: "ตลาด" },
          { code: "220102", name: "วัดใหม่" },
          { code: "220103", name: "คลองนารายณ์" },
          { code: "220104", name: "ท่าช้าง" },
          { code: "220105", name: "บางกะจะ" },
        ],
      },
      {
        code: "2202",
        name: "ขลุง",
        subdistricts: [
          { code: "220201", name: "ขลุง" },
          { code: "220202", name: "บ่อ" },
        ],
      },
      {
        code: "2203",
        name: "ท่าใหม่",
        subdistricts: [
          { code: "220301", name: "ท่าใหม่" },
          { code: "220302", name: "ยายร้า" },
        ],
      },
    ],
  },
  {
    code: "63",
    name: "ตาก",
    districts: [
      {
        code: "6301",
        name: "เมืองตาก",
        subdistricts: [
          { code: "630101", name: "ระแหง" },
          { code: "630102", name: "หนองหลวง" },
        ],
      },
      {
        code: "6306",
        name: "แม่สอด",
        subdistricts: [
          { code: "630601", name: "แม่สอด" },
          { code: "630602", name: "แม่กุ" },
          { code: "630605", name: "ท่าสายลวด" },
        ],
      },
    ],
  },
  {
    code: "85",
    name: "ระนอง",
    districts: [
      {
        code: "8501",
        name: "เมืองระนอง",
        subdistricts: [
          { code: "850101", name: "เขานิเวศน์" },
          { code: "850102", name: "ราชกรูด" },
          { code: "850106", name: "ปากน้ำ" },
        ],
      },
      {
        code: "8505",
        name: "กะเปอร์",
        subdistricts: [{ code: "850501", name: "เชี่ยวเหลียง" }],
      },
    ],
  },
  {
    code: "74",
    name: "สมุทรสาคร",
    districts: [
      {
        code: "7401",
        name: "เมืองสมุทรสาคร",
        subdistricts: [
          { code: "740101", name: "มหาชัย" },
          { code: "740102", name: "ท่าฉลอม" },
          { code: "740103", name: "โกรกกราก" },
        ],
      },
      {
        code: "7402",
        name: "กระทุ่มแบน",
        subdistricts: [{ code: "740201", name: "ตลาดกระทุ่มแบน" }],
      },
    ],
  },
  {
    code: "90",
    name: "สงขลา",
    districts: [
      {
        code: "9011",
        name: "หาดใหญ่",
        subdistricts: [
          { code: "901101", name: "หาดใหญ่" },
          { code: "901102", name: "ควนลัง" },
          { code: "901103", name: "คอหงส์" },
        ],
      },
      {
        code: "9001",
        name: "เมืองสงขลา",
        subdistricts: [{ code: "900101", name: "บ่อยาง" }],
      },
    ],
  },
  {
    code: "71",
    name: "กาญจนบุรี",
    districts: [
      {
        code: "7108",
        name: "สังขละบุรี",
        subdistricts: [
          { code: "710801", name: "หนองลู" },
          { code: "710802", name: "ปรังเผล" },
        ],
      },
      {
        code: "7101",
        name: "เมืองกาญจนบุรี",
        subdistricts: [{ code: "710101", name: "บ้านเหนือ" }],
      },
    ],
  },
];

// รายการพื้นที่โรคระบาด — วันที่ปลอดโรคคำนวณจาก occurredOn + 21 วัน
export const outbreakAreas = [
  {
    id: 6,
    province: "22",
    district: "2201",
    subdistrict: "220104",
    summary: "อหิวาตกโรค 2 ราย",
    description: "รายงานผู้ป่วยอหิวาตกโรค 2 ราย (ข้อมูลจากกองระบาดวิทยา)",
    occurredOn: "2026-10-12",
    recorder: "สมชาย ร.",
    recordedAt: "2026-10-12T14:05:00",
  },
  {
    id: 5,
    province: "63",
    district: "6306",
    subdistrict: "630605",
    summary: "อหิวาตกโรค 5 ราย",
    description: "รายงานผู้ป่วยอหิวาตกโรค 5 ราย บริเวณด่านพรมแดน (ข้อมูลจากกองระบาดวิทยา)",
    occurredOn: "2026-10-08",
    recorder: "สมชาย ร.",
    recordedAt: "2026-10-08T10:30:00",
  },
  {
    id: 4,
    province: "85",
    district: "8501",
    subdistrict: "850106",
    summary: "อหิวาตกโรค 1 ราย",
    description: "รายงานผู้ป่วยอหิวาตกโรค 1 ราย (ข้อมูลจากกองระบาดวิทยา)",
    occurredOn: "2026-10-21",
    recorder: "สมชาย ร.",
    recordedAt: "2026-10-21T09:15:00",
  },
  {
    id: 3,
    province: "74",
    district: "7401",
    subdistrict: "740101",
    summary: "อหิวาตกโรค 3 ราย",
    description: "รายงานผู้ป่วยอหิวาตกโรค 3 ราย ในพื้นที่ตลาดทะเล (ข้อมูลจากกองระบาดวิทยา)",
    occurredOn: "2026-09-15",
    recorder: "สมชาย ร.",
    recordedAt: "2026-09-15T16:40:00",
  },
  {
    id: 2,
    province: "90",
    district: "9011",
    subdistrict: "901103",
    summary: "อหิวาตกโรค 1 ราย",
    description: "รายงานผู้ป่วยอหิวาตกโรค 1 ราย (ข้อมูลจากกองระบาดวิทยา)",
    occurredOn: "2026-09-02",
    recorder: "สมชาย ร.",
    recordedAt: "2026-09-02T11:00:00",
  },
  {
    id: 1,
    province: "71",
    district: "7108",
    subdistrict: "710801",
    summary: "อหิวาตกโรค 2 ราย",
    description: "รายงานผู้ป่วยอหิวาตกโรค 2 ราย (ข้อมูลจากกองระบาดวิทยา)",
    occurredOn: "2026-08-20",
    recorder: "สมชาย ร.",
    recordedAt: "2026-08-20T13:25:00",
  },
];

// ค่าเริ่มต้นของฟอร์มตาม Figma (ร่างข้อมูลพื้นที่ ต.ท่าช้าง)
export const outbreakDraft = {
  province: "22",
  district: "2201",
  subdistrict: "220104",
  description: "รายงานผู้ป่วยอหิวาตกโรค 2 ราย (ข้อมูลจากกองระบาดวิทยา)",
  occurredOn: "2026-10-12",
};

// ช่วงวันที่เริ่มต้นของตัวกรอง (01/08/2569 – 26/10/2569)
export const outbreakFilterRange = ["2026-08-01", "2026-10-26"];
