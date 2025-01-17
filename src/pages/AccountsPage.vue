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
        flat bordered
        :rows="filteredPlayers"
        :columns="columns"
        row-key="id"
        v-model:pagination="paginationRef"
        @request="onPaginationRequest"
      />
    </q-page>
</template>

<script setup lang="ts">
import type { Player } from 'src/model/Player'
import type { PlayerQuery } from 'src/model/PlayerQuery'
import type { Country } from 'src/model/countries';
import { countries } from 'src/model/countries'
import { ref, watchEffect } from 'vue'

interface Pagination {
  page: number;
  rowsPerPage: number;
  sortBy?: string | string[];
  descending?: boolean;
}

interface RequestProps {
  pagination: Pagination;
  filter?: Record<string, unknown>;
}

function onPaginationRequest (props: RequestProps) {
  const { page, rowsPerPage } = props.pagination

  console.log(page)
  console.log(rowsPerPage)

  paginationRef.value.page = page
  paginationRef.value.rowsPerPage = rowsPerPage

  const lastPlayer = filteredPlayers.value[filteredPlayers.value.length - 1];
  if (lastPlayer) {
    searchQuery.value.createdAt = lastPlayer.createdAt;
  } else {
    searchQuery.value.createdAt = null;
  }

  fetchFilteredPlayers()
}

const premiumOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false },
])

const bannedOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false },
])

const genderOptions = ref([
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

const paginationRef = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const searchQuery = ref<PlayerQuery>({
  userId: null,
  name: null,
  gender: null,
  country: null,
  premium: null,
  banned: null,
  createdAt: null,
  limit: paginationRef.value.rowsPerPage,
})

const filteredPlayers = ref<Player[]>([])

const fetchFilteredPlayers = async() => {
  searchQuery.value.limit = paginationRef.value.rowsPerPage
  try {
    const [playersResponse, countResponse] = await Promise.all([
      fetch('http://localhost:3344/admin/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchQuery.value),
      }),
      fetch('http://localhost:3344/admin/players/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ])

    if (playersResponse.ok && countResponse.ok) {
      filteredPlayers.value = await playersResponse.json()
      paginationRef.value.rowsNumber = await countResponse.json()
    } else {
      console.error(
        'Error fetching data:',
        playersResponse.statusText,
        countResponse.statusText
      )
    }
  } catch (error) {
    console.error('Error fetching players or count:', error)
  }
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
