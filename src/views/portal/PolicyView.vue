<script setup>
// P-07 · นโยบายคุกกี้ / ความเป็นส่วนตัว (TOR 4.1.14, 6.1) — ยังไม่มีดีไซน์ใน Figma
// แท็บ นโยบายคุกกี้ / นโยบายความเป็นส่วนตัว (PDPA) · เปิดแท็บตรงด้วย ?tab=privacy
// ตั้งค่าคุกกี้ด้วย switch (คุกกี้จำเป็นปิดไม่ได้) · บันทึก / ยอมรับ / ปฏิเสธ → snackbar และซ่อนแถบคุกกี้ของ D01
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SectionCard from "@/components/SectionCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import { useCookieConsent } from "@/components/portal/CookieBanner.vue";
import PolicySection from "@/components/portal-pages/PolicySection.vue";
import CookieTypeItem from "@/components/portal-pages/CookieTypeItem.vue";
import { cookiePolicy, policyText as t, privacyPolicy } from "@/content/portal-pages.js";
import { cookieDefaults, policyMeta } from "@/mocks/portal-pages.js";
import { formatShortThaiDate } from "@/utils/format.js";

const route = useRoute();
const router = useRouter();
const validTab = (v) => (t.tabs.some((x) => x.value === v) ? v : t.tabs[0].value);
const tab = ref(validTab(route.query.tab));

watch(tab, (v) => router.replace({ query: { ...route.query, tab: v } }));
watch(
  () => route.query.tab,
  (v) => (tab.value = validTab(v)),
);

const policy = computed(() => (tab.value === "privacy" ? privacyPolicy : cookiePolicy));
const meta = computed(() => {
  const m = policyMeta[tab.value];
  return [
    { label: t.updated, value: formatShortThaiDate(m.updated) },
    { label: t.effective, value: formatShortThaiDate(m.effective) },
    { label: t.version, value: m.version },
  ];
});

// ---------- ตั้งค่าคุกกี้ ----------
const prefs = reactive({ ...cookieDefaults });
const bannerVisible = useCookieConsent();
const snackbar = ref(false);
const snackText = ref("");

function apply(kind) {
  if (kind !== "save") {
    cookiePolicy.types.forEach((c) => (prefs[c.key] = c.locked || kind === "acceptAll"));
  }
  bannerVisible.value = false;
  snackText.value = { save: t.settings.saved, acceptAll: t.settings.acceptedAll, rejectAll: t.settings.rejectedAll }[kind];
  snackbar.value = true;
}
</script>

<template>
  <PortalLayout portal>
    <PageHero :title="t.title" :description="t.description" :breadcrumb="t.breadcrumb" overlap />

    <div class="pf-container px-4 px-md-6 pb-14 content">
      <v-card class="pf-bordered pf-elevation-card px-4 px-md-6 pt-3">
        <StatusTabs v-model="tab" :tabs="t.tabs" />
      </v-card>

      <v-row class="mt-2">
        <!-- เนื้อหานโยบาย -->
        <v-col cols="12" md="8">
          <v-card class="pf-bordered pa-5 pa-md-8">
            <div class="d-flex flex-column ga-10">
              <PolicySection v-for="(s, i) in policy.sections" :key="`${tab}-${s.id}`" :section="s" :no="i + 1">
                <!-- การตั้งค่าคุกกี้ -->
                <template v-if="s.settings">
                  <CookieTypeItem
                    v-for="c in cookiePolicy.types"
                    :key="c.key"
                    v-model="prefs[c.key]"
                    :type="c"
                    :always-on="t.settings.alwaysOn"
                    :on-label="t.settings.on"
                    :off-label="t.settings.off"
                  />
                  <div class="d-flex flex-wrap justify-end ga-3 mt-1">
                    <SecondaryButton height="control-md" @click="apply('rejectAll')">{{ t.settings.rejectAll }}</SecondaryButton>
                    <SecondaryButton height="control-md" @click="apply('acceptAll')">{{ t.settings.acceptAll }}</SecondaryButton>
                    <v-btn variant="flat" class="bg-bg-inverse" prepend-icon="far fa-floppy-disk" @click="apply('save')">
                      {{ t.settings.save }}
                    </v-btn>
                  </div>
                </template>
              </PolicySection>
            </div>
          </v-card>
        </v-col>

        <!-- ข้อมูลประกอบ -->
        <v-col cols="12" md="4">
          <div class="aside d-flex flex-column ga-6">
            <SectionCard :title="t.tabs.find((x) => x.value === tab).label">
              <KeyValueList :items="meta" />
            </SectionCard>
            <SectionCard :title="t.toc" class="d-none d-md-flex">
              <nav class="d-flex flex-column mx-n3 my-n3">
                <router-link
                  v-for="(s, i) in policy.sections"
                  :key="s.id"
                  :to="{ query: { tab }, hash: `#${s.id}` }"
                  class="toc-link pf-type-body-sm text-text-secondary px-3 py-2 rounded-lg"
                >
                  {{ i + 1 }}. {{ s.title }}
                </router-link>
              </nav>
            </SectionCard>
            <SectionCard :title="t.contact.title">
              <KeyValueList :items="privacyPolicy.contact" />
            </SectionCard>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snackbar" color="primary" :timeout="2500">
      <v-icon icon="fas fa-circle-check" start />
      {{ snackText }}
    </v-snackbar>
  </PortalLayout>
</template>

<style scoped>
.content {
  margin-top: calc(-1 * var(--pf-space-64));
}
.aside {
  position: sticky;
  top: calc(var(--pf-size-portal-header) + var(--pf-space-24));
}
.toc-link {
  text-decoration: none;
  transition: background-color var(--pf-motion-duration-base) var(--pf-motion-easing);
}
.toc-link:hover {
  background: rgb(var(--v-theme-bg-surface-muted));
  color: rgb(var(--v-theme-text-brand)) !important;
}
</style>
