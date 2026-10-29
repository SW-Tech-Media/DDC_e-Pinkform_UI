<script setup>
// คู่มือ Design System (/design-system) — ค่าทั้งหมดอ่านจาก src/design/tokens.js และใช้ Component จริง
// จึงตรงกับ Prototype เสมอ · คลิกช่องสี / Token เพื่อคัดลอกชื่อ
import { onBeforeUnmount, onMounted, ref } from "vue";
import PortalLayout from "@/layouts/PortalLayout.vue";
import PageHero from "@/components/PageHero.vue";
import SectionCard from "@/components/SectionCard.vue";
import AlertBox from "@/components/AlertBox.vue";
import IconTile from "@/components/IconTile.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import KpiCard from "@/components/KpiCard.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import SegmentedControl from "@/components/SegmentedControl.vue";
import StepIndicator from "@/components/StepIndicator.vue";
import FieldLabel from "@/components/FieldLabel.vue";
import DateField from "@/components/DateField.vue";
import KeyValueList from "@/components/KeyValueList.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import BarChart from "@/components/BarChart.vue";
import EntryCard from "@/components/EntryCard.vue";
import EmptyState from "@/components/EmptyState.vue";
import CodeViewer from "@/components/CodeViewer.vue";
import AppDialog from "@/components/AppDialog.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import DocSection from "@/components/design-system/DocSection.vue";
import ColorSwatch from "@/components/design-system/ColorSwatch.vue";
import ComponentDemo from "@/components/design-system/ComponentDemo.vue";
import { designSystemText as t } from "@/content/design-system.js";
import { common } from "@/content/common.js";
import { colors, font, motion, radius, shadow, size, space } from "@/design/tokens.js";
import { iconTileTones } from "@/design/tones.js";
import { requestStatuses } from "@/mocks/requests.js";
import * as demo from "@/mocks/design-system.js";
import { contrastRatio } from "@/utils/contrast.js";

const palette = colors.light;
const tokens = Object.keys(palette);

// ---------- สี ----------
const colorGroups = t.colors.groups.map((g) => ({
  ...g,
  tokens: tokens.filter((k) => (g.prefix ? k.startsWith(g.prefix) : !k.includes("-"))),
}));

// พื้นที่ใช้คู่กับสีตัวอักษรจริง: on-inverse → พื้น inverse, status fg → status bg, อื่น ๆ → surface
const contrastBg = (token) => {
  if (token.startsWith("text-on-inverse")) return "bg-inverse";
  if (/^status-.+-fg$/.test(token)) return token.replace(/-fg$/, "-bg");
  if (token.startsWith("text-")) return "surface";
  return null;
};
const contrastOf = (token) => {
  const on = contrastBg(token);
  return on ? { ratio: contrastRatio(palette[token], palette[on]), on } : null;
};

// ---------- Typography / Spacing ----------
const typeStyles = Object.entries(font.scale).map(([k, [s, lh, w]]) => ({
  key: k,
  spec: `${s} / ${lh} · ${w} ${font.weight[w]}`,
}));
// utility ของ Vuetify มีถึง 16 (= 64px)
const spaceUtility = (n) => (n % 4 === 0 && n / 4 <= 16 ? `pa-${n / 4}` : "");

const sizeGroups = t.sizes.groups.map((g) => ({
  title: g.title,
  items: g.keys.map((k) => ({ label: `--pf-size-${k}`, value: `${size[k]}px` })),
}));
const motionItems = Object.entries(motion).map(([k, v]) => ({ label: `--pf-motion-${k}`, value: v }));

// ---------- ไอคอนจาก Figma ----------
const svgIcons = Object.keys(import.meta.glob("@/assets/icons/*.svg")).map((p) => p.split("/").pop().replace(".svg", ""));

// ---------- สถานะของตัวอย่าง Component ----------
const tab = ref(demo.demoTabs[1].value);
const segment = ref(demo.demoSegments[0].value);
const country = ref(null);
const dateRange = ref(null);
const dialog = ref(false);
const confirm = ref(false);
const demoOf = Object.fromEntries(t.components.items.map((x) => [x.key, x]));

// ---------- คัดลอกชื่อ Token ----------
const snackbar = ref(false);
const snackText = ref("");
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // บาง browser ไม่อนุญาต clipboard — ยังแสดงชื่อ Token ใน snackbar ให้คัดลอกเองได้
  }
  snackText.value = t.copied(value);
  snackbar.value = true;
}

// ---------- เมนูหัวข้อ: ไฮไลต์หัวข้อที่กำลังอ่าน ----------
const active = ref(t.sections[0].id);
let observer;
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) active.value = visible[0].target.id;
    },
    { rootMargin: "-20% 0px -60% 0px" }
  );
  t.sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
});
onBeforeUnmount(() => observer?.disconnect());

function go(id) {
  active.value = id;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <PortalLayout>
    <PageHero :title="t.title" :description="t.description" :breadcrumb="[{ title: t.home, to: { name: 'home' } }, { title: t.title }]" />

    <div class="pf-container px-4 px-md-6 py-10">
      <v-row>
        <!-- เมนูหัวข้อ -->
        <v-col cols="12" md="3">
          <nav class="toc" :aria-label="t.navLabel">
            <v-card class="pf-bordered pa-2 d-none d-md-block">
              <v-list density="compact" nav class="pa-0">
                <v-list-item
                  v-for="s in t.sections"
                  :key="s.id"
                  :active="active === s.id"
                  :prepend-icon="s.icon"
                  :title="s.title"
                  color="primary"
                  rounded="lg"
                  class="pf-type-label-md"
                  @click="go(s.id)"
                />
              </v-list>
            </v-card>
            <div class="d-flex d-md-none flex-wrap ga-2">
              <v-chip v-for="s in t.sections" :key="s.id" :prepend-icon="s.icon" variant="outlined" size="small" @click="go(s.id)">
                {{ s.title }}
              </v-chip>
            </div>
            <v-btn
              :href="t.figma.href"
              target="_blank"
              rel="noopener"
              variant="text"
              color="primary"
              append-icon="fas fa-arrow-up-right-from-square"
              class="mt-3 px-2"
            >
              {{ t.figma.label }}
            </v-btn>
          </nav>
        </v-col>

        <v-col cols="12" md="9" class="d-flex flex-column ga-14">
          <!-- หลักการ -->
          <DocSection v-bind="t.sections[0]">
            <v-row>
              <v-col v-for="p in t.principles" :key="p.title" cols="12" sm="6">
                <v-card class="pf-bordered pa-5 h-100">
                  <div class="d-flex align-center ga-3">
                    <IconTile :icon="p.icon" :tone="p.tone" />
                    <h3 class="pf-type-h4 text-text-primary">{{ p.title }}</h3>
                  </div>
                  <p class="pf-type-body-sm text-text-secondary mt-3">{{ p.body }}</p>
                  <div class="d-flex flex-wrap ga-2 mt-3">
                    <code v-for="c in p.code" :key="c" class="token pf-type-caption-strong bg-bg-subtle text-text-brand px-2">{{ c }}</code>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </DocSection>

          <!-- สี -->
          <DocSection v-bind="t.sections[1]" :description="t.colors.description">
            <AlertBox tone="warning" :title="t.colors.warning.title">{{ t.colors.warning.body }}</AlertBox>
            <SectionCard v-for="g in colorGroups" :key="g.title" :title="g.title" :subtitle="g.description">
              <div class="swatches">
                <ColorSwatch
                  v-for="k in g.tokens"
                  :key="k"
                  :token="k"
                  :hex="palette[k]"
                  :contrast="contrastOf(k)"
                  :hint="t.copyHint"
                  @copy="copy"
                />
              </div>
            </SectionCard>
          </DocSection>

          <!-- ตัวอักษร -->
          <DocSection v-bind="t.sections[2]" :description="t.typography.description">
            <SectionCard flush>
              <v-table class="bg-transparent">
                <thead>
                  <tr>
                    <th class="pf-type-label-sm text-text-secondary ps-6">{{ t.typography.columns.style }}</th>
                    <th class="pf-type-label-sm text-text-secondary">{{ t.typography.columns.sample }}</th>
                    <th class="pf-type-label-sm text-text-secondary text-end text-no-wrap pe-6">{{ t.typography.columns.spec }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in typeStyles" :key="s.key" class="type-row" @click="copy(`pf-type-${s.key}`)">
                    <td class="ps-6 py-3">
                      <code class="token pf-type-caption-strong bg-bg-subtle text-text-brand px-2 text-no-wrap">.pf-type-{{ s.key }}</code>
                    </td>
                    <td class="py-3">
                      <span :class="`pf-type-${s.key}`" class="text-text-primary">{{ t.typography.sample }}</span>
                    </td>
                    <td class="pe-6 py-3 text-end pf-type-caption text-text-tertiary text-no-wrap">{{ s.spec }}</td>
                  </tr>
                </tbody>
              </v-table>
            </SectionCard>
          </DocSection>

          <!-- ระยะห่าง -->
          <DocSection v-bind="t.sections[3]" :description="t.spacing.description">
            <SectionCard>
              <div class="d-flex flex-column ga-3">
                <button v-for="n in space" :key="n" type="button" class="space-row d-flex align-center ga-4 text-start" @click="copy(`--pf-space-${n}`)">
                  <code class="space-row__name pf-type-caption-strong text-text-brand">--pf-space-{{ n }}</code>
                  <span class="space-row__bar bg-accent rounded-sm" :style="{ width: `var(--pf-space-${n})` }" />
                  <span class="pf-type-caption text-text-tertiary">{{ n }}px</span>
                  <StatusBadge v-if="spaceUtility(n)" tone="info" class="ms-auto">{{ t.spacing.utility }} {{ spaceUtility(n) }}</StatusBadge>
                </button>
              </div>
            </SectionCard>
          </DocSection>

          <!-- มุมโค้งและเงา -->
          <DocSection v-bind="t.sections[4]">
            <SectionCard :title="t.shape.radiusTitle" :subtitle="t.shape.radiusDescription">
              <div class="tiles">
                <button v-for="(v, k) in radius" :key="k" type="button" class="d-flex flex-column align-center ga-2" @click="copy(`--pf-radius-${k}`)">
                  <span class="radius-box bg-accent-teal-subtle" :style="{ borderRadius: `var(--pf-radius-${k})` }" />
                  <span class="pf-type-label-sm text-text-primary">{{ k }}</span>
                  <span class="pf-type-caption text-text-tertiary">{{ v }}px</span>
                </button>
              </div>
            </SectionCard>
            <SectionCard :title="t.shape.shadowTitle" :subtitle="t.shape.shadowDescription">
              <div class="tiles tiles--wide">
                <button v-for="(v, k) in shadow" :key="k" type="button" class="d-flex flex-column ga-3 text-start" @click="copy(`--pf-shadow-${k}`)">
                  <span class="shadow-box bg-surface rounded-lg" :style="{ boxShadow: `var(--pf-shadow-${k})` }" />
                  <span>
                    <span class="d-block pf-type-label-sm text-text-primary">{{ k }}</span>
                    <span class="d-block pf-type-caption text-text-tertiary">{{ t.shape.shadowUse[k] }}</span>
                  </span>
                </button>
              </div>
            </SectionCard>
          </DocSection>

          <!-- ขนาดและ Layout -->
          <DocSection v-bind="t.sections[5]" :description="t.sizes.description">
            <v-row>
              <v-col v-for="g in sizeGroups" :key="g.title" cols="12" lg="4">
                <SectionCard :title="g.title" class="h-100">
                  <KeyValueList :items="g.items" />
                </SectionCard>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="8">
                <SectionCard :title="t.sizes.breakpoints.title" class="h-100">
                  <KeyValueList :items="t.sizes.breakpoints.items" :columns="2" />
                </SectionCard>
              </v-col>
              <v-col cols="12" lg="4">
                <SectionCard :title="t.sizes.motionTitle" class="h-100">
                  <KeyValueList :items="motionItems" />
                </SectionCard>
              </v-col>
            </v-row>
          </DocSection>

          <!-- ไอคอน -->
          <DocSection v-bind="t.sections[6]">
            <SectionCard :title="t.icons.figmaTitle" :subtitle="t.icons.figmaDescription">
              <div class="icons">
                <button v-for="n in svgIcons" :key="n" type="button" class="icon-cell d-flex flex-column align-center ga-2 pa-3 rounded-lg" @click="copy(n)">
                  <SvgIcon :name="n" class="svg-demo text-icon-brand" />
                  <span class="pf-type-caption text-text-secondary">{{ n }}</span>
                </button>
              </div>
            </SectionCard>
            <SectionCard :title="t.icons.faTitle" :subtitle="t.icons.faDescription">
              <div class="icons">
                <button v-for="x in t.icons.common" :key="x.icon" type="button" class="icon-cell d-flex flex-column align-center ga-2 pa-3 rounded-lg" @click="copy(x.icon)">
                  <v-icon :icon="x.icon" color="icon-default" />
                  <span class="pf-type-caption text-text-secondary">{{ x.label }}</span>
                  <span class="pf-type-caption text-text-tertiary">{{ x.icon }}</span>
                </button>
              </div>
            </SectionCard>
          </DocSection>

          <!-- Component -->
          <DocSection v-bind="t.sections[7]" :description="t.components.description">
            <ComponentDemo v-bind="demoOf.buttons" :props-label="t.propsLabel">
              <div class="d-flex flex-wrap align-center ga-3">
                <v-btn color="primary" prepend-icon="fas fa-check">{{ t.components.buttons.primary }}</v-btn>
                <v-btn color="accent" class="pf-brand-shadow">{{ t.components.buttons.accent }}</v-btn>
                <v-btn variant="outlined" color="secondary">{{ t.components.buttons.outlined }}</v-btn>
                <SecondaryButton icon="fas fa-file-csv" height="control-md">{{ t.components.buttons.secondary }}</SecondaryButton>
                <v-btn variant="text" color="primary" append-icon="fas fa-arrow-right">{{ t.components.buttons.text }}</v-btn>
                <v-btn class="bg-bg-inverse text-text-on-inverse" prepend-icon="fas fa-lock">{{ t.components.buttons.inverse }}</v-btn>
                <v-btn color="primary" disabled>{{ t.components.buttons.disabled }}</v-btn>
              </div>
              <div class="d-flex flex-wrap align-center ga-3 mt-4">
                <v-btn v-for="(label, k) in t.components.buttons.sizes" :key="k" color="primary" :height="size[k]">{{ label }}</v-btn>
              </div>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.badge" :props-label="t.propsLabel">
              <div class="d-flex flex-wrap ga-2">
                <StatusBadge v-for="b in demo.demoBadges" :key="b.tone" :tone="b.tone">{{ b.label }}</StatusBadge>
              </div>
              <div class="d-flex flex-wrap ga-2 mt-3">
                <StatusBadge v-for="b in demo.demoBadges" :key="b.tone" :tone="b.tone" dot>{{ b.tone }}</StatusBadge>
              </div>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf['icon-tile']" :props-label="t.propsLabel">
              <div class="d-flex flex-wrap align-center ga-3">
                <IconTile v-for="(v, tone) in iconTileTones" :key="tone" icon="fas fa-shield-halved" :tone="tone" />
              </div>
              <div class="d-flex flex-wrap align-center ga-3 mt-3">
                <IconTile v-for="(v, tone) in iconTileTones" :key="tone" icon="fas fa-shield-halved" :tone="tone" size="lg" />
              </div>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.alert" :props-label="t.propsLabel">
              <div class="d-flex flex-column ga-3">
                <AlertBox v-for="a in demo.demoAlerts" :key="a.tone" :tone="a.tone" :title="a.title">{{ a.body }}</AlertBox>
              </div>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.kpi" :props-label="t.propsLabel">
              <v-row>
                <v-col v-for="k in demo.demoKpis" :key="k.label" cols="12" sm="6">
                  <KpiCard v-bind="k" />
                </v-col>
              </v-row>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.tabs" :props-label="t.propsLabel">
              <div class="d-flex flex-column ga-4">
                <v-card class="pf-bordered px-4">
                  <StatusTabs v-model="tab" :tabs="demo.demoTabs" />
                </v-card>
                <div>
                  <SegmentedControl v-model="segment" :options="demo.demoSegments" class="bg-surface" />
                </div>
              </div>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.stepper" :props-label="t.propsLabel">
              <StepIndicator :steps="demo.demoSteps" :current="2" />
              <v-divider color="border-default" class="border-opacity-100 my-6" />
              <StepIndicator :steps="demo.demoLoginSteps" :current="1" compact />
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.form" :props-label="t.propsLabel">
              <v-row>
                <v-col cols="12" md="6">
                  <FieldLabel :label="t.components.form.name" required for="ds-name" />
                  <v-text-field id="ds-name" :placeholder="t.components.form.namePlaceholder" :error-messages="t.components.form.error" />
                </v-col>
                <v-col cols="12" md="6">
                  <FieldLabel :label="t.components.form.country" for="ds-country" />
                  <v-select id="ds-country" v-model="country" :items="demo.demoCountries" :placeholder="t.components.form.countryPlaceholder" />
                </v-col>
                <v-col cols="12" md="6">
                  <FieldLabel :label="t.components.form.date" for="ds-date" />
                  <DateField id="ds-date" v-model="dateRange" range clearable :placeholder="t.components.form.datePlaceholder" />
                </v-col>
              </v-row>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf['key-value']" :props-label="t.propsLabel">
              <KeyValueList :items="demo.demoKeyValues" :columns="2" />
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.table" :props-label="t.propsLabel">
              <v-card class="pf-bordered">
                <AppDataTable
                  :headers="demo.demoTable.headers"
                  :items="demo.demoTable.items"
                  item-value="ref"
                  :paginate="false"
                  :row-class="(x) => (x.flagged ? 'pf-row-highlight' : '')"
                >
                  <template #item.status="{ item }">
                    <StatusBadge :tone="requestStatuses[item.status].tone">{{ requestStatuses[item.status].label }}</StatusBadge>
                  </template>
                  <template #item.actions>
                    <div class="d-flex justify-end ga-2">
                      <TableIconButton icon="far fa-eye" :label="common.actions.view" tone="icon-brand" />
                      <TableIconButton icon="far fa-pen-to-square" :label="common.actions.edit" />
                      <TableIconButton icon="far fa-trash-can" :label="common.actions.delete" tone="status-danger-fg" />
                    </div>
                  </template>
                </AppDataTable>
              </v-card>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.chart" :props-label="t.propsLabel">
              <BarChart v-bind="demo.demoChart" />
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.cards" :props-label="t.propsLabel">
              <v-row>
                <v-col cols="12" md="6">
                  <EntryCard v-bind="demo.demoEntry" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-card class="pf-bordered h-100">
                    <EmptyState v-bind="demo.demoEmpty" />
                  </v-card>
                </v-col>
              </v-row>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.code" :props-label="t.propsLabel">
              <div class="rounded-lg overflow-hidden">
                <CodeViewer v-bind="demo.demoCode" />
              </div>
            </ComponentDemo>

            <ComponentDemo v-bind="demoOf.dialog" :props-label="t.propsLabel">
              <div class="d-flex flex-wrap ga-3">
                <v-btn color="primary" prepend-icon="far fa-window-maximize" @click="dialog = true">{{ t.components.openDialog }}</v-btn>
                <v-btn variant="outlined" color="error" prepend-icon="far fa-trash-can" @click="confirm = true">{{ t.components.openConfirm }}</v-btn>
              </div>
              <AppDialog v-model="dialog" :title="demo.demoDialog.title" :subtitle="demo.demoDialog.subtitle">
                <p class="pf-type-body-md text-text-secondary">{{ t.components.dialogBody }}</p>
                <template #actions>
                  <v-btn variant="outlined" color="secondary" @click="dialog = false">{{ common.actions.cancel }}</v-btn>
                  <v-btn color="primary" @click="dialog = false">{{ common.actions.save }}</v-btn>
                </template>
              </AppDialog>
              <ConfirmDialog
                v-model="confirm"
                :title="demo.demoDialog.confirmTitle"
                :message="demo.demoDialog.confirmMessage"
                :confirm-text="demo.demoDialog.confirmText"
              />
            </ComponentDemo>
          </DocSection>

          <!-- Layout -->
          <DocSection v-bind="t.sections[8]" :description="t.layouts.description">
            <v-row>
              <v-col v-for="l in t.layouts.items" :key="l.name" cols="12" md="4">
                <v-card class="pf-bordered pa-5 h-100 d-flex flex-column">
                  <code class="pf-type-label-md text-text-brand">{{ l.name }}</code>
                  <p class="pf-type-body-sm text-text-secondary mt-2">{{ l.use }}</p>
                  <p class="pf-type-caption text-text-tertiary mt-1 flex-grow-1">{{ l.props }}</p>
                  <v-btn :to="l.to" variant="text" color="primary" append-icon="fas fa-arrow-right" class="mt-3 align-self-start px-0">
                    {{ t.layouts.open }}
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </DocSection>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snackbar" :timeout="2000" color="bg-bg-inverse">{{ snackText }}</v-snackbar>
  </PortalLayout>
</template>

<style scoped>
.toc {
  position: sticky;
  top: calc(var(--pf-size-portal-header) + var(--pf-space-24));
}
.token {
  border-radius: var(--pf-radius-xs);
}
.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(var(--pf-space-120) + var(--pf-space-40)), 1fr));
  gap: var(--pf-space-12);
}
.type-row {
  cursor: pointer;
}
.type-row:hover > td {
  background: rgb(var(--v-theme-bg-surface-muted));
}
.space-row__name {
  min-width: calc(var(--pf-space-120) - var(--pf-space-8));
}
.space-row__bar {
  height: var(--pf-space-12);
  min-width: var(--pf-stroke-default);
}
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--pf-space-80), 1fr));
  gap: var(--pf-space-16);
}
.tiles--wide {
  grid-template-columns: repeat(auto-fill, minmax(calc(var(--pf-space-120) + var(--pf-space-32)), 1fr));
  gap: var(--pf-space-24);
}
.radius-box {
  width: var(--pf-space-64);
  height: var(--pf-space-64);
  border: var(--pf-stroke-default) solid rgb(var(--v-theme-border-focus));
}
.shadow-box {
  height: var(--pf-space-80);
}
.icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(var(--pf-space-120) - var(--pf-space-8)), 1fr));
  gap: var(--pf-space-8);
}
.icon-cell {
  transition: background-color var(--pf-motion-duration-fast) var(--pf-motion-easing);
}
.icon-cell:hover {
  background: rgb(var(--v-theme-bg-surface-muted));
}
.svg-demo {
  width: var(--pf-size-icon-lg);
  height: var(--pf-size-icon-lg);
}
.pf-brand-shadow {
  box-shadow: var(--pf-shadow-brand);
}
</style>
