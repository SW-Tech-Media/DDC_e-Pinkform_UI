<script setup>
// P-06 · แบบสอบถามความพึงพอใจ (ยังไม่มีดีไซน์ใน Figma)
// ข้อมูลผู้ตอบ (ประเภทผู้ใช้ · ช่องทาง · อีเมล) · คะแนน 1–5 หลายด้าน · ข้อเสนอแนะ · ยินยอม PDPA
// ตรวจความครบถ้วนก่อนส่ง → แสดงหน้าขอบคุณ (state ในหน้า) · "ตอบอีกครั้ง" ล้างฟอร์ม
import { computed, reactive, ref } from "vue";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SectionCard from "@/components/SectionCard.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import AlertBox from "@/components/AlertBox.vue";
import EmptyState from "@/components/EmptyState.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import RatingScale from "@/components/portal-pages/RatingScale.vue";
import { surveyOptions as o, surveyText as t } from "@/content/portal-pages.js";
import { surveySubmission } from "@/mocks/portal-pages.js";
import { formatDateTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";

const emptyRatings = () => Object.fromEntries(o.aspects.map((a) => [a.key, null]));

const form = ref(null);
const userType = ref(null);
const channel = ref(null);
const email = ref("");
const feedback = ref("");
const consent = ref(false);
const ratings = reactive(emptyRatings());
const attempted = ref(false);
const submitted = ref(false);

const rules = {
  required: [(v) => !!v || t.errors.required],
  email: [(v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t.errors.email],
  feedback: [(v) => (v ?? "").length <= o.feedbackMax || t.errors.max(o.feedbackMax)],
  consent: [(v) => !!v || t.errors.consent],
};

const rated = computed(() => o.aspects.filter((a) => ratings[a.key]).length);
const ratingsOk = computed(() => rated.value === o.aspects.length);
const average = computed(() => (o.aspects.reduce((s, a) => s + (ratings[a.key] ?? 0), 0) / o.aspects.length).toFixed(1));

async function submit() {
  attempted.value = true;
  const { valid } = await form.value.validate();
  if (!valid || !ratingsOk.value) return;
  submitted.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function reset() {
  form.value?.reset();
  Object.assign(ratings, emptyRatings());
  attempted.value = false;
}

function again() {
  submitted.value = false;
  userType.value = null;
  channel.value = null;
  email.value = "";
  feedback.value = "";
  consent.value = false;
  Object.assign(ratings, emptyRatings());
  attempted.value = false;
}

const summary = computed(() => [
  { label: t.thanks.reference, value: surveySubmission.reference },
  { label: t.thanks.submittedAt, value: formatDateTime(surveySubmission.submittedAt) },
  { label: t.respondent.userType, value: o.userTypes.find((u) => u.value === userType.value)?.label ?? "" },
  { label: t.thanks.average, value: `${average.value} / 5` },
]);
</script>

<template>
  <PortalLayout portal>
    <PageHero :title="t.title" :description="t.description" :breadcrumb="t.breadcrumb" overlap />

    <div class="pf-container px-4 px-md-6 pb-14 content">
      <!-- หน้าขอบคุณ -->
      <v-card v-if="submitted" class="pf-bordered pf-elevation-card">
        <EmptyState :icon="t.thanks.icon" tone="green" :title="t.thanks.title" :description="t.thanks.description" />
        <div class="thanks-summary mx-auto px-4 px-md-6 pb-6">
          <div class="pa-5 rounded-lg bg-bg-surface-muted">
            <KeyValueList :items="summary" :columns="2" />
          </div>
          <div class="d-flex flex-wrap justify-center ga-3 mt-6">
            <SecondaryButton icon="fas fa-rotate-left" @click="again">{{ t.thanks.again }}</SecondaryButton>
            <v-btn color="primary" variant="flat" :height="size['control-lg']" prepend-icon="fas fa-house" :to="{ name: 'portal-home' }">
              {{ t.thanks.home }}
            </v-btn>
          </div>
        </div>
      </v-card>

      <v-row v-else>
        <v-col cols="12" md="8">
          <v-form ref="form" class="d-flex flex-column ga-6" @submit.prevent="submit">
            <AlertBox v-if="attempted && !ratingsOk" tone="danger">{{ t.errors.summary }}</AlertBox>

            <!-- 1. ข้อมูลผู้ตอบ -->
            <SectionCard :title="t.respondent.title" class="pf-elevation-card">
              <FieldLabel :label="t.respondent.userType" required />
              <v-radio-group v-model="userType" :rules="rules.required" color="primary" class="user-types">
                <v-row dense>
                  <v-col v-for="u in o.userTypes" :key="u.value" cols="12" sm="6">
                    <v-radio :value="u.value" :label="u.label" class="pf-type-body-md" />
                  </v-col>
                </v-row>
              </v-radio-group>

              <v-row class="mt-1">
                <v-col cols="12" sm="6">
                  <FieldLabel :label="t.respondent.channel" required for="sv-channel" />
                  <v-select
                    id="sv-channel"
                    v-model="channel"
                    :items="o.channels"
                    :placeholder="t.respondent.channelPlaceholder"
                    :rules="rules.required"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <FieldLabel :label="t.respondent.email" for="sv-email" />
                  <v-text-field
                    id="sv-email"
                    v-model="email"
                    type="email"
                    :rules="rules.email"
                    :hint="t.respondent.emailHint"
                    persistent-hint
                    prepend-inner-icon="far fa-envelope"
                    density="comfortable"
                  />
                </v-col>
              </v-row>
            </SectionCard>

            <!-- 2. คะแนน -->
            <SectionCard :title="t.rating.title" :subtitle="t.rating.subtitle" class="pf-elevation-card">
              <template #actions>
                <span class="pf-type-caption-strong" :class="ratingsOk ? 'text-status-success-fg' : 'text-text-tertiary'">
                  {{ t.progress(rated, o.aspects.length) }}
                </span>
              </template>
              <div class="d-flex flex-column ga-3">
                <div v-for="a in o.aspects" :key="a.key">
                  <RatingScale
                    v-model="ratings[a.key]"
                    :aspect="a"
                    :low="t.rating.low"
                    :high="t.rating.high"
                    :error="attempted && !ratings[a.key]"
                    :error-text="t.errors.rating"
                  />
                </div>
              </div>
            </SectionCard>

            <!-- 3. ข้อเสนอแนะ -->
            <SectionCard :title="t.feedback.title" class="pf-elevation-card">
              <FieldLabel :label="t.feedback.label" for="sv-feedback" />
              <v-textarea
                id="sv-feedback"
                v-model="feedback"
                :placeholder="t.feedback.placeholder"
                :rules="rules.feedback"
                :counter="o.feedbackMax"
                rows="4"
                auto-grow
              />
              <v-checkbox v-model="consent" :rules="rules.consent" color="primary" class="mt-2">
                <template #label>
                  <span class="pf-type-body-sm text-text-secondary">
                    {{ t.consent }}
                    <router-link :to="t.consentTo" class="text-text-link" @click.stop>{{ t.consentLink }}</router-link>
                  </span>
                </template>
              </v-checkbox>

              <template #footer>
                <div class="d-flex flex-wrap justify-end ga-3">
                  <SecondaryButton icon="fas fa-eraser" @click="reset">{{ t.reset }}</SecondaryButton>
                  <v-btn type="submit" color="accent" variant="flat" :height="size['control-lg']" prepend-icon="far fa-paper-plane">
                    {{ t.submit }}
                  </v-btn>
                </div>
              </template>
            </SectionCard>
          </v-form>
        </v-col>

        <!-- ข้อมูลประกอบ -->
        <v-col cols="12" md="4">
          <SectionCard :title="t.info.title" class="info-card">
            <div class="d-flex flex-column ga-4">
              <div v-for="i in t.info.items" :key="i.text" class="d-flex align-start ga-3">
                <v-icon :icon="i.icon" size="small" color="icon-brand" class="mt-1" />
                <span class="pf-type-body-sm text-text-secondary">{{ i.text }}</span>
              </div>
            </div>
          </SectionCard>
        </v-col>
      </v-row>
    </div>
  </PortalLayout>
</template>

<style scoped>
.content {
  margin-top: calc(-1 * var(--pf-space-64));
}
.thanks-summary {
  max-width: var(--pf-size-dialog-md);
  margin-top: calc(-1 * var(--pf-space-32));
}
.info-card {
  position: sticky;
  top: calc(var(--pf-size-portal-header) + var(--pf-space-24));
}
</style>
