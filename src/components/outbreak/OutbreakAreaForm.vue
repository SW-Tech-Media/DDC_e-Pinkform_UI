<script setup>
// ฟอร์ม "+ เพิ่มข้อมูลพื้นที่โรคระบาด" (D14 แผงซ้าย)
// เลือก จังหวัด → อำเภอ → ตำบล ต่อเนื่องจากข้อมูลหลัก และคำนวณวันที่ปลอดโรค = วันที่เกิดโรค + 21 วัน
import { computed, ref } from "vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AlertBox from "@/components/AlertBox.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import DateField from "@/components/DateField.vue";
import { outbreakText } from "@/content/outbreak-areas.js";
import { diseaseFreeDays, geography } from "@/mocks/outbreak-areas.js";
import { formatDate } from "@/utils/format.js";
import { addDays } from "./outbreak-utils.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  editing: { type: Boolean, default: false },
  recorder: { type: String, required: true },
});
const form = defineModel({ type: Object, required: true });
const emit = defineEmits(["save", "clear"]);

const t = outbreakText.form;
const opt = (x) => ({ title: outbreakText.option(x.name, x.code), value: x.code });

const province = computed(() => geography.find((p) => p.code === form.value.province));
const district = computed(() => province.value?.districts.find((d) => d.code === form.value.district));
const provinceItems = geography.map(opt);
const districtItems = computed(() => province.value?.districts.map(opt) ?? []);
const subdistrictItems = computed(() => district.value?.subdistricts.map(opt) ?? []);

// เปลี่ยนจังหวัด/อำเภอ แล้วล้างระดับที่อยู่ถัดไป
const pickProvince = (v) => Object.assign(form.value, { province: v, district: null, subdistrict: null });
const pickDistrict = (v) => Object.assign(form.value, { district: v, subdistrict: null });

const freeOn = computed(() => (form.value.occurredOn ? formatDate(addDays(form.value.occurredOn, diseaseFreeDays)) : ""));

const formRef = ref(null);
const rules = [(v) => !!v || t.required];
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) emit("save");
};
const clear = () => {
  formRef.value.resetValidation();
  emit("clear");
};
</script>

<template>
  <v-card class="pf-bordered">
    <div class="d-flex align-center ga-3 px-6 py-5 pf-bordered-bottom">
      <v-icon :icon="editing ? 'fas fa-pen' : 'fas fa-plus'" color="icon-brand" size="small" />
      <h2 class="pf-type-h4 text-text-primary">{{ editing ? t.editTitle : t.addTitle }}</h2>
    </div>
    <v-form ref="formRef" class="pa-6" @submit.prevent="submit">
      <div class="d-flex flex-column ga-4">
        <div>
          <FieldLabel :label="t.province" required for="ob-province" />
          <v-select
            id="ob-province"
            :model-value="form.province"
            :items="provinceItems"
            :placeholder="t.selectPlaceholder"
            :rules="rules"
            hide-details="auto"
            @update:model-value="pickProvince"
          />
        </div>
        <div>
          <FieldLabel :label="t.district" required for="ob-district" />
          <v-select
            id="ob-district"
            :model-value="form.district"
            :items="districtItems"
            :placeholder="t.selectPlaceholder"
            :disabled="!form.province"
            :rules="rules"
            hide-details="auto"
            @update:model-value="pickDistrict"
          />
        </div>
        <div>
          <FieldLabel :label="t.subdistrict" required for="ob-subdistrict" />
          <v-select
            id="ob-subdistrict"
            v-model="form.subdistrict"
            :items="subdistrictItems"
            :placeholder="t.selectPlaceholder"
            :disabled="!form.district"
            :rules="rules"
            hide-details="auto"
          />
        </div>
        <div>
          <FieldLabel :label="t.description" required for="ob-desc" />
          <v-textarea
            id="ob-desc"
            v-model="form.description"
            :placeholder="t.descriptionPlaceholder"
            rows="3"
            auto-grow
            :rules="rules"
            hide-details="auto"
          />
        </div>
        <v-row dense>
          <v-col cols="6">
            <FieldLabel :label="t.occurredOn" required for="ob-occurred" />
            <DateField id="ob-occurred" v-model="form.occurredOn" />
          </v-col>
          <v-col cols="6">
            <FieldLabel :label="t.freeOn" for="ob-free" />
            <v-text-field
              id="ob-free"
              :model-value="freeOn"
              readonly
              hide-details
              base-color="success"
              color="success"
              class="free-on"
              :append-inner-icon="freeOn ? 'far fa-circle-check' : undefined"
            />
          </v-col>
        </v-row>
        <AlertBox tone="info">{{ t.info(diseaseFreeDays) }}</AlertBox>
        <p class="pf-type-caption text-text-tertiary">{{ recorder }}</p>
        <div class="d-flex ga-3">
          <SecondaryButton class="flex-1-1" @click="clear">{{ editing ? t.cancelEdit : t.clear }}</SecondaryButton>
          <v-btn type="submit" color="primary" prepend-icon="fas fa-check" class="flex-1-1" :height="size['control-lg']">
            {{ editing ? t.update : t.save }}
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<style scoped>
.free-on :deep(.v-field__outline) {
  --v-field-border-opacity: 1;
  --v-field-border-width: calc(var(--pf-stroke-default) * 2);
}
.free-on :deep(.v-field__append-inner .v-icon) {
  color: rgb(var(--v-theme-status-success-fg));
  opacity: 1;
}
</style>
