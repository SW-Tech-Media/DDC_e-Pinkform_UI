// ตรวจนโยบายรหัสผ่านแบบ real-time (B-01.3 ตั้งรหัสผ่าน, B-01.5 ตั้งรหัสผ่านใหม่ — Flow 4.1 ขั้น 4)
// สมมติฐานรอ Q-20: TOR ไม่ระบุนโยบายรหัสผ่าน ใช้ค่าตามแนวปฏิบัติทั่วไปของหน่วยงานรัฐไปก่อน
// backend ต้องตรวจซ้ำทุกข้อ และเป็นผู้ตรวจ "ไม่ซ้ำรหัสผ่านเดิม" (เทียบ Hash — หน้าจอตรวจเองไม่ได้)
export const PASSWORD_POLICY = {
  minLength: 8,
  // จำนวนรหัสผ่านล่าสุดที่ห้ามใช้ซ้ำ (ตรวจฝั่ง backend)
  historyCount: 3,
};

// ผลตรวจแต่ละข้อ: 'pass' | 'fail' | 'pending' (รูปเดียวกับ checkPin ใช้กับ PinRuleList ได้)
export const checkPassword = (password, confirm, username = "") => {
  const empty = !password;
  const ok = (cond) => (empty ? "pending" : cond ? "pass" : "fail");
  const name = username.trim().toLowerCase();
  return {
    length: ok(password.length >= PASSWORD_POLICY.minLength),
    letters: ok(/[a-z]/.test(password) && /[A-Z]/.test(password)),
    digit: ok(/\d/.test(password)),
    special: ok(/[^A-Za-z0-9]/.test(password)),
    username: ok(!name || !password.toLowerCase().includes(name)),
    match: !confirm ? "pending" : confirm === password ? "pass" : "fail",
  };
};

export const passwordValid = (result) => Object.values(result).every((s) => s === "pass");
