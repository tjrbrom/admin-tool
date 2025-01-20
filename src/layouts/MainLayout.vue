<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <div class="absolute-center">Admin tool</div>
        </q-toolbar-title>
        <q-btn flat dense round icon="exit_to_app" aria-label="Logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary"
      :width="250"
      :breakpoints="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label class="text-white" header> Navigation </q-item-label>

        <q-expansion-item class="text-white" label="Users" icon="settings" expand-separator>
          <q-item clickable @click="navigate('/accounts')" class="q-pl-lg light-green-bg">
            <q-item-section avatar>
              <q-icon name="double_arrow" />
            </q-item-section>
            <q-item-section> Accounts </q-item-section>
          </q-item>
          <q-item clickable @click="navigate('/other')" class="q-pl-lg light-green-bg">
            <q-item-section avatar>
              <q-icon name="double_arrow" />
            </q-item-section>
            <q-item-section> Other </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item
          class="text-white"
          label="General Configuration"
          icon="settings"
          expand-separator
        >
          <q-item clickable @click="navigate('/general-config')" class="q-pl-lg light-green-bg">
            <q-item-section avatar>
              <q-icon name="double_arrow" />
            </q-item-section>
            <q-item-section> General Configuration </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'

const leftDrawerOpen = ref(false)
const router = useRouter()
const userStore = useUserStore()
// Time for inactivity before auto logout, 20 minutes
const INACTIVITY_TIMEOUT = 20 * 60 * 1000;
let inactivityTimer: NodeJS.Timeout | null = null;

function navigate(link: string) {
  router.push(link)
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
function handleLogout() {
  userStore.removeToken()
  router.push('/login')
  clearTimeout(inactivityTimer as NodeJS.Timeout)
}
function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
  inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIMEOUT)
}
function setupActivityListeners() {
  window.addEventListener('mousemove', resetInactivityTimer)
  window.addEventListener('keydown', resetInactivityTimer)
}
onMounted(() => {
  setupActivityListeners()
  resetInactivityTimer()
})
onBeforeUnmount(() => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
  window.removeEventListener('mousemove', resetInactivityTimer)
  window.removeEventListener('keydown', resetInactivityTimer)
})
</script>

<style scoped>
.light-green-bg {
  background-color: #5a9f68;
  border-radius: 4px;
}
</style>
