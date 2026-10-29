<script setup>
// กล่องแสดง XML พื้นเข้ม (Figma: ebXML Header ใน D16)
// lines: [{ text, indent?, accent? }] — accent = แท็กหลัก (text-on-inverse-accent)
defineProps({
  lines: { type: Array, required: true },
  title: { type: String, default: "" },
  caption: { type: String, default: "" },
});
</script>

<template>
  <div class="xml bg-bg-inverse pa-6 h-100">
    <div v-if="title || caption" class="d-flex flex-wrap justify-space-between ga-2 mb-4">
      <span class="pf-type-body-sm text-text-on-inverse-muted">{{ title }}</span>
      <span class="pf-type-caption text-text-on-inverse-muted">{{ caption }}</span>
    </div>
    <pre class="xml__code pf-type-body-sm"><code><span
      v-for="(l, i) in lines"
      :key="i"
      class="d-block"
      :class="l.accent ? 'text-text-on-inverse-accent' : 'text-text-on-inverse'"
      :style="{ paddingInlineStart: `calc(var(--pf-space-12) * ${l.indent ?? 0})` }"
    >{{ l.text }}</span></code></pre>
  </div>
</template>

<style scoped>
.xml__code {
  font-family: var(--pf-font-family);
  overflow-x: auto;
  white-space: pre;
  margin: 0;
  line-height: calc(var(--pf-type-body-sm-line) + var(--pf-space-4));
}
.xml__code code {
  font: inherit;
}
</style>
