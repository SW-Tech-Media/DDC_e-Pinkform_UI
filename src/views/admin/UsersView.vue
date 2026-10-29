<script setup>
// D15 · Admin / Users & Roles – Permissions (B-16) — Figma node 20:4630
import { computed, reactive, ref } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import AppDialog from "@/components/AppDialog.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import PermissionMatrix from "@/components/users/PermissionMatrix.vue";
import UserFormDialog from "@/components/users/UserFormDialog.vue";
import { usersText as t } from "@/content/users-roles.js";
import { common } from "@/content/common.js";
import {
  groups,
  permissionActions,
  permissionMenus,
  permissionTemplate,
  roles,
  userHistory,
  users as seedUsers,
  usersNow,
} from "@/mocks/users-roles.js";
import { formatDate, formatDateTime, formatTime } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { useSessionStore } from "@/stores/session.js";

const session = useSessionStore();
session.signInAs("thanakorn");

// คัดลอกลึก (structuredClone ใช้กับ reactive proxy ไม่ได้)
const deep = (o) => JSON.parse(JSON.stringify(o));
const clone = (u) => ({ ...u, permissions: deep(u.permissions) });
const list = ref(seedUsers.map(clone));
const history = ref(userHistory.map((h) => ({ ...h })));
const snack = reactive({ show: false, text: "" });
const notify = (text) => Object.assign(snack, { show: true, text });
const log = (action, target, detail) =>
  history.value.unshift({ id: Date.now(), at: usersNow, actor: session.user.name, action, target, detail });

// ---------- แท็บ / ตัวกรอง ----------
const tab = ref("users");
const tabs = computed(() => [
  { value: "users", label: t.tabs.users, count: list.value.length },
  { value: "roles", label: t.tabs.roles, count: Object.keys(roles).length },
]);
const q = ref("");
const group = ref(null);
const role = ref(null);
const groupItems = [{ title: t.filters.allGroups, value: null }, ...Object.entries(groups).map(([value, title]) => ({ value, title }))];
const roleItems = [{ title: t.filters.allRoles, value: null }, ...Object.entries(roles).map(([value, r]) => ({ value, title: r.label }))];

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  return list.value.filter(
    (u) =>
      (!s || u.name.toLowerCase().includes(s) || u.username.toLowerCase().includes(s)) &&
      (!group.value || u.group === group.value) &&
      (!role.value || u.role === role.value)
  );
});
const roleRows = computed(() =>
  Object.entries(roles).map(([key, r]) => ({ key, ...r, count: list.value.filter((u) => u.role === key).length }))
);
const pickRole = (row) => {
  role.value = row.key;
  tab.value = "users";
};

// ---------- ผู้ใช้ที่เลือก + สิทธิ์ (แก้ในสำเนา กด "บันทึกสิทธิ์" จึงมีผล) ----------
const selectedId = ref(1);
const selected = computed(() => list.value.find((u) => u.id === selectedId.value));
const draft = ref(null);
const loadDraft = () => {
  const u = selected.value;
  draft.value = u ? { permissions: deep(u.permissions), twoFactor: u.twoFactor, signer: u.signer } : null;
};
loadDraft();
const select = (u) => {
  selectedId.value = u.id;
  loadDraft();
};
const dirty = computed(
  () =>
    !!selected.value &&
    JSON.stringify(draft.value) !==
      JSON.stringify({ permissions: selected.value.permissions, twoFactor: selected.value.twoFactor, signer: selected.value.signer })
);
const savePermissions = () => {
  Object.assign(selected.value, deep(draft.value));
  log(t.log.permission, selected.value.name, t.log.permissionDetail);
  notify(t.permissions.saved(selected.value.name));
};
const rowClass = (u) => (u.id === selectedId.value ? "pf-row-highlight" : "");

// ---------- รีเซ็ต PIN ----------
const resetting = reactive({ open: false, user: null });
const askReset = (u) => Object.assign(resetting, { open: true, user: u });
const resetPin = () => {
  resetting.user.pinSet = false;
  log(t.log.resetPin, resetting.user.name, t.log.resetPinDetail);
  notify(t.confirmReset.done(resetting.user.name));
};

// ---------- เพิ่ม / แก้ไขผู้ใช้ ----------
const editor = reactive({ open: false, user: null });
const openEditor = (u = null) => Object.assign(editor, { open: true, user: u });
const saveUser = (data) => {
  if (editor.user) {
    const target = list.value.find((u) => u.id === editor.user.id);
    const roleChanged = target.role !== data.role || target.group !== data.group;
    Object.assign(target, { ...data, permissions: roleChanged ? permissionTemplate(data.group, data.role) : target.permissions });
    if (target.id === selectedId.value) loadDraft();
    log(t.log.edit, data.name, `${groups[data.group]} · ${roles[data.role].label}`);
    notify(t.form.updated(data.name));
  } else {
    const id = Math.max(...list.value.map((u) => u.id)) + 1;
    const user = {
      ...data,
      id,
      pinSet: false,
      lastActive: null,
      twoFactor: true,
      signer: false,
      permissions: permissionTemplate(data.group, data.role),
    };
    list.value.unshift(user);
    select(user);
    log(t.log.add, data.name, `${groups[data.group]} · ${roles[data.role].label}`);
    notify(t.form.added(data.name));
  }
};

const historyOpen = ref(false);
</script>

<template>
  <AdminLayout :breadcrumb="t.breadcrumb">
    <PageHeader :title="t.title" :description="t.description">
      <template #actions>
        <SecondaryButton prepend-icon="fas fa-list" @click="historyOpen = true">{{ t.actions.history }}</SecondaryButton>
        <v-btn color="primary" prepend-icon="fas fa-plus" :height="size['control-lg']" @click="openEditor()">
          {{ t.actions.add }}
        </v-btn>
      </template>
    </PageHeader>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="pf-bordered">
          <div class="px-4 pf-bordered-bottom">
            <StatusTabs v-model="tab" :tabs="tabs" />
          </div>

          <template v-if="tab === 'users'">
            <v-row dense class="pa-5">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="q"
                  :placeholder="t.filters.search"
                  :aria-label="t.filters.search"
                  prepend-inner-icon="fas fa-magnifying-glass"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-select v-model="group" :items="groupItems" :aria-label="t.filters.allGroups" hide-details />
              </v-col>
              <v-col cols="6" md="3">
                <v-select v-model="role" :items="roleItems" :aria-label="t.filters.allRoles" hide-details />
              </v-col>
            </v-row>

            <AppDataTable
              :headers="t.headers"
              :items="filtered"
              :per-page="7"
              :show-per-page="false"
              :row-class="rowClass"
              class="users-table"
              @click:row="select"
            >
              <template #item.name="{ item }">
                <div class="py-3">
                  <div class="pf-type-body-sm-strong">{{ item.name }}</div>
                  <div class="pf-type-caption text-text-tertiary">{{ item.username }}</div>
                </div>
              </template>
              <template #item.group="{ item }">
                <span class="group">{{ groups[item.group] }}</span>
              </template>
              <template #item.role="{ item }">
                <StatusBadge :tone="roles[item.role].tone" dot>{{ roles[item.role].label }}</StatusBadge>
              </template>
              <template #item.pinSet="{ item }">
                <StatusBadge :tone="item.pinSet ? 'success' : 'neutral'" dot>
                  {{ item.pinSet ? t.pin.set : t.pin.unset }}
                </StatusBadge>
              </template>
              <template #item.active="{ item }">
                <StatusBadge :tone="item.active ? 'success' : 'neutral'" dot>
                  {{ item.active ? t.status.active : t.status.suspended }}
                </StatusBadge>
              </template>
              <template #item.lastActive="{ item }">
                <template v-if="item.lastActive">
                  <div class="pf-type-body-sm-strong">{{ formatDate(item.lastActive) }}</div>
                  <div class="pf-type-caption text-text-tertiary">{{ formatTime(item.lastActive) }}</div>
                </template>
                <span v-else class="text-text-tertiary">–</span>
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex justify-center ga-2">
                  <TableIconButton icon="far fa-pen-to-square" :label="t.edit" @click="openEditor(item)" />
                  <TableIconButton icon="fas fa-key" :label="t.resetPin" @click="askReset(item)" />
                </div>
              </template>
              <template #no-data>
                <EmptyState icon="fas fa-user-slash" tone="neutral" :title="t.noData" />
              </template>
            </AppDataTable>
          </template>

          <AppDataTable
            v-else
            :headers="t.roleHeaders"
            :items="roleRows"
            item-value="key"
            :paginate="false"
            class="roles-table"
            @click:row="pickRole"
          >
            <template #item.label="{ item }">
              <StatusBadge :tone="item.tone" dot>{{ item.label }}</StatusBadge>
            </template>
            <template #item.description="{ item }">
              <span class="d-block py-3 text-text-secondary">{{ item.description }}</span>
            </template>
            <template #item.count="{ item }">
              <span class="pf-type-body-sm-strong">{{ item.count }}</span>
            </template>
          </AppDataTable>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card v-if="selected && draft" class="pf-bordered">
          <div class="px-6 py-5 pf-bordered-bottom">
            <h2 class="pf-type-h4 text-text-primary">{{ t.permissions.title }}</h2>
            <p class="pf-type-caption text-text-tertiary">
              {{ t.permissions.subtitle(roles[selected.role].label, groups[selected.group], selected.name) }}
            </p>
          </div>
          <PermissionMatrix
            v-model="draft.permissions"
            :menus="permissionMenus"
            :actions="permissionActions"
            :menu-label="t.permissions.menu"
          />
          <div class="px-6 pt-4 pb-6">
            <v-switch
              v-model="draft.twoFactor"
              :label="t.permissions.twoFactor"
              color="success"
              inset
              hide-details
              density="compact"
            />
            <v-switch
              v-model="draft.signer"
              :label="t.permissions.signer"
              color="success"
              inset
              hide-details
              density="compact"
            />
            <div class="d-flex flex-wrap align-center justify-end ga-2 mt-4">
              <span v-if="dirty" class="pf-type-caption text-status-warning-fg me-auto">{{ t.permissions.unsaved }}</span>
              <SecondaryButton :height="size['control-md']" :disabled="!dirty" @click="loadDraft">
                {{ t.permissions.cancel }}
              </SecondaryButton>
              <v-btn color="primary" :height="size['control-md']" @click="savePermissions">{{ t.permissions.save }}</v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <UserFormDialog v-model="editor.open" :user="editor.user" @save="saveUser" />

    <ConfirmDialog
      v-model="resetting.open"
      :title="t.confirmReset.title"
      :message="resetting.user ? t.confirmReset.message(resetting.user.name, resetting.user.email) : ''"
      :confirm-text="t.confirmReset.confirm"
      icon="fas fa-key"
      tone="amber"
      :danger="false"
      @confirm="resetPin"
    />

    <AppDialog v-model="historyOpen" :title="t.history.title" :subtitle="t.history.subtitle" wide>
      <v-card class="pf-bordered">
        <AppDataTable :headers="t.history.headers" :items="history" :per-page="10" :show-per-page="false" :hover="false">
          <template #item.at="{ item }">
            <span class="text-no-wrap">{{ formatDateTime(item.at) }}</span>
          </template>
          <template #item.action="{ item }">
            <StatusBadge tone="info">{{ item.action }}</StatusBadge>
          </template>
          <template #item.target="{ item }">
            <span class="pf-type-body-sm-strong">{{ item.target }}</span>
          </template>
        </AppDataTable>
      </v-card>
      <template #actions>
        <v-btn variant="outlined" color="secondary" @click="historyOpen = false">{{ common.actions.close }}</v-btn>
      </template>
    </AppDialog>

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="3000">
      <v-icon icon="fas fa-circle-check" color="text-text-on-inverse-accent" size="small" class="me-2" />
      {{ snack.text }}
    </v-snackbar>
  </AdminLayout>
</template>

<style scoped>
.users-table :deep(td) {
  white-space: nowrap;
}
.users-table :deep(th),
.users-table :deep(td) {
  padding-inline: var(--pf-space-12) !important;
}
.users-table :deep(tbody tr),
.roles-table :deep(tbody tr) {
  cursor: pointer;
}
.group {
  display: inline-block;
  white-space: normal;
  min-width: var(--pf-space-80);
  max-width: var(--pf-space-120);
}
</style>
