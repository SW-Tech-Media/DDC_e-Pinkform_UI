<script setup>
// D15 · Admin / Users & Roles – Permissions (B-16) — Figma node 20:4630
// สถานะบัญชี (G-11): ใช้งาน / รอยืนยันอีเมล (ปุ่มส่งลิงก์ใหม่) / ระงับ (ปุ่มปลดล็อก) / ปิดใช้งาน — ปุ่มแสดงตามสิทธิ์ users.edit
// ระงับจากการกรอกรหัสผ่านผิดที่ B-01 แล้วขึ้นที่นี่ทันที (สถานะร่วมใน mocks/auth.js) · ตัวอย่างที่ถูกระงับอยู่แล้ว: ชัยวัฒน์ พรหมมา
// query ?q= &group= &role= &status=<key ใน usersText.status> — ลิงก์ / รีเฟรชกลับมาที่ผลเดิม
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PageHeader from "@/components/PageHeader.vue";
import StatusTabs from "@/components/StatusTabs.vue";
import AppDataTable from "@/components/AppDataTable.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import EmptyState from "@/components/EmptyState.vue";
import SecondaryButton from "@/components/SecondaryButton.vue";
import TableIconButton from "@/components/TableIconButton.vue";
import AppDialog from "@/components/AppDialog.vue";
import AlertBox from "@/components/AlertBox.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import PermissionMatrix from "@/components/users/PermissionMatrix.vue";
import UserFormDialog from "@/components/users/UserFormDialog.vue";
import { usersText as t } from "@/content/users-roles.js";
import { common } from "@/content/common.js";
import { groups, permissionActions, permissionMenus, permissionTemplate, roles } from "@/mocks/users-roles.js";
import { formatDate, formatDateTime, formatTime, nowThaiIso } from "@/utils/format.js";
import { size } from "@/design/tokens.js";
import { storeToRefs } from "pinia";
import { useSessionStore } from "@/stores/session.js";
import { useUsersStore } from "@/stores/users.js";
import { useAuditStore } from "@/stores/audit.js";

const route = useRoute();
const router = useRouter();
const session = useSessionStore();
session.signInAs("thanakorn");

// คัดลอกลึก (structuredClone ใช้กับ reactive proxy ไม่ได้)
const deep = (o) => JSON.parse(JSON.stringify(o));
// รายชื่ออยู่ใน store — บันทึกสิทธิ์แล้วเมนู Sidebar ของบัญชีนั้นเปลี่ยนทันที (เมื่อสลับบทบาทเป็นบัญชีนั้น)
const usersStore = useUsersStore();
const { list, history } = storeToRefs(usersStore);
const statusOf = (u) => usersStore.statusOf(u);

// สิทธิ์ของผู้แก้ไข — ซ่อนปุ่มตามสิทธิ์เมนู "ผู้ใช้งานและสิทธิ์" (backend ตรวจจริง)
// สมมติฐานรอ Q-15: แก้ไขบัญชี Super Admin ได้เฉพาะ Super Admin
const canCreate = computed(() => session.can("users", "create"));
const canEdit = computed(() => session.can("users", "edit"));
const canManage = (u) => canEdit.value && (u.role !== "superadmin" || session.account?.role === "superadmin");
// error = เรียก API ไม่สำเร็จ แสดงปุ่ม "ลองใหม่" (retry)
const snack = reactive({ show: false, text: "", error: false, retry: null });
const notify = (text) => Object.assign(snack, { show: true, text, error: false, retry: null });
const fail = (retry) => Object.assign(snack, { show: true, text: t.failed, error: true, retry });
const log = (action, target, detail) => usersStore.addHistory(session.user.name, action, target, detail);

// ---------- แท็บ / ตัวกรอง ----------
const tab = ref("users");
const tabs = computed(() => [
  { value: "users", label: t.tabs.users, count: list.value.length },
  { value: "roles", label: t.tabs.roles, count: Object.keys(roles).length },
]);
const pick = (v, map) => (typeof v === "string" && v in map ? v : null);
const q = ref("");
const group = ref(null);
const role = ref(null);
const status = ref(null);
const groupItems = [{ title: t.filters.allGroups, value: null }, ...Object.entries(groups).map(([value, title]) => ({ value, title }))];
const roleItems = [{ title: t.filters.allRoles, value: null }, ...Object.entries(roles).map(([value, r]) => ({ value, title: r.label }))];
const statusItems = [{ title: t.filters.allStatuses, value: null }, ...Object.entries(t.status).map(([value, s]) => ({ value, title: s.label }))];

// ตัวกรอง ↔ query — เปิดลิงก์ / รีเฟรช / ลิงก์ภายในที่เปลี่ยนเฉพาะ query กลับมาที่ผลเดิม
const toQuery = () => {
  const query = {};
  if (q.value?.trim()) query.q = q.value.trim();
  if (group.value) query.group = group.value;
  if (role.value) query.role = role.value;
  if (status.value) query.status = status.value;
  return query;
};
const norm = (o) => JSON.stringify(Object.keys(o).sort().map((k) => [k, o[k]]));
const sameQuery = (query) => norm(toQuery()) === norm(query);
const fromQuery = (query) => {
  if (sameQuery(query)) return; // ไม่เขียนทับข้อความค้นหาที่กำลังพิมพ์ (เช่น เว้นวรรคท้าย)
  q.value = typeof query.q === "string" ? query.q : "";
  group.value = pick(query.group, groups);
  role.value = pick(query.role, roles);
  status.value = pick(query.status, t.status);
};
fromQuery(route.query);
watch(() => route.query, fromQuery);
watch([q, group, role, status], () => sameQuery(route.query) || router.replace({ query: toQuery() }));

// คอลัมน์สถานะบัญชีเรียงตามป้ายสถานะ (value ใช้กับการเรียงของตาราง)
const headers = t.headers.map((h) => (h.key === "status" ? { ...h, value: (u) => t.status[statusOf(u)].label } : h));
const filtered = computed(() => {
  const s = q.value?.trim().toLowerCase();
  return list.value.filter(
    (u) =>
      (!s || u.name.toLowerCase().includes(s) || u.username.toLowerCase().includes(s)) &&
      (!group.value || u.group === group.value) &&
      (!role.value || u.role === role.value) &&
      (!status.value || statusOf(u) === status.value)
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

// ---------- สถานะบัญชีของผู้ใช้ที่เลือก ----------
const selectedStatus = computed(() => (selected.value ? statusOf(selected.value) : null));
const selectedLock = computed(() => (selected.value ? usersStore.lockOf(selected.value.username) : null));

// ---------- ปลดล็อก / ส่งลิงก์ยืนยันอีเมลใหม่ (เรียก API ผ่าน store · ล้มเหลว = แจ้งพร้อมปุ่มลองใหม่) ----------
const busy = ref(""); // username ที่กำลังดำเนินการ
const accountAction = reactive({ open: false, type: "unlock", user: null });
const askAccountAction = (type, u) => Object.assign(accountAction, { open: true, type, user: u });
const confirmText = computed(() => (accountAction.type === "unlock" ? t.confirmUnlock : t.confirmResend));
const runAccountAction = async (type = accountAction.type, user = accountAction.user) => {
  busy.value = user.username;
  try {
    if (type === "unlock") {
      await usersStore.unlock(user, session.user.name);
      notify(t.confirmUnlock.done(user.name));
    } else {
      const res = await usersStore.resendVerification(user, session.user.name);
      notify(t.confirmResend.done(res.email, res.expiresInHours));
    }
  } catch {
    fail(() => runAccountAction(type, user));
  } finally {
    busy.value = "";
  }
};

// ---------- รีเซ็ต PIN ----------
const resetting = reactive({ open: false, user: null });
const askReset = (u) => Object.assign(resetting, { open: true, user: u });
const resetPin = () => {
  resetting.user.pinSet = false;
  log(t.log.resetPin, resetting.user.name, t.log.resetPinDetail);
  // ชั่วคราวจนกว่าจะมี API: backend บันทึก Audit Log เอง (TOR 4.1.15)
  useAuditStore().record("users", "resetPin", t.audit.account(resetting.user.name, resetting.user.username), [
    { field: t.confirmReset.title, before: null, after: t.log.resetPinDetail },
  ]);
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
    // บัญชีใหม่ = รอยืนยันอีเมล จนกว่าผู้ใช้กดลิงก์และตั้งรหัสผ่าน + PIN (Flow 4.1 ขั้น 2 – 6)
    const user = {
      ...data,
      id,
      pinSet: false,
      emailVerified: false,
      verificationSentAt: nowThaiIso(),
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
        <v-btn v-if="canCreate" color="primary" prepend-icon="fas fa-plus" :height="size['control-lg']" @click="openEditor()">
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
              <v-col cols="12" md="6" lg="12" xl="6">
                <v-text-field
                  v-model="q"
                  :placeholder="t.filters.search"
                  :aria-label="t.filters.search"
                  prepend-inner-icon="fas fa-magnifying-glass"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="4" md="2" lg="4" xl="2">
                <v-select v-model="group" :items="groupItems" :aria-label="t.filters.allGroups" hide-details />
              </v-col>
              <v-col cols="6" sm="4" md="2" lg="4" xl="2">
                <v-select v-model="role" :items="roleItems" :aria-label="t.filters.allRoles" hide-details />
              </v-col>
              <v-col cols="6" sm="4" md="2" lg="4" xl="2">
                <v-select v-model="status" :items="statusItems" :aria-label="t.filters.allStatuses" hide-details />
              </v-col>
            </v-row>

            <AppDataTable
              :headers="headers"
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
              <template #item.status="{ item }">
                <StatusBadge :tone="t.status[statusOf(item)].tone" dot>{{ t.status[statusOf(item)].label }}</StatusBadge>
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
                  <template v-if="canManage(item)">
                    <TableIconButton icon="far fa-pen-to-square" :label="t.edit" @click="openEditor(item)" />
                    <!-- บัญชีรอยืนยันอีเมลยังไม่ได้ตั้ง PIN — ลิงก์ยืนยันใหม่ใช้ตั้งรหัสผ่าน + PIN แทนการรีเซ็ต PIN -->
                    <TableIconButton v-if="statusOf(item) !== 'pendingVerification'" icon="fas fa-key" :label="t.resetPin" @click="askReset(item)" />
                    <TableIconButton
                      v-if="statusOf(item) === 'locked'"
                      icon="fas fa-lock-open"
                      :label="t.unlock"
                      tone="status-danger-fg"
                      :disabled="busy === item.username"
                      @click="askAccountAction('unlock', item)"
                    />
                    <TableIconButton
                      v-else-if="statusOf(item) === 'pendingVerification'"
                      icon="far fa-paper-plane"
                      :label="t.resend"
                      :disabled="busy === item.username"
                      @click="askAccountAction('resend', item)"
                    />
                  </template>
                  <span v-else class="text-text-tertiary">–</span>
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
          <!-- สถานะบัญชี (G-11) -->
          <div class="px-6 py-4 pf-bordered-bottom">
            <div class="d-flex align-center justify-space-between ga-2">
              <span class="pf-type-label-md text-text-secondary">{{ t.account.title }}</span>
              <StatusBadge :tone="t.status[selectedStatus].tone" dot>{{ t.status[selectedStatus].label }}</StatusBadge>
            </div>
            <AlertBox v-if="selectedStatus === 'locked'" tone="danger" icon="fas fa-user-lock" :title="t.account.lockedTitle" class="mt-3">
              {{ t.account.locked(selectedLock.lockedAt ? formatDateTime(selectedLock.lockedAt) : "–", selectedLock.failures) }}
            </AlertBox>
            <AlertBox v-else-if="selectedStatus === 'pendingVerification'" tone="warning" icon="far fa-envelope" :title="t.account.pendingTitle" class="mt-3">
              {{
                selected.verificationSentAt
                  ? t.account.pending(selected.email, formatDateTime(selected.verificationSentAt))
                  : t.account.pendingNever(selected.email)
              }}
            </AlertBox>
            <AlertBox v-else-if="selectedStatus === 'disabled'" tone="neutral" icon="fas fa-ban" class="mt-3">
              {{ t.account.disabled }}
            </AlertBox>
            <div v-if="canManage(selected) && ['locked', 'pendingVerification'].includes(selectedStatus)" class="d-flex justify-end mt-3">
              <v-btn
                v-if="selectedStatus === 'locked'"
                color="primary"
                prepend-icon="fas fa-lock-open"
                :height="size['control-md']"
                :loading="busy === selected.username"
                @click="askAccountAction('unlock', selected)"
              >
                {{ t.unlock }}
              </v-btn>
              <SecondaryButton
                v-else
                prepend-icon="far fa-paper-plane"
                :height="size['control-md']"
                :loading="busy === selected.username"
                @click="askAccountAction('resend', selected)"
              >
                {{ t.resend }}
              </SecondaryButton>
            </div>
          </div>
          <PermissionMatrix
            v-model="draft.permissions"
            :menus="permissionMenus"
            :actions="permissionActions"
            :menu-label="t.permissions.menu"
            :disabled="!canManage(selected)"
          />
          <div class="px-6 pt-4 pb-6">
            <v-switch
              v-model="draft.twoFactor"
              :disabled="!canManage(selected)"
              :label="t.permissions.twoFactor"
              color="success"
              inset
              hide-details
              density="compact"
            />
            <v-switch
              v-model="draft.signer"
              :disabled="!canManage(selected)"
              :label="t.permissions.signer"
              color="success"
              inset
              hide-details
              density="compact"
            />
            <p v-if="!canManage(selected)" class="pf-type-caption text-text-tertiary mt-4">{{ t.permissions.readonly }}</p>
            <div v-else class="d-flex flex-wrap align-center justify-end ga-2 mt-4">
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

    <ConfirmDialog
      v-model="accountAction.open"
      :title="confirmText.title"
      :message="
        accountAction.user
          ? accountAction.type === 'unlock'
            ? t.confirmUnlock.message(accountAction.user.name, accountAction.user.username)
            : t.confirmResend.message(accountAction.user.name, accountAction.user.email)
          : ''
      "
      :confirm-text="confirmText.confirm"
      :icon="accountAction.type === 'unlock' ? 'fas fa-lock-open' : 'far fa-paper-plane'"
      :tone="accountAction.type === 'unlock' ? 'green' : 'blue'"
      :danger="false"
      @confirm="runAccountAction()"
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

    <v-snackbar v-model="snack.show" color="bg-bg-inverse" location="bottom right" :timeout="snack.error ? -1 : 3000">
      <v-icon
        :icon="snack.error ? 'fas fa-triangle-exclamation' : 'fas fa-circle-check'"
        :color="snack.error ? 'status-danger-fg' : 'text-text-on-inverse-accent'"
        size="small"
        class="me-2"
      />
      {{ snack.text }}
      <template v-if="snack.error" #actions>
        <v-btn variant="text" color="text-text-on-inverse-accent" @click="snack.retry?.(); snack.show = false">{{ t.retry }}</v-btn>
        <v-btn variant="text" color="text-text-on-inverse" @click="snack.show = false">{{ common.actions.close }}</v-btn>
      </template>
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
