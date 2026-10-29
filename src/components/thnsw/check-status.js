// สรุปผลตรวจลายมือชื่อดิจิทัล + XML Schema ของคำขอขึ้นทะเบียน → { key: pass | warn | fail, tone }
const tones = { pass: "success", warn: "warning", fail: "danger" };

export const checkStatus = (checks) => {
  if (!checks) return { key: "pass", tone: tones.pass };
  const key = !checks.signature.pass || !checks.schema.pass ? "fail" : checks.signature.note ? "warn" : "pass";
  return { key, tone: tones[key] };
};

export const itemStatus = (pass, note) => {
  const key = !pass ? "fail" : note ? "warn" : "pass";
  return { key, tone: tones[key] };
};
