<script setup>
// Footer ฝั่ง Portal (Figma: Web/Footer) — มีตัวนับผู้เข้าชม (TOR 4.1.13)
import AppBrand from "./AppBrand.vue";
import { portalText } from "@/content/navigation.js";
import { common } from "@/content/common.js";
import { visitors } from "@/mocks/users.js";

const f = portalText.footer;
</script>

<template>
  <footer class="bg-bg-inverse">
    <div class="pf-container px-4 px-md-6 py-12">
      <v-row>
        <v-col cols="12" md="5">
          <AppBrand inverse :subtitle="`${common.division} กรมควบคุมโรค`" />
          <p class="pf-type-body-sm text-text-on-inverse-muted mt-4">{{ f.address }}</p>
        </v-col>
        <v-col v-for="col in f.columns" :key="col.title" cols="6" md="2">
          <h3 class="pf-type-label-md text-text-on-inverse mb-3">{{ col.title }}</h3>
          <router-link
            v-for="l in col.links"
            :key="l.title"
            :to="l.to"
            class="d-block pf-type-body-sm text-text-on-inverse-muted text-decoration-none mb-2"
          >
            {{ l.title }}
          </router-link>
        </v-col>
        <v-col cols="12" md="3">
          <h3 class="pf-type-label-md text-text-on-inverse mb-3">{{ f.contact.title }}</h3>
          <p v-for="line in f.contact.lines" :key="line" class="pf-type-body-sm text-text-on-inverse-muted mb-2">
            {{ line }}
          </p>
        </v-col>
      </v-row>
    </div>
    <div class="footer-bar">
      <div class="pf-container px-4 px-md-6 py-4 d-flex flex-wrap justify-space-between ga-2 pf-type-caption text-text-on-inverse-muted">
        <span>
          {{ f.copyright }}
          <template v-for="p in f.policies" :key="p.title">
            · <router-link :to="p.to" class="text-text-on-inverse-muted">{{ p.title }}</router-link>
          </template>
        </span>
        <span>{{ f.visitors(visitors.total, visitors.today) }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-bar {
  border-top: var(--pf-stroke-default) solid rgb(var(--v-theme-border-inverse));
}
</style>
