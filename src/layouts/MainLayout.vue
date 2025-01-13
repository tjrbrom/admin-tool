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

        <NavLink v-for="link in navLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'
import NavLink from 'components/nav/NavLink.vue'
import type { NavLinkProps } from 'components/nav/NavLink.vue'

const navLinks: NavLinkProps[] = [
  {
    title: 'Store',
    icon: 'settings',
    link: '/store',
  },
  {
    title: 'Payments',
    icon: 'settings',
    link: '/payments',
  },
  {
    title: 'Accounts',
    icon: 'settings',
    link: '/accounts',
  },
  {
    title: 'Tasks',
    icon: 'settings',
    link: '/tasks',
  },
  {
    title: 'Ranks',
    icon: 'settings',
    link: '/ranks',
  },
  {
    title: 'Communication',
    icon: 'settings',
    link: '/communication',
  },
  {
    title: 'Math',
    icon: 'settings',
    link: '/math',
  },
  {
    title: 'General Configuration',
    icon: 'settings',
    link: '/general-config',
  },
]

const leftDrawerOpen = ref(false)
const router = useRouter()
const userStore = useUserStore()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
function handleLogout() {
  userStore.removeToken()
  router.push('/login')
}
</script>
