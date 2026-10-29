<script setup>
// Dialog ดูใบรับรองฯ ที่ออกแล้ว (B-10) — ใช้ review/CertificatePreview (ไม่มีลายน้ำ PREVIEW) + สถานะ e-Licensing + ดาวน์โหลด PDF / XML
// emit download(type) · resend (เมื่อส่ง e-Licensing ไม่สำเร็จ)
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import AppDialog from "@/components/AppDialog.vue";
import AlertBox from "@/components/AlertBox.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import CertificatePreview from "@/components/review/CertificatePreview.vue";
import { certificatesText } from "@/content/certificates.js";
import { certificateDetail, eLicensingStatuses } from "@/mocks/certificates.js";
import { formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  certificate: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
defineEmits(["download", "resend"]);

const t = certificatesText.preview;
const { xs } = useDisplay();
const variant = ref("cert");
watch(open, (v) => v && (variant.value = "cert"));

const detail = computed(() => (props.certificate ? certificateDetail(props.certificate) : null));
const info = computed(() => {
  const c = props.certificate;
  return [
    { label: t.info.sentAt, value: formatDateTime(c.sentAt) },
    { label: t.info.invoice, value: c.invoice },
    { label: t.info.country, value: c.country },
    { label: t.info.receipt, value: c.receiptNo || "–" },
  ];
});
const tone = computed(() => eLicensingStatuses[props.certificate.eLicensing].tone);
</script>

<template>
  <AppDialog
    v-if="certificate"
    v-model="open"
    :title="t.title(certificate.certNo)"
    :subtitle="t.subtitle(certificate.ref, certificate.company)"
    wide
  >
    <KeyValueList :items="info" :columns="xs ? 1 : 2" class="mb-4" />
    <AlertBox :tone="tone" class="mb-5">
      {{ t.eLicensing[certificate.eLicensing] }}
      <template v-if="certificate.eLicensing === 'failed'" #aside>
        <v-btn color="primary" size="small" prepend-icon="fas fa-paper-plane" @click="$emit('resend')">
          {{ t.resend }}
        </v-btn>
      </template>
    </AlertBox>

    <SegmentedControl v-model="variant" :options="t.variants" :label="t.variantLabel" class="mb-4 variants" />
    <CertificatePreview :detail="detail" :variant="variant" :certificate-no="certificate.certNo" :watermark="false" />

    <template #actions>
      <SecondaryButton icon="far fa-file-code" height="control-md" @click="$emit('download', 'XML')">
        {{ t.downloadXml }}
      </SecondaryButton>
      <v-btn color="primary" prepend-icon="fas fa-file-pdf" :height="size['control-md']" @click="$emit('download', 'PDF')">
        {{ t.downloadPdf }}
      </v-btn>
    </template>
  </AppDialog>
</template>

<style scoped>
.variants {
  max-width: 100%;
  overflow-x: auto;
}
</style>
