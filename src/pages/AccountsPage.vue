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
import { ref, watch, onMounted  } from 'vue'

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

  console.log("onPaginationRequest")

  if (paginationRef.value.page > page) {
    searchQuery.value.isPreviousPage = true
  }

  paginationRef.value.page = page
  paginationRef.value.rowsPerPage = rowsPerPage

  fetchPlayersForPaging()
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
  isPreviousPage: null,
})

const filteredPlayers = ref<Player[]>([])

const fetchFilteredPlayers = async() => {
  console.log("fetchFilteredPlayers")
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
      paginationRef.value.page = 1
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

const isPaging = ref(false);

const fetchPlayersForPaging = async() => {
  console.log("fetchPlayersForPaging")

  isPaging.value = true;

  searchQuery.value.limit = paginationRef.value.rowsPerPage

  // Determine createdAt based on page navigation
  if (filteredPlayers.value.length > 0) {
    if (searchQuery.value.isPreviousPage) {
      searchQuery.value.createdAt = filteredPlayers.value[0]?.createdAt || null;
    } else {
      searchQuery.value.createdAt = filteredPlayers.value[filteredPlayers.value.length - 1]?.createdAt || null;
    }
  } else {
    searchQuery.value.createdAt = null;
  }

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
      if (searchQuery.value.isPreviousPage) {
        filteredPlayers.value.reverse()
      }
      paginationRef.value.rowsNumber = await countResponse.json()
    } else {
      console.error(
        'Error fetching data:',
        playersResponse.statusText,
        countResponse.statusText
      )
    }
  } catch (error) {
    console.error("Error fetching players or count:", error);
  } finally {
    isPaging.value = false;
  }
}

// trigger fetchFilteredPlayers when search filters are updated
const onSearchFiltersChanged = () => {
  if (!isPaging.value) {
    fetchFilteredPlayers();
  }
};

watch(
  () => searchQuery.value,
  onSearchFiltersChanged,
  { deep: true }
);

onMounted(() => {
  console.log("Fetching initial data");
  fetchFilteredPlayers();
});

</script>
<style>
.select-width {
  width: 200px;
}
</style>
