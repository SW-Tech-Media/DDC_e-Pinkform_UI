import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa-svg";
import { mdi } from "vuetify/iconsets/mdi";
import { th, en } from "vuetify/locale";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { colors } from "@/design/tokens.js";

// ช่องกรอกทุกชนิด: ขอบสี border-strong, โฟกัสสี primary
const field = { variant: "outlined", density: "default", rounded: "lg", baseColor: "border-strong", color: "primary" };

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: { dark: false, colors: colors.light },
    },
  },
  icons: {
    defaultSet: "fa",
    aliases,
    sets: { fa, mdi },
  },
  locale: {
    locale: "th",
    fallback: "en",
    messages: { th, en },
  },
  // ค่ามาตรฐานของ Component ทั้งระบบ (ตาม flamework.md)
  defaults: {
    VBtn: { rounded: "lg" },
    VCard: { rounded: "xl", elevation: 0 },
    VTextField: field,
    VSelect: field,
    VTextarea: field,
    VAutocomplete: field,
    VCombobox: field,
    VFileInput: field,
    VDialog: { scrollable: true },
  },
});
