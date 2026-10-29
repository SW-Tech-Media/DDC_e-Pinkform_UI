<script setup>
// แผง "ตั้งค่าการแจ้งเตือน" (D17) — ระยะแจ้งเตือนล่วงหน้า ความถี่ ช่องทาง รอบตรวจสอบ OCSP URL
import { ref } from "vue";
import SectionCard from "@/components/SectionCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import { pkiText } from "@/content/pki.js";
import { alertSettings } from "@/mocks/pki.js";
import { size } from "@/design/tokens.js";

const emit = defineEmits(["saved"]);
const t = pkiText.settings;
const form = ref({ ...alertSettings });
const formRef = ref(null);
const required = [(v) => (v !== "" && v !== null && v !== undefined) || t.required];
const channelError = ref("");

const save = async () => {
  const { valid } = await formRef.value.validate();
  channelError.value = form.value.email || form.value.soap ? "" : t.channelRequired;
  if (valid && !channelError.value) emit("saved", { ...form.value });
};
</script>

<template>
  <SectionCard :title="t.title">
    <v-form ref="formRef" class="d-flex flex-column ga-5" @submit.prevent="save">
      <div>
        <FieldLabel :label="t.lead" for="pki-lead" />
        <div class="d-flex flex-wrap align-center ga-2">
          <v-text-field
            id="pki-lead"
            v-model.number="form.lead"
            type="number"
            min="1"
            density="compact"
            :rules="required"
            hide-details
            class="num"
          />
          <SegmentedControl v-model="form.leadUnit" :options="t.leadUnits" :label="t.lead" />
        </div>
      </div>
      <div>
        <FieldLabel :label="t.frequency" />
        <SegmentedControl v-model="form.frequency" :options="t.frequencies" :label="t.frequency" />
      </div>
      <div>
        <FieldLabel :label="t.channels" />
        <v-checkbox v-model="form.email" :label="t.email(form.emailTo)" color="primary" density="compact" hide-details />
        <v-checkbox v-model="form.soap" :label="t.soap" color="primary" density="compact" hide-details />
        <p v-if="channelError" class="pf-type-caption text-status-danger-fg">{{ channelError }}</p>
      </div>
      <div>
        <FieldLabel :label="t.interval" for="pki-interval" />
        <div class="d-flex flex-wrap align-center ga-2">
          <v-text-field
            id="pki-interval"
            v-model.number="form.interval"
            type="number"
            min="1"
            density="compact"
            :rules="required"
            hide-details
            class="num"
          />
          <SegmentedControl v-model="form.intervalUnit" :options="t.intervalUnits" :label="t.interval" />
        </div>
      </div>
      <div>
        <FieldLabel :label="t.ocsp" for="pki-ocsp" />
        <v-text-field id="pki-ocsp" v-model="form.ocspUrl" :rules="required" hide-details="auto" />
      </div>
      <div>
        <v-btn type="submit" color="primary" prepend-icon="fas fa-check" :height="size['control-lg']">{{ t.save }}</v-btn>
      </div>
    </v-form>
  </SectionCard>
</template>

<style scoped>
.num {
  flex: 0 0 calc(var(--pf-space-64));
}
</style>
