<template>
  <q-page class="flex flex-center">
    <div class="q-mb-md row items-center">
      <q-input
        v-model="searchQuery"
        debounce="300"
        label="Search for an account"
        outlined
        class="q-mr-md"
        :placeholder="'Search by account name'"
      />
    </div>
    <q-table :rows="filteredAccounts" :columns="columns" row-key="id" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const accounts = ref([
  {
    id: '1',
    name: 'Account 1',
    balance: 1000,
  },
  {
    id: '2',
    name: 'Account 2',
    balance: 2000,
  },
  {
    id: '3',
    name: 'Account 3',
    balance: 1500,
  },
  {
    id: '4',
    name: 'Account 4',
    balance: 3000,
  },
  {
    id: '5',
    name: 'Account 5',
    balance: 1000,
  },
  {
    id: '6',
    name: 'Account 6',
    balance: 2000,
  },
  {
    id: '7',
    name: 'Account 7',
    balance: 1500,
  },
  {
    id: '8',
    name: 'Account 9',
    balance: 3000,
  },
])

const searchQuery = ref('')

const columns = ref([
  { name: 'name', label: 'Account Name', align: 'left' as const, field: 'name' },
  { name: 'balance', label: 'Balance', align: 'right' as const, field: 'balance' },
])

const filteredAccounts = computed(() => {
  return accounts.value.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>
