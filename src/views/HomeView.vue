<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import PortalLayout from "@/layouts/PortalLayout.vue";
import EntryCard from "@/components/EntryCard.vue";
import PatchNotesDialog from "@/components/PatchNotesDialog.vue";
import { home } from "@/content/home.js";
import { patchNotes, patchNotesText } from "@/content/patch-notes.js";

// เปิด dialog จากลิงก์ได้ด้วย /?patch-notes
const route = useRoute();
const router = useRouter();
const showPatchNotes = ref("patch-notes" in route.query);
watch(showPatchNotes, (open) => {
  const query = { ...route.query };
  if (open) query["patch-notes"] = null;
  else delete query["patch-notes"];
  router.replace({ query });
});

const { xs } = useDisplay();
const currentVersion = patchNotes[0]?.version;
</script>

<template>
  <PortalLayout>
    <template #actions>
      <v-btn
        v-if="xs"
        icon="fas fa-clock-rotate-left"
        variant="outlined"
        color="secondary"
        :aria-label="patchNotesText.button"
        @click="showPatchNotes = true"
      />
      <v-btn
        v-else
        variant="outlined"
        color="secondary"
        prepend-icon="fas fa-clock-rotate-left"
        @click="showPatchNotes = true"
      >
        {{ patchNotesText.button }}
        <span class="pf-type-caption text-text-tertiary ms-2">v{{ currentVersion }}</span>
      </v-btn>
    </template>

    <section class="bg-bg-inverse hero">
      <div class="pf-container px-4 px-md-6 pt-16">
        <p class="pf-type-label-md text-text-on-inverse-accent">{{ home.eyebrow }}</p>
        <h1 class="pf-type-h1 text-text-on-inverse mt-2">{{ home.title }}</h1>
        <p class="pf-type-body-lg text-text-on-inverse-muted mt-3">{{ home.subtitle }}</p>
      </div>
    </section>

    <section class="pf-container px-4 px-md-6 pb-16 cards">
      <h2 class="pf-type-label-md text-text-on-inverse-muted mb-4">{{ home.chooseLabel }}</h2>
      <v-row>
        <v-col v-for="entry in home.entries" :key="entry.key" cols="12" md="4">
          <EntryCard v-bind="entry" />
        </v-col>
      </v-row>
    </section>

    <PatchNotesDialog v-model="showPatchNotes" />
  </PortalLayout>
</template>

<style scoped>
/* การ์ดวางซ้อนขอบล่างของ hero แบบเดียวกับหน้า Portal ใน Figma */
.hero {
  padding-bottom: calc(var(--pf-space-120) + var(--pf-space-24));
}
.cards {
  margin-top: calc(-1 * var(--pf-space-120));
}
</style>
