<script setup>
// Dialog ทดสอบการเชื่อมต่อ ebMS (B-23) — ไล่ทีละขั้น แล้วแสดงผลสำเร็จ / ล้มเหลว (จำลอง ตาม cpa.testResult)
import { computed, onBeforeUnmount, ref, watch } from "vue";
import AppDialog from "@/components/AppDialog.vue";
import AlertBox from "@/components/AlertBox.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { cpaText } from "@/content/cpa.js";
import { common } from "@/content/common.js";
import { connectionSteps } from "@/mocks/cpa.js";
import { size, space } from "@/design/tokens.js";

const props = defineProps({
  cpa: { type: Object, default: null },
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["result"]);
const t = cpaText.testDialog;

const done = ref(0); // จำนวนขั้นที่ทดสอบแล้ว
let timer = null;
const willFail = computed(() => props.cpa?.testResult === "fail");
const failIndex = computed(() => (willFail.value ? connectionSteps.findIndex((s) => s.fail) : -1));
const finished = computed(() => done.value >= connectionSteps.length || (failIndex.value >= 0 && done.value > failIndex.value));
const passed = computed(() => finished.value && failIndex.value < 0);
const totalMs = connectionSteps.reduce((a, s) => a + s.ms, 0);

const stepState = (i) => {
  if (i < done.value) return i === failIndex.value ? "fail" : "pass";
  if (i === done.value && !finished.value) return "running";
  return "wait";
};
const stepTone = { pass: "success", fail: "danger", running: "info", wait: "neutral" };

const run = () => {
  clearInterval(timer);
  done.value = 0;
  timer = setInterval(() => {
    done.value += 1;
    if (finished.value) {
      clearInterval(timer);
      emit("result", passed.value ? "success" : "fail");
    }
  }, 450);
};
watch(open, (v) => (v ? run() : clearInterval(timer)));
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <AppDialog v-model="open" :title="t.title" :subtitle="cpa ? `${cpa.id} · ${cpa.endpoint}` : ''">
    <ol class="steps mb-4">
      <li v-for="(s, i) in connectionSteps" :key="s.key" class="d-flex align-center ga-3 py-3 pf-bordered-bottom">
        <v-progress-circular v-if="stepState(i) === 'running'" indeterminate color="primary" :size="size['icon-md']" :width="space[1]" />
        <v-icon
          v-else
          :icon="{ pass: 'fas fa-circle-check', fail: 'fas fa-circle-xmark', wait: 'far fa-circle' }[stepState(i)]"
          :color="{ pass: 'status-success-fg', fail: 'status-danger-fg', wait: 'icon-muted' }[stepState(i)]"
          size="small"
        />
        <span class="pf-type-body-sm text-text-primary flex-grow-1">{{ s.label }}</span>
        <span v-if="stepState(i) === 'pass'" class="pf-type-caption text-text-tertiary">{{ t.ms(s.ms) }}</span>
        <StatusBadge :tone="stepTone[stepState(i)]" dot>{{ t.step[stepState(i)] }}</StatusBadge>
      </li>
    </ol>
    <AlertBox v-if="!finished" tone="neutral">{{ t.running }}</AlertBox>
    <AlertBox v-else-if="passed" tone="success" :title="t.success">{{ t.successBody(totalMs) }}</AlertBox>
    <AlertBox v-else tone="danger" :title="t.fail">{{ t.failBody }}</AlertBox>
    <template #actions>
      <SecondaryButton icon="fas fa-arrows-rotate" height="control-md" :disabled="!finished" @click="run">{{ t.retest }}</SecondaryButton>
      <v-btn color="primary" :height="size['control-md']" @click="open = false">{{ common.actions.close }}</v-btn>
    </template>
  </AppDialog>
</template>

<style scoped>
.steps {
  list-style: none;
}
</style>
