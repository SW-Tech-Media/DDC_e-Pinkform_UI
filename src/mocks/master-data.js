// ข้อมูลจำลองหน้า B-15 · ข้อมูลหลักอื่น ๆ (TOR 4.4.8 (1)–(5), (7)–(14))
// พื้นที่โรคระบาด (6) อยู่หน้า B-14 แยก · รหัสข้อความตอบกลับใช้ข้อความเดียวกับ mocks/review.js
import { replyMessages } from "./review.js";

// (1) หน่วยงาน DDC
export const ddcOrganization = {
  code: "DDC-0210",
  taxId: "0994000164552",
  nameTh: "กองโรคติดต่อทั่วไป กรมควบคุมโรค กระทรวงสาธารณสุข",
  nameEn: "Division of Communicable Diseases, Department of Disease Control, Ministry of Public Health",
  address: "88/21 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000",
  caAlias: "ddc-pinkforms-signer-2026",
  profile: "PRF-DDC-0001",
  nswId: "NSW-GOV-0210",
  savedAt: "2026-10-20T16:42:00+07:00",
  savedBy: "ธนกร ศรีสุข",
};

const seq = (rows) => rows.map((r, i) => ({ id: i + 1, seq: i + 1, ...r }));

export const masterRows = {
  // (2) บัญชีธนาคาร DDC
  bankAccounts: seq([
    { accountNo: "067-6-01458-2", accountName: "กรมควบคุมโรค (ค่าธรรมเนียมใบรับรองฯ)", bank: "ธนาคารกรุงไทย", paymentType: "Cross Bank Bill Payment" },
    { accountNo: "067-6-01459-0", accountName: "กรมควบคุมโรค (ค่าธรรมเนียมใบรับรองฯ)", bank: "ธนาคารกรุงไทย", paymentType: "Bill Payment (เคาน์เตอร์ธนาคาร)" },
    { accountNo: "123-0-45678-9", accountName: "กรมควบคุมโรค เงินรายได้", bank: "ธนาคารกรุงเทพ", paymentType: "Cross Bank Bill Payment" },
    { accountNo: "098-2-33120-4", accountName: "กรมควบคุมโรค เงินรายได้", bank: "ธนาคารไทยพาณิชย์", paymentType: "QR Payment (Thai QR)" },
    { accountNo: "020-1-77805-6", accountName: "กรมควบคุมโรค เงินรายได้", bank: "ธนาคารออมสิน", paymentType: "Bill Payment (เคาน์เตอร์ธนาคาร)" },
  ]),

  // (3) ผู้มีอำนาจลงนามใบรับรองฯ
  certSigners: seq([
    { staffId: "DDC-S0012", name: "วิภาวรรณ ทองดี", position: "ผู้อำนวยการกองโรคติดต่อทั่วไป", docType: "ใบรับรองสุขอนามัย (Pinkform)", fileName: "sign_wipawan_t.png", status: "active" },
    { staffId: "DDC-S0018", name: "นพ.อรรถพล สุขสวัสดิ์", position: "รองผู้อำนวยการกองโรคติดต่อทั่วไป", docType: "ใบรับรองสุขอนามัย (Pinkform)", fileName: "sign_attapol_s.png", status: "active" },
    { staffId: "DDC-S0025", name: "พญ.กนกวรรณ ศรีประเสริฐ", position: "นายแพทย์ชำนาญการพิเศษ", docType: "ใบรับรองสุขอนามัย (Pinkform)", fileName: "sign_kanokwan_s.png", status: "active" },
    { staffId: "DDC-S0031", name: "นายประเสริฐ วงศ์สวัสดิ์", position: "นักวิชาการสาธารณสุขชำนาญการพิเศษ", docType: "ใบแนบใบรับรองฯ (ภาษาอังกฤษ)", fileName: "sign_prasert_w.png", status: "active" },
    { staffId: "DDC-S0009", name: "นพ.สุรเชษฐ์ มั่นคง", position: "ผู้อำนวยการกองโรคติดต่อทั่วไป (เดิม)", docType: "ใบรับรองสุขอนามัย (Pinkform)", fileName: "sign_surachet_m.png", status: "inactive" },
  ]),

  // (4) ผู้มีอำนาจลงนามใบเสร็จ
  receiptSigners: seq([
    { staffId: "DDC-F0004", name: "ประภาพร มั่นคง", position: "นักวิชาการเงินและบัญชีชำนาญการ", docType: "ใบเสร็จรับเงินอิเล็กทรอนิกส์", fileName: "sign_prapaporn_m.png", status: "active" },
    { staffId: "DDC-F0007", name: "นางสาวจิราพร แก้วมณี", position: "หัวหน้ากลุ่มงานการเงินและบัญชี", docType: "ใบเสร็จรับเงินอิเล็กทรอนิกส์", fileName: "sign_jiraporn_k.png", status: "active" },
    { staffId: "DDC-F0011", name: "นายสมศักดิ์ ใจซื่อ", position: "เจ้าพนักงานการเงินและบัญชีชำนาญงาน", docType: "ใบกำกับภาษี / ใบเสร็จรับเงิน", fileName: "sign_somsak_j.png", status: "active" },
    { staffId: "DDC-F0002", name: "นางวันเพ็ญ ศรีสุข", position: "นักวิชาการเงินและบัญชีชำนาญการพิเศษ (เกษียณ)", docType: "ใบเสร็จรับเงินอิเล็กทรอนิกส์", fileName: "sign_wanpen_s.png", status: "inactive" },
  ]),

  // (5) รหัสพิกัดศุลกากร
  hsCodes: seq([
    { hsCode: "0810.60.00", statCode: "000", description: "ทุเรียนสด" },
    { hsCode: "0804.50.20", statCode: "000", description: "มะม่วงสด" },
    { hsCode: "0810.90.10", statCode: "001", description: "ลำไยสด" },
    { hsCode: "0306.17.11", statCode: "000", description: "กุ้งแช่แข็ง (กุ้งขาวแวนนาไม)" },
    { hsCode: "1006.30.30", statCode: "001", description: "ข้าวหอมมะลิไทย ขัดสีแล้ว" },
    { hsCode: "0303.89.19", statCode: "090", description: "ปลาแช่แข็งอื่น ๆ" },
    { hsCode: "2008.99.90", statCode: "000", description: "ผลไม้แปรรูปอื่น ๆ" },
    { hsCode: "0713.31.90", statCode: "000", description: "ถั่วเขียว แห้ง กะเทาะเปลือก" },
  ]),

  // (7) รหัสท่าขนถ่าย
  ports: seq([
    { code: "THBKK", name: "ท่าเรือกรุงเทพ (คลองเตย)", country: "TH" },
    { code: "THLCH", name: "ท่าเรือแหลมฉบัง", country: "TH" },
    { code: "THSGZ", name: "ท่าเรือสงขลา", country: "TH" },
    { code: "THHKT", name: "ท่าอากาศยานภูเก็ต", country: "TH" },
    { code: "CNSHA", name: "Shanghai", country: "CN" },
    { code: "HKHKG", name: "Hong Kong", country: "HK" },
    { code: "SGSIN", name: "Singapore", country: "SG" },
    { code: "JPTYO", name: "Tokyo", country: "JP" },
    { code: "VNSGN", name: "Ho Chi Minh City", country: "VN" },
  ]),

  // (8) รหัสหน่วยหีบห่อ (UN/ECE Rec. 21)
  packages: seq([
    { code: "CT", name: "Carton (กล่องกระดาษ)" },
    { code: "BX", name: "Box (กล่อง)" },
    { code: "BG", name: "Bag (ถุง / กระสอบ)" },
    { code: "CS", name: "Case (ลัง)" },
    { code: "CR", name: "Crate (เข่ง / ตะกร้า)" },
    { code: "PK", name: "Package (หีบห่อ)" },
    { code: "PX", name: "Pallet (พาเลท)" },
    { code: "DR", name: "Drum (ถัง)" },
  ]),

  // (9) รหัสสกุลเงินตรา (ISO 4217)
  currencies: seq([
    { code: "THB", name: "บาท (Thai Baht)" },
    { code: "USD", name: "ดอลลาร์สหรัฐ (US Dollar)" },
    { code: "EUR", name: "ยูโร (Euro)" },
    { code: "JPY", name: "เยน (Japanese Yen)" },
    { code: "CNY", name: "หยวน (Chinese Yuan)" },
    { code: "SGD", name: "ดอลลาร์สิงคโปร์ (Singapore Dollar)" },
    { code: "MYR", name: "ริงกิต (Malaysian Ringgit)" },
    { code: "HKD", name: "ดอลลาร์ฮ่องกง (Hong Kong Dollar)" },
  ]),

  // (10) รหัสข้อความตอบกลับ — ข้อความ R01–R08 ตรงกับ mocks/review.js
  replyCodes: seq(
    replyMessages.map((m) => ({
      code: m.code,
      text: m.text,
      kind: m.type,
      description: {
        R01: "ใช้เมื่อตรวจสอบครบทุกข้อใน Checklist แล้วอนุมัติคำขอ",
        R02: "เลขผู้เสียภาษี / สาขา / ชื่อบริษัทในคำขอไม่ตรงกับทะเบียนผู้ประกอบการ",
        R03: "ชื่อสินค้า ชื่อวิทยาศาสตร์ หรือลักษณะนามไม่ตรงกับข้อมูลที่กรมฯ รับรอง",
        R04: "พิกัดศุลกากรหรือรหัสสถิติไม่ตรงกับข้อมูลหลักรหัสพิกัดศุลกากร",
        R05: "ตำบลแหล่งผลิตอยู่ในพื้นที่โรคระบาดและยังไม่ครบ 21 วัน",
        R06: "วันที่ผลิตอยู่หลังวันที่ยื่นคำขอ หรือรูปแบบวันที่ไม่ถูกต้อง",
        R07: "ข้อความรับรองเพิ่มเติมเกินขอบเขตที่กรมควบคุมโรครับรองได้",
        R08: "ไม่พบเอกสารประกอบตามที่กำหนด หรือไฟล์แนบเปิดไม่ได้",
      }[m.code],
    }))
  ),

  // (11) รหัสตำบล
  subdistricts: seq([
    { code: "100101", name: "พระบรมมหาราชวัง", districtCode: "1001", provinceCode: "10" },
    { code: "120101", name: "สวนใหญ่", districtCode: "1201", provinceCode: "12" },
    { code: "200701", name: "บางละมุง", districtCode: "2007", provinceCode: "20" },
    { code: "210101", name: "ท่าประดู่", districtCode: "2101", provinceCode: "21" },
    { code: "500101", name: "ศรีภูมิ", districtCode: "5001", provinceCode: "50" },
    { code: "740101", name: "มหาชัย", districtCode: "7401", provinceCode: "74" },
    { code: "830101", name: "ตลาดใหญ่", districtCode: "8301", provinceCode: "83" },
    { code: "901101", name: "หาดใหญ่", districtCode: "9011", provinceCode: "90" },
  ]),

  // (12) รหัสอำเภอ
  districts: seq([
    { code: "1001", nameTh: "เขตพระนคร", nameEn: "Phra Nakhon", province: "กรุงเทพมหานคร" },
    { code: "1201", nameTh: "เมืองนนทบุรี", nameEn: "Mueang Nonthaburi", province: "นนทบุรี" },
    { code: "2007", nameTh: "บางละมุง", nameEn: "Bang Lamung", province: "ชลบุรี" },
    { code: "2101", nameTh: "เมืองระยอง", nameEn: "Mueang Rayong", province: "ระยอง" },
    { code: "5001", nameTh: "เมืองเชียงใหม่", nameEn: "Mueang Chiang Mai", province: "เชียงใหม่" },
    { code: "7401", nameTh: "เมืองสมุทรสาคร", nameEn: "Mueang Samut Sakhon", province: "สมุทรสาคร" },
    { code: "8301", nameTh: "เมืองภูเก็ต", nameEn: "Mueang Phuket", province: "ภูเก็ต" },
    { code: "9011", nameTh: "หาดใหญ่", nameEn: "Hat Yai", province: "สงขลา" },
  ]),

  // (13) รหัสจังหวัด
  provinces: seq([
    { code: "10", nameTh: "กรุงเทพมหานคร", nameEn: "Bangkok" },
    { code: "12", nameTh: "นนทบุรี", nameEn: "Nonthaburi" },
    { code: "20", nameTh: "ชลบุรี", nameEn: "Chon Buri" },
    { code: "21", nameTh: "ระยอง", nameEn: "Rayong" },
    { code: "50", nameTh: "เชียงใหม่", nameEn: "Chiang Mai" },
    { code: "74", nameTh: "สมุทรสาคร", nameEn: "Samut Sakhon" },
    { code: "83", nameTh: "ภูเก็ต", nameEn: "Phuket" },
    { code: "90", nameTh: "สงขลา", nameEn: "Songkhla" },
  ]),

  // (14) รหัสประเทศ (ISO 3166-1)
  countries: seq([
    { code: "TH", name: "ไทย (Thailand)" },
    { code: "CN", name: "จีน (China)" },
    { code: "JP", name: "ญี่ปุ่น (Japan)" },
    { code: "US", name: "สหรัฐอเมริกา (United States)" },
    { code: "SG", name: "สิงคโปร์ (Singapore)" },
    { code: "MY", name: "มาเลเซีย (Malaysia)" },
    { code: "VN", name: "เวียดนาม (Viet Nam)" },
    { code: "HK", name: "ฮ่องกง (Hong Kong)" },
    { code: "KR", name: "เกาหลีใต้ (Korea, Republic of)" },
    { code: "AU", name: "ออสเตรเลีย (Australia)" },
  ]),
};
