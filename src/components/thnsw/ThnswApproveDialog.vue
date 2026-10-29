<script setup>
// อนุมัติ THNSW: กำหนดสิทธิ์การเข้าใช้งาน + ประเภทบริการ → ConfirmDialog → emit confirm({ access, service })
import { computed, ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AlertBox from "@/components/AlertBox.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { thnswText as t } from "@/content/thnsw.js";
import { common } from "@/content/common.js";
import { operatorAccess, operatorServices, operatorTypes } from "@/mocks/operators.js";
import { size } from "@/design/tokens.js";

const props = defineProps({
  request: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["confirm"]);

const access = ref("active");
const service = ref("certificate");
const confirmOpen = ref(false);

// ผู้ส่งออก → ใบรับรองฯ · ตัวแทน / Counter Service → ยื่นแทนผู้ส่งออก
watch(open, (v) => {
  if (!v || !props.request) return;
  access.value = "active";
  service.value = props.request.type === "exporter" ? "certificate" : "onBehalf";
});

const accessItems = Object.entries(operatorAccess).map(([value, v]) => ({ value, title: v.label }));
const serviceItems = Object.entries(operatorServices).map(([value, v]) => ({ value, title: v.label }));
const message = computed(() =>
  props.request
    ? t.approve.confirmBody(props.request.nameTh, operatorAccess[access.value].label, operatorServices[service.value].label)
    : ""
);
const done = () => {
  emit("confirm", { access: access.value, service: service.value });
  open.value = false;
};
</script>

<template>
  <AppDialog v-model="open" :title="t.approve.title" :subtitle="request ? t.approve.subtitle(request.nameTh) : ''">
    <div v-if="request" class="d-flex flex-column ga-4">
      <div>
        <FieldLabel :label="t.approve.type" for="thnsw-type" />
        <v-text-field id="thnsw-type" :model-value="operatorTypes[request.type].label" readonly hide-details />
      </div>
      <div>
        <FieldLabel :label="t.approve.access" for="thnsw-access" required />
        <v-select id="thnsw-access" v-model="access" :items="accessItems" hide-details />
      </div>
      <div>
        <FieldLabel :label="t.approve.service" for="thnsw-service" required />
        <v-select id="thnsw-service" v-model="service" :items="serviceItems" hide-details />
      </div>
      <AlertBox tone="info">{{ t.approve.info }}</AlertBox>
    </div>
    <template #actions>
      <SecondaryButton height="control-md" @click="open = false">{{ common.actions.cancel }}</SecondaryButton>
      <v-btn color="primary" prepend-icon="fas fa-check" :height="size['control-md']" @click="confirmOpen = true">
        {{ t.approve.next }}
      </v-btn>
    </template>
  </AppDialog>

  <ConfirmDialog
    v-model="confirmOpen"
    :title="t.approve.confirmTitle"
    :message="message"
    :confirm-text="t.approve.confirm"
    icon="fas fa-user-check"
    tone="teal"
    :danger="false"
    @confirm="done"
  />
</template>
