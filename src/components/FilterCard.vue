<script setup>
// แผงตัวกรองเหนือตาราง — ใส่ช่องกรอกใน slot (ใช้ <v-col> ได้เลย) แล้วกด ค้นหา / ล้าง
import { common } from "@/content/common.js";
import { size } from "@/design/tokens.js";

defineProps({
  showReset: { type: Boolean, default: true },
});
defineEmits(["search", "reset"]);
</script>

<template>
  <v-card class="pf-bordered pa-5 mb-6">
    <v-form @submit.prevent="$emit('search')">
      <v-row dense align="end">
        <slot />
        <v-col cols="12" md="auto" class="d-flex ga-2">
          <v-btn type="submit" color="primary" prepend-icon="fas fa-magnifying-glass" :height="size['control-lg']">
            {{ common.actions.search }}
          </v-btn>
          <v-btn v-if="showReset" variant="outlined" color="secondary" :height="size['control-lg']" @click="$emit('reset')">
            {{ common.actions.reset }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
