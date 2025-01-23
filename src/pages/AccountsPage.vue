<template>
  <q-page class="q-pa-none">
    <div class="q-mb-md row full-width q-pa-md">
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
        :options="countriesOptions"
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
      <q-table class="accounts-table-container"
          flat bordered
          :rows="filteredPlayers"
          :columns="columns"
          row-key="id"
          v-model:pagination="paginationRef"
          @request="onPaginationRequest"
        >
        <template v-slot:body-cell-photoUrl="props">
          <q-img
            :src="props.row.photoUrl"
            alt="Player Photo"
            style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"
          />
        </template>
        <template v-slot:body-cell-actions="props">
          <q-btn
            color="primary"
            label="View Details"
            size="sm"
            @click="goToDetailsPage(props.row.id, props.row.userId)"
          />
        </template>
      </q-table>
    </q-page>
</template>

<script setup lang="ts">
import type { Player } from 'src/model/Player'
import type { PlayerQuery } from 'src/model/PlayerQuery'
import type { Country } from 'src/model/countries';
import { formatDate } from 'src/Utils';
import { formatPremium } from 'src/Utils';
import { formatBanned } from 'src/Utils';
import { countries } from 'src/model/countries'
import { getCountryLabelFromCode } from 'src/model/countries'
import { ref, watch, onMounted  } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

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

const countriesOptions = ref<Country[]>(countries);

const columns = ref([
  {
    name: 'actions',
    label: 'Actions',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'actions',
  },
  {
    name: 'userId',
    label: 'User Id',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'userId',
  },
  {
    name: 'playerId',
    label: 'Player Id',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'id',
  },
  {
    name: 'photoUrl',
    label: 'Photo',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'photoUrl',
  },
  {
    name: 'name',
    label: 'Name',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'name',
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
    format: (val: boolean) => `${formatPremium(val)}`,
  },
  {
    name: 'banned',
    label: 'Banned',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'banned',
    format: (val: boolean) => `${formatBanned(val)}`,
  },
  {
    name: 'lastLoginAt',
    label: 'Last Login',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'lastLoginAt',
    format: (val: string | number | Date) => formatDate(val),
  },
  {
    name: 'createdAt',
    label: 'Created At',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'createdAt',
    format: (val: string | number | Date) => formatDate(val),
  },
])

const paginationRef = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const searchQuery = ref<PlayerQuery>({
  userId: null,
  playerId: null,
  name: null,
  gender: null,
  country: null,
  premium: null,
  banned: null,
  createdAt: null,
  limit: paginationRef.value.rowsPerPage,
  isPreviousPage: null,
  isRowNumberChanged: null,
})

const filteredPlayers = ref<Player[]>([])

const isPaging = ref(false);

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

// ========================================
//
// FUNCTIONS
//
// ========================================

function onPaginationRequest (props: RequestProps) {
  const { page, rowsPerPage } = props.pagination

  if (paginationRef.value.rowsPerPage != rowsPerPage) {
    searchQuery.value.isRowNumberChanged = true
    paginationRef.value.page = page
    paginationRef.value.rowsPerPage = rowsPerPage
    console.log("fetchPlayersForPaging_caseDifferentNumberOfRowsPerPage")
    fetchPlayersForPaging_caseDifferentNumberOfRowsPerPage()
    return
  } else {
    searchQuery.value.isRowNumberChanged = false
  }

  if (paginationRef.value.page > page) {
    paginationRef.value.page = page
    searchQuery.value.isPreviousPage = true
    console.log("fetchPlayersForPaging_casePreviousPage")
    fetchPlayersForPaging_casePreviousPage()
  } else {
    paginationRef.value.page = page
    searchQuery.value.isPreviousPage = false
    console.log("fetchPlayersForPaging_caseNextPage")
    fetchPlayersForPaging_caseNextPage()
  }
}

const fetchFilteredPlayers = async() => {
  console.log("fetchFilteredPlayers")
  console.log(searchQuery.value)
  searchQuery.value.isPreviousPage = false
  searchQuery.value.limit = paginationRef.value.rowsPerPage
  searchQuery.value.createdAt = null

  const { players, count } = await fetchPlayersData(searchQuery.value);

  filteredPlayers.value = players.map((player: { country: string; }) => {
    return {
      ...player,
      country: getCountryLabelFromCode(player.country),
    };
  });
  paginationRef.value.rowsNumber = count;
  paginationRef.value.page = 1;
}

const fetchPlayersForPaging_casePreviousPage = async() => {
  isPaging.value = true;
  searchQuery.value.limit = paginationRef.value.rowsPerPage

  // Determine createdAt based on page navigation
  if (filteredPlayers.value.length > 0) {
    searchQuery.value.createdAt = filteredPlayers.value[0]?.createdAt || null;
  } else {
    searchQuery.value.createdAt = null;
  }

  const { players, count } = await fetchPlayersData(searchQuery.value);

  filteredPlayers.value = players.reverse().map((player: { country: string; }) => {
    return {
      ...player,
      country: getCountryLabelFromCode(player.country),
    };
  });
  paginationRef.value.rowsNumber = count;
  isPaging.value = false;
}

const fetchPlayersForPaging_caseNextPage = async() => {
  isPaging.value = true;
  searchQuery.value.limit = paginationRef.value.rowsPerPage

  // Determine createdAt based on page navigation
  if (filteredPlayers.value.length > 0) {
    searchQuery.value.createdAt = filteredPlayers.value[filteredPlayers.value.length - 1]?.createdAt || null;
  } else {
    searchQuery.value.createdAt = null;
  }

  const { players, count } = await fetchPlayersData(searchQuery.value);

  filteredPlayers.value = players.map((player: { country: string; }) => {
    return {
      ...player,
      country: getCountryLabelFromCode(player.country),
    };
  });
  paginationRef.value.rowsNumber = count;
  isPaging.value = false;
}

const fetchPlayersForPaging_caseDifferentNumberOfRowsPerPage = async() => {
  isPaging.value = true;
  searchQuery.value.limit = paginationRef.value.rowsPerPage

  // Determine createdAt based on page navigation
  if (filteredPlayers.value.length > 0) {
    searchQuery.value.createdAt = filteredPlayers.value[0]?.createdAt || null;
  } else {
    searchQuery.value.createdAt = null;
  }

  const { players, count } = await fetchPlayersData(searchQuery.value);

  filteredPlayers.value = players.map((player: { country: string; }) => {
    return {
      ...player,
      country: getCountryLabelFromCode(player.country),
    };
  });
  paginationRef.value.rowsNumber = count;
  isPaging.value = false;
}

const fetchPlayersData = async (query: PlayerQuery) => {
  try {
    const queryParams = new URLSearchParams();
    for (const key in query) {
      if (query[key] !== null && query[key] !== undefined) {
        queryParams.append(key, String(query[key]));
      }
    }
    console.log(queryParams.toString())
    const [playersResponse, countResponse] = await Promise.all([
      fetch(`http://localhost:3344/admin/players?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      fetch('http://localhost:3344/admin/players/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ]);

    if (playersResponse.ok && countResponse.ok) {
      const players = await playersResponse.json();
      const count = await countResponse.json();
      return { players, count };
    } else {
      console.error(
        'Error fetching data:',
        playersResponse.statusText,
        countResponse.statusText
      );
      return { players: [], count: 0 };
    }
  } catch (error) {
    console.error('Error fetching players or count:', error);
    return { players: [], count: 0 };
  }
};

const goToDetailsPage = (playerId: string, userId: string) => {
  router.push({ name: 'accountDetails', query: { playerId: playerId, userId: userId } });
};

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
  fetchFilteredPlayers();
});

</script>
<style>
.accounts-table-container {
  padding: 20px;
  margin: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #ececec;
}
.select-width {
  width: 200px;
  margin-right: 16px;
}
.q-mb-md {
  margin-bottom: 20px;
}
.q-pa-md {
  padding: 16px;
}
</style>
