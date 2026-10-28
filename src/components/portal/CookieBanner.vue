<script setup>
// แถบแจ้งการใช้คุกกี้ (Figma D01 › Cookie Banner) — ลอยติดขอบล่างจอ
// กด ยอมรับ / ปฏิเสธ แล้วซ่อน (จำไว้ตลอดการเปิดแท็บนี้ · โหลดหน้าใหม่จะแสดงอีกครั้งเพื่อสาธิต)
// text: { message, policy, policyTo, settings, reject, accept }
import IconTile from "@/components/IconTile.vue";

defineProps({
  text: { type: Object, required: true },
});
const emit = defineEmits(["accept", "reject"]);

const visible = useCookieConsent();

function choose(kind) {
  visible.value = false;
  emit(kind);
}
</script>

<script>
import { ref } from "vue";

// สถานะร่วมระดับโมดูล — ซ่อนแล้วไม่แสดงซ้ำเมื่อสลับหน้าใน Prototype
const consentVisible = ref(true);
export function useCookieConsent() {
  return consentVisible;
}
</script>

<template>
  <v-slide-y-reverse-transition>
    <div v-if="visible" class="cookie px-4 px-md-6 pb-4 pb-md-6">
      <div class="pf-container">
        <v-card class="pf-bordered pf-elevation-modal pa-4 pa-md-5" role="dialog" :aria-label="text.settings">
          <div class="d-flex flex-column flex-md-row align-md-center ga-4">
            <div class="d-flex align-start align-md-center ga-4 flex-grow-1">
              <IconTile icon="fas fa-circle-info" tone="pink" />
              <p class="pf-type-body-sm text-text-secondary">
                {{ text.message }}
                <router-link :to="text.policyTo" class="text-text-link">{{ text.policy }}</router-link>
              </p>
            </div>
            <div class="d-flex flex-wrap ga-2 flex-shrink-0">
              <v-btn variant="outlined" class="cookie-btn text-text-primary" :to="text.policyTo">
                {{ text.settings }}
              </v-btn>
              <v-btn variant="outlined" class="cookie-btn text-text-primary" @click="choose('reject')">
                {{ text.reject }}
              </v-btn>
              <v-btn variant="flat" class="bg-bg-inverse" @click="choose('accept')">{{ text.accept }}</v-btn>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </v-slide-y-reverse-transition>
</template>

<style scoped>
.cookie {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 1010;
}
.cookie-btn {
  border-color: rgb(var(--v-theme-border-strong));
}
</style>
