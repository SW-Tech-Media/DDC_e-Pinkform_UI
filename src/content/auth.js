// ข้อความแผงแบรนด์ของหน้าเข้าสู่ระบบ (ใช้ร่วม D04 – D06) — ข้อความของแต่ละหน้าเพิ่มต่อในไฟล์นี้
export const authText = {
  panel: {
    title: "ระบบบริการใบรับรองแหล่งผลิต แหล่งกำเนิดอาหารปลอดโรค",
    description: "รับคำขอ พิจารณา รับชำระเงิน และออกใบรับรองฯ อิเล็กทรอนิกส์ เชื่อมโยงผ่าน National Single Window",
    badge: "ระบบหลังบ้านสำหรับเจ้าหน้าที่",
    features: [
      { icon: "fas fa-file-signature", text: "ลายมือชื่อดิจิทัล PKI" },
      { icon: "fas fa-arrow-right-arrow-left", text: "เชื่อมโยง NSW (ebMS 2.0)" },
      { icon: "fas fa-shield-halved", text: "ยืนยันตัวตน 2 ชั้น" },
    ],
    copyright: "© 2569 กองโรคติดต่อทั่วไป กรมควบคุมโรค กระทรวงสาธารณสุข",
  },

  // Stepper ของการเข้าสู่ระบบ (D04 – D05)
  loginSteps: [{ label: "Username / Password" }, { label: "PIN 6 หลัก" }],

  // D04 · Login – Credentials
  login: {
    title: "เข้าสู่ระบบ",
    subtitle: "สำหรับเจ้าหน้าที่กรมควบคุมโรค",
    username: "ชื่อผู้ใช้ (Username)",
    usernamePlaceholder: "กรอกชื่อผู้ใช้",
    password: "รหัสผ่าน (Password)",
    passwordPlaceholder: "กรอกรหัสผ่าน",
    showPassword: "แสดงรหัสผ่าน",
    hidePassword: "ซ่อนรหัสผ่าน",
    remember: "จดจำชื่อผู้ใช้",
    forgot: "ลืมรหัสผ่าน?",
    submit: "ถัดไป",
    required: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
    footnote: "ระบบบันทึกประวัติการเข้าใช้งาน (IP, เวลา, อุปกรณ์) ตาม พ.ร.บ. คอมพิวเตอร์",
  },

  // D05 · Login – PIN
  pin: {
    title: "กรอก PIN 6 หลัก",
    subtitle: (username) => `ยืนยันตัวตนชั้นที่ 2 สำหรับบัญชี ${username}`,
    attemptsLeft: (n) => `กรอกผิดได้อีก ${n} ครั้ง`,
    forgot: "ลืม PIN?",
    clear: "ล้าง",
    backspace: "ลบตัวเลข",
    submit: "ยืนยันและเข้าสู่ระบบ",
    back: "กลับไปหน้าเข้าสู่ระบบ",
    shuffled: "แป้นตัวเลขสุ่มตำแหน่งทุกครั้ง",
    incomplete: "กรุณากรอก PIN ให้ครบ 6 หลัก",
    wrong: (n) => `PIN ไม่ถูกต้อง กรอกผิดได้อีก ${n} ครั้ง`,
    lockedTitle: "บัญชีถูกล็อกชั่วคราว 15 นาที",
    locked: "กรอก PIN ผิดครบ 5 ครั้ง ระบบส่งอีเมลแจ้งเตือนแล้ว ปลดล็อกได้ด้วยการตั้ง PIN ใหม่ผ่านอีเมล",
    warning: "กรอก PIN ผิดครบ 5 ครั้ง ระบบจะล็อกบัญชี 15 นาที และส่งอีเมลแจ้งเตือน ปลดล็อกได้ด้วยการตั้ง PIN ใหม่ผ่านอีเมล",
    cellLabel: (i) => `PIN หลักที่ ${i}`,
  },

  // D06 · Set PIN – Confirm
  setPin: {
    verified: "ยืนยันอีเมลสำเร็จ · s*****@ddc.mail.go.th",
    steps: [{ label: "ยืนยันอีเมล" }, { label: "ตั้งรหัสผ่าน" }, { label: "ตั้ง PIN" }],
    title: "ตั้ง PIN 6 หลัก",
    subtitle: (username) => `ใช้ยืนยันตัวตนชั้นที่ 2 ทุกครั้งที่เข้าสู่ระบบ · บัญชี ${username}`,
    newPin: "PIN ใหม่",
    confirmPin: "ยืนยัน PIN อีกครั้ง",
    rules: {
      length: "ตัวเลข 6 หลัก",
      sequence: "ไม่ใช่เลขเรียง เช่น 123456 / 654321",
      repeat: "ไม่ใช่เลขซ้ำ เช่น 111111",
      match: "PIN ทั้ง 2 ช่องตรงกัน",
    },
    submit: "บันทึก PIN และเริ่มใช้งาน",
    info: "PIN ถูกเข้ารหัสแบบทางเดียว (Hash) ไม่มีผู้ใดเห็นได้ รวมถึงผู้ดูแลระบบ · ลิงก์นี้ใช้ได้ครั้งเดียว และหมดอายุใน 24 ชั่วโมง",
  },
};
