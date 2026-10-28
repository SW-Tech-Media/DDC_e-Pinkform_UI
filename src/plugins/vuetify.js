import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa-svg";
import { mdi } from "vuetify/iconsets/mdi";
import { th, en } from "vuetify/locale";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { colors } from "@/design/tokens.js";

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
    VTextField: { variant: "outlined", density: "default", rounded: "lg" },
    VSelect: { variant: "outlined", density: "default", rounded: "lg" },
    VTextarea: { variant: "outlined", density: "default", rounded: "lg" },
    VAutocomplete: { variant: "outlined", density: "default", rounded: "lg" },
    VCombobox: { variant: "outlined", density: "default", rounded: "lg" },
    VFileInput: { variant: "outlined", density: "default", rounded: "lg" },
    VDialog: { scrollable: true },
  },
});
