<script setup>
// D01 · Portal / Home (มือถือ S01) — Figma 25:6440 · 27:3
import { useDisplay } from "vuetify";
import PortalLayout from "@/layouts/PortalLayout.vue";
import HeroIllustration from "@/components/portal/HeroIllustration.vue";
import StatStrip from "@/components/portal/StatStrip.vue";
import ProcessSteps from "@/components/portal/ProcessSteps.vue";
import NewsCard from "@/components/portal/NewsCard.vue";
import QuickLink from "@/components/portal/QuickLink.vue";
import CookieBanner from "@/components/portal/CookieBanner.vue";
import { homeText as t } from "@/content/portal.js";
import { homeStats, news } from "@/mocks/portal.js";

const { smAndDown } = useDisplay();
</script>

<template>
  <PortalLayout portal>
    <!-- Hero -->
    <section class="bg-bg-inverse hero">
      <div class="pf-container px-4 px-md-6" :class="smAndDown ? 'pt-6' : 'pt-14'">
        <v-row align="center">
          <v-col cols="12" md="6">
            <span class="hero__tag d-inline-block bg-accent-pink-subtle text-text-accent pf-type-label-sm rounded-pill px-3">
              {{ smAndDown ? t.hero.tagShort : t.hero.tag }}
            </span>
            <h1 class="text-text-on-inverse mt-4" :class="smAndDown ? 'pf-type-h1' : 'pf-type-display'">
              <span v-for="line in t.hero.titleLines" :key="line" class="d-block">{{ line }}</span>
              <span class="d-block text-text-on-inverse-accent">{{ t.hero.titleAccent }}</span>
            </h1>
            <p v-if="smAndDown" class="pf-type-body-sm text-text-on-inverse-muted mt-4">{{ t.hero.descriptionShort }}</p>
            <p v-else class="pf-type-body-md text-text-on-inverse-muted mt-6">
              <span v-for="line in t.hero.description" :key="line" class="d-block">{{ line }}</span>
            </p>
            <div class="d-flex flex-wrap ga-3 mt-6">
              <v-btn
                color="accent"
                :size="smAndDown ? 'large' : 'default'"
                :block="smAndDown"
                :append-icon="smAndDown ? undefined : 'fas fa-chevron-right'"
                :to="t.hero.primary.to"
                :active="false"
              >
                {{ t.hero.primary.label }}
              </v-btn>
              <v-btn v-if="!smAndDown" color="surface" :prepend-icon="t.hero.secondary.icon" :to="t.hero.secondary.to">
                {{ t.hero.secondary.label }}
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="!smAndDown" cols="12" md="6">
            <HeroIllustration :text="t.illustration" class="ms-auto hero__illus" />
          </v-col>
        </v-row>
      </div>
    </section>

    <!-- การ์ดสถิติ (ซ้อนขอบล่าง Hero) -->
    <div class="pf-container px-4 px-md-6 stats">
      <StatStrip :items="homeStats" :compact="smAndDown" />
    </div>

    <!-- เมนูลัด (มือถือ S01) -->
    <div v-if="smAndDown" class="pf-container px-4 pt-6">
      <v-row dense>
        <v-col v-for="q in t.mobileTiles" :key="q.title" cols="6">
          <QuickLink tile v-bind="q" />
        </v-col>
      </v-row>
    </div>

    <!-- ขั้นตอนการขอใบรับรองฯ -->
    <section id="steps" class="pf-container px-4 px-md-6 steps" :class="smAndDown ? 'pt-8' : 'pt-14'">
      <h2 :class="smAndDown ? 'pf-type-h4' : 'pf-type-h2'" class="text-text-primary">{{ t.steps.title }}</h2>
      <p v-if="!smAndDown" class="pf-type-body-sm text-text-secondary mt-1 mb-6">{{ t.steps.subtitle }}</p>
      <ProcessSteps :steps="t.steps.items" :compact="smAndDown" :class="smAndDown ? 'mt-3' : ''" />
    </section>

    <!-- ข่าวประชาสัมพันธ์ -->
    <section class="pf-container px-4 px-md-6" :class="smAndDown ? 'pt-8' : 'pt-14'">
      <div class="d-flex align-end justify-space-between ga-4 mb-6">
        <div>
          <h2 :class="smAndDown ? 'pf-type-h4' : 'pf-type-h2'" class="text-text-primary">{{ t.news.title }}</h2>
          <p class="pf-type-body-sm text-text-secondary mt-1">{{ t.news.subtitle }}</p>
        </div>
        <v-btn variant="text" class="flex-shrink-0 text-text-brand" append-icon="fas fa-chevron-right" :to="t.news.to">
          {{ t.news.viewAll }}
        </v-btn>
      </div>
      <v-row>
        <v-col v-for="n in news" :key="n.id" cols="12" md="4">
          <NewsCard :item="n" :read-more="t.news.readMore" :to="t.news.to" />
        </v-col>
      </v-row>
    </section>

    <!-- Quick Links -->
    <section v-if="!smAndDown" class="pf-container px-4 px-md-6 pt-12 pb-14">
      <v-row>
        <v-col v-for="q in t.quickLinks" :key="q.title" cols="12" sm="6" md="3">
          <QuickLink v-bind="q" />
        </v-col>
      </v-row>
    </section>
    <div v-else class="pb-10" />

    <CookieBanner :text="t.cookie" />
  </PortalLayout>
</template>

<style scoped>
.hero {
  padding-bottom: calc(var(--pf-space-80) + var(--pf-space-24));
}
.hero__tag {
  line-height: var(--pf-space-24);
}
.hero__illus {
  max-width: calc(var(--pf-space-120) * 4 + var(--pf-space-40));
}
.stats {
  margin-top: calc(-1 * var(--pf-space-64));
}
.steps {
  scroll-margin-top: var(--pf-size-portal-header);
}
</style>
