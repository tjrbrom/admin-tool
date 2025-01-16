<template>
  <q-page class="q-pa-none">
    <div class="q-mb-md row full-width">
      <q-input
        v-model="searchQuery.userId"
        debounce="300"
        label="Search by User ID"
        outlined
        class="q-mr-md select-width"
      />
      <q-input
        v-model="searchQuery.name"
        debounce="300"
        label="Search by Player Name"
        outlined
        class="q-mr-md select-width"
      />
      <q-select
        v-model="searchQuery.gender"
        :options="genderOptions"
        label="Search by Gender"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
      />
      <q-select
        v-model="searchQuery.country"
        :options="countriesRef"
        label="Search by Country"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
      />
      <q-select
        v-model="searchQuery.premium"
        :options="premiumOptions"
        label="Search by Premium"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
      />
      <q-select
        v-model="searchQuery.banned"
        :options="bannedOptions"
        label="Search by Banned"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
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
import type { PlayerQuery } from 'src/model/PlayerQuery'
import type { Country } from 'src/model/countries';
import { countries } from 'src/model/countries'
import { ref, watchEffect } from 'vue'

const premiumOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false },
])

const bannedOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false },
])

const genderOptions = ref([
  { label: 'None', value: 'none' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non Binary', value: 'non_binary' },
  { label: 'Prefer not to say', value: 'prefer_not_say' },
])

const countriesRef = ref<Country[]>(countries);

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

const searchQuery = ref<PlayerQuery>({
  userId: null,
  name: null,
  gender: null,
  country: null,
  premium: null,
  banned: null,
})

const filteredPlayers = ref<Player[]>([])

const fetchFilteredPlayers = async() => {
  const response = await fetch('http://localhost:3344/admin/players', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchQuery.value),
  })
  const data: Player[] = await response.json()

  filteredPlayers.value = data.filter((player) => {
    const userId = searchQuery.value.userId
    const name = searchQuery.value.name
    const gender = searchQuery.value.gender
    const country = searchQuery.value.country
    const premium = searchQuery.value.premium
    const banned = searchQuery.value.banned

    const matchesUserId = userId ? player.userId  == userId : true
    const matchesName = name ? player.name.toLowerCase().includes(name.toLowerCase()) : true
    const matchesGender = gender ? player.gender == gender : true
    const matchesCountry = country ? player.country == country : true
    const matchesPremium = premium !== null ? player.premium == premium : true
    const matchesBanned = banned !== null ? player.banned == banned : true

    return matchesUserId && matchesName && matchesGender && matchesCountry && matchesPremium && matchesBanned
  })
}

watchEffect(() => {
  fetchFilteredPlayers()
})

</script>
<style>
.select-width {
  width: 200px;
}
</style>
