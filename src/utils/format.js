const thaiDate = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });

// "2026-10-28" → "28 ตุลาคม 2569"
export function formatThaiDate(iso) {
  return thaiDate.format(new Date(`${iso}T00:00:00`));
}
