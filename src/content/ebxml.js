// ข้อความหน้า D16 · ติดตามการรับ-ส่งข้อความ ebXML (B-17)

export const ebxmlText = {
  breadcrumb: [{ title: "ผู้ดูแลระบบ" }, { title: "ติดตามการรับ-ส่งข้อความ ebXML" }],
  title: "ติดตามการรับ-ส่งข้อความ ebXML",
  description: "Transaction Log ของ ebXML Gateway (ebMS 2.0 / CPA 2.0) ระหว่าง DDC กับ NSW ธนาคาร และกรมศุลกากร",
  actions: {
    cpa: "ตั้งค่า CPA",
    exportLog: "ส่งออก Log",
    exported: (n) => `ส่งออก Transaction Log ${n} รายการแล้ว (จำลอง)`,
  },
  kpis: {
    received: "ข้อความรับวันนี้",
    sent: "ข้อความส่งวันนี้",
    successRate: "อัตราสำเร็จ",
    queue: "อยู่ในคิว",
    errors: "ผิดพลาด / Retry",
  },
  filters: {
    search: "Message ID / Conversation ID / Reference...",
    allTypes: "ทุกประเภทเอกสาร",
    allDirections: "ทุกทิศทาง",
    allStatuses: "ทุกสถานะ",
    date: "วันที่",
  },
  statusFilter: {
    success: "สำเร็จ",
    retry: "Retry",
    waitAck: "รอ ACK",
    error: "Error",
  },
  headers: [
    { title: "เวลา", key: "time" },
    { title: "Message ID", key: "short" },
    { title: "ประเภทเอกสาร", key: "docType" },
    { title: "ทิศทาง", key: "direction" },
    { title: "ต้นทาง → ปลายทาง", key: "route" },
    { title: "Signature", key: "signature" },
    { title: "สถานะ", key: "status" },
    { title: "จัดการ", key: "actions", align: "center", sortable: false },
  ],
  signature: { pass: "ผ่าน", fail: "ไม่ผ่าน" },
  status: {
    success: "สำเร็จ",
    retry: (n, max) => `Retry ${n} / ${max}`,
    waitAck: "รอ ACK",
    error: "Error: Signature",
  },
  viewPayload: "ดู Payload",
  resend: "ส่งใหม่",
  noData: "ไม่พบข้อความที่ตรงกับเงื่อนไข",
  detail: {
    header: (id) => `ebXML Header · ${id}`,
    history: "ประวัติการส่ง (Queue / Retry)",
    resendNow: "ส่งใหม่ทันที",
    viewPayload: "ดู Payload",
    resendLabel: (n) => `ส่งครั้งที่ ${n} (ส่งใหม่ทันที)`,
    resent: (id) => `ส่งข้อความ ${id} ใหม่สำเร็จ ได้รับ ACK แล้ว`,
    selectHint: "คลิกแถวในตารางเพื่อดู ebXML Header และประวัติการส่ง",
  },
  payload: {
    title: "Payload",
    subtitle: (type, ref) => `${type} · Reference ${ref}`,
    copy: "คัดลอก XML",
    copied: "คัดลอก XML แล้ว",
  },
  cpa: {
    title: "ตั้งค่า CPA",
    subtitle: "Collaboration Protocol Agreement (ebMS 2.0 / CPA 2.0) ของคู่ค้าแต่ละราย",
    cpaId: "CPA ID",
    partner: "Party ID ปลายทาง",
    endpoint: "Endpoint URL",
    retries: "จำนวนครั้ง Retry สูงสุด",
    interval: "ช่วงเวลา Retry (วินาที)",
    signature: "ลงลายมือชื่อ XML Signature",
    encryption: "เข้ารหัส XML Encryption",
    note: "หน้าตั้งค่า CPA (B-23) ยังไม่มีใน Figma — Dialog นี้เป็นฟอร์มอย่างง่ายตาม TOR 4.6.1 (1)",
    save: "บันทึก CPA",
    saved: (id) => `บันทึกการตั้งค่า ${id} แล้ว`,
  },
};

// "5b3d8e90-7a2c-...-91b4c6a2c4a1" → "5b3d8e90-...-c4a1" (แสดงย่อตาม Figma)
const shortId = (id) => `${id.slice(0, 8)}-...-${id.slice(-4)}`;

// สร้างบรรทัด XML ของ ebXML Header — accent = แท็กหลัก (สีชมพูบนพื้นเข้ม)
export const buildHeaderXml = (msg) => [
  { text: '<?xml version="1.0" encoding="UTF-8"?>' },
  { text: '<eb:MessageHeader eb:version="2.0" SOAP:mustUnderstand="1">', accent: true },
  { text: `<eb:From><eb:PartyId>${msg.header.from}</eb:PartyId></eb:From>`, indent: 1 },
  { text: `<eb:To><eb:PartyId>${msg.header.to}</eb:PartyId></eb:To>`, indent: 1 },
  { text: `<eb:CPAId>${msg.header.cpaId}</eb:CPAId>`, indent: 1 },
  { text: `<eb:Service>${msg.header.service}</eb:Service><eb:Action>${msg.header.action}</eb:Action>`, indent: 1 },
  { text: `<eb:MessageData><eb:MessageId>${shortId(msg.id)}</eb:MessageId>`, indent: 1 },
  { text: `<eb:Timestamp>${msg.date}T${msg.time}+07:00</eb:Timestamp></eb:MessageData>`, indent: 2 },
  { text: "</eb:MessageHeader>", accent: true },
];

// สร้าง Payload ตัวอย่าง (เนื้อหาเอกสารใน SOAP Body)
export const buildPayloadXml = (msg) => [
  { text: '<?xml version="1.0" encoding="UTF-8"?>' },
  { text: '<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/">', accent: true },
  { text: "<SOAP:Body>", indent: 1, accent: true },
  { text: `<ddc:Document type="${msg.header.service}" action="${msg.header.action}">`, indent: 2 },
  { text: `<ddc:Reference>${msg.reference}</ddc:Reference>`, indent: 3 },
  { text: `<ddc:DocumentType>${msg.docType}</ddc:DocumentType>`, indent: 3 },
  { text: `<ddc:Sender>${msg.header.from}</ddc:Sender>`, indent: 3 },
  { text: `<ddc:Receiver>${msg.header.to}</ddc:Receiver>`, indent: 3 },
  { text: `<ddc:IssueDateTime>${msg.date}T${msg.time}+07:00</ddc:IssueDateTime>`, indent: 3 },
  { text: '<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">…</ds:Signature>', indent: 3 },
  { text: "</ddc:Document>", indent: 2 },
  { text: "</SOAP:Body>", indent: 1, accent: true },
  { text: "</SOAP:Envelope>", accent: true },
];
