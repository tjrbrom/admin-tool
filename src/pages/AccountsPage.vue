<template>
  <q-page class="q-pa-none">
    <div class="q-mb-md row full-width">
      <q-input
        v-model="searchQuery.userId"
        debounce="300"
        label="Search by User ID"
        outlined
        class="q-mr-md"
      />
      <q-input
        v-model="searchQuery.name"
        debounce="300"
        label="Search by Player Name"
        outlined
        class="q-mr-md"
      />
      <q-input
        v-model="searchQuery.gender"
        debounce="300"
        label="Search by Gender"
        outlined
        class="q-mr-md"
      />
      <q-input
        v-model="searchQuery.country"
        debounce="300"
        label="Search by Country"
        outlined
        class="q-mr-md"
      />
      <q-input
        v-model="searchQuery.premium"
        debounce="300"
        label="Search by Premium"
        outlined
        class="q-mr-md"
      />
      <q-input
        v-model="searchQuery.banned"
        debounce="300"
        label="Search by Banned"
        outlined
        class="q-mr-md"
      />
    </div>
    <q-table
      :rows="filteredPlayers"
      :columns="columns"
      row-key="id"
      class="full-width"
      :pagination="{ rowsPerPage: 10 }"
    />
  </q-page>
</template>

<script setup lang="ts">
import type { Player } from 'src/model/Player'
import { ref, computed } from 'vue'

const players = ref<Player[]>([
  {
    id: '1',
    userId: 'u1',
    name: 'Player 1',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'USA',
    premium: true,
    banned: false,
    lastLoginAt: 1673479600000, // Example timestamp
    createdAt: 1612492800000, // Example timestamp
  },
  {
    id: '2',
    userId: 'u2',
    name: 'Player 2',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Canada',
    premium: false,
    banned: false,
    lastLoginAt: 1673483200000,
    createdAt: 1612492900000,
  },
  {
    id: '3',
    userId: 'u3',
    name: 'Player 3',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'UK',
    premium: true,
    banned: true,
    lastLoginAt: 1673486800000,
    createdAt: 1612493000000,
  },
  {
    id: '4',
    userId: 'u4',
    name: 'Player 4',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Australia',
    premium: false,
    banned: false,
    lastLoginAt: 1673489500000,
    createdAt: 1612493100000,
  },
  {
    id: '5',
    userId: 'u5',
    name: 'Player 5',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'India',
    premium: true,
    banned: false,
    lastLoginAt: 1673493000000,
    createdAt: 1612493200000,
  },
  {
    id: '6',
    userId: 'u6',
    name: 'Player 6',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Germany',
    premium: false,
    banned: true,
    lastLoginAt: 1673496600000,
    createdAt: 1612493300000,
  },
  {
    id: '7',
    userId: 'u7',
    name: 'Player 7',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Spain',
    premium: true,
    banned: false,
    lastLoginAt: 1673500200000,
    createdAt: 1612493400000,
  },
  {
    id: '8',
    userId: 'u8',
    name: 'Player 8',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Brazil',
    premium: true,
    banned: true,
    lastLoginAt: 1673503800000,
    createdAt: 1612493500000,
  },
  {
    id: '9',
    userId: 'u9',
    name: 'Player 9',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'France',
    premium: false,
    banned: false,
    lastLoginAt: 1673507400000,
    createdAt: 1612493600000,
  },
  {
    id: '10',
    userId: 'u10',
    name: 'Player 10',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Italy',
    premium: true,
    banned: false,
    lastLoginAt: 1673511000000,
    createdAt: 1612493700000,
  },
  {
    id: '11',
    userId: 'u11',
    name: 'Player 11',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Japan',
    premium: true,
    banned: true,
    lastLoginAt: 1673514600000,
    createdAt: 1612493800000,
  },
  {
    id: '12',
    userId: 'u12',
    name: 'Player 12',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'South Korea',
    premium: false,
    banned: false,
    lastLoginAt: 1673518200000,
    createdAt: 1612493900000,
  },
  {
    id: '13',
    userId: 'u13',
    name: 'Player 13',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Mexico',
    premium: false,
    banned: true,
    lastLoginAt: 1673521800000,
    createdAt: 1612494000000,
  },
  {
    id: '14',
    userId: 'u14',
    name: 'Player 14',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Argentina',
    premium: true,
    banned: false,
    lastLoginAt: 1673525400000,
    createdAt: 1612494100000,
  },
  {
    id: '15',
    userId: 'u15',
    name: 'Player 15',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Russia',
    premium: false,
    banned: false,
    lastLoginAt: 1673529000000,
    createdAt: 1612494200000,
  },
])

const columns = ref([
  {
    name: 'userId',
    label: 'User Id',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'userId',
  },
  {
    name: 'name',
    label: 'Name',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'name',
  },
  {
    name: 'photoUrl',
    label: 'Photo URL',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'photoUrl',
  },
  {
    name: 'gender',
    label: 'Gender',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'gender',
  },
  {
    name: 'country',
    label: 'Country',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'country',
  },
  {
    name: 'premium',
    label: 'Premium',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'premium',
  },
  {
    name: 'banned',
    label: 'Banned',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'banned',
  },
  {
    name: 'lastLoginAt',
    label: 'Last Login',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'lastLoginAt',
    format: (val: string | number | Date) => new Date(val).toLocaleString(),
  },
  {
    name: 'createdAt',
    label: 'Created At',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'createdAt',
    format: (val) => new Date(val).toLocaleString(),
  },
])

const searchQuery = ref({
  userId: '',
  name: '',
  gender: '',
  country: '',
  premium: '',
  banned: '',
})

const filteredPlayers = computed(() => {
  return players.value.filter((player) => {
    const matchesUserId = searchQuery.value.userId
      ? player.userId.includes(searchQuery.value.userId)
      : true
    const matchesName = searchQuery.value.name ? player.name.includes(searchQuery.value.name) : true
    const matchesGender = searchQuery.value.gender
      ? player.gender.includes(searchQuery.value.gender)
      : true
    const matchesCountry = searchQuery.value.country
      ? player.country.includes(searchQuery.value.country)
      : true
    const matchesPremium = searchQuery.value.premium
      ? String(player.premium).includes(searchQuery.value.premium)
      : true
    const matchesBanned = searchQuery.value.banned
      ? String(player.banned).includes(searchQuery.value.banned)
      : true

    return (
      matchesUserId &&
      matchesName &&
      matchesGender &&
      matchesCountry &&
      matchesPremium &&
      matchesBanned
    )
  })
})
</script>
