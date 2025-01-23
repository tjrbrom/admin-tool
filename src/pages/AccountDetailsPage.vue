<template>
  <div class="account-details-container">
    <div class="header-container">
      <button v-if="isEditMode" @click="handleBackButtonClick" class="back-button">
        Back
      </button>
      <h2 class="account-title">Account Details</h2>
    </div>
    <div v-if="userData">
      <div v-if="isEditMode">
        <p><strong>User ID (account):</strong> {{ userData.userId }}</p>
        <p><strong>Player ID (specific game):</strong> {{ userData.id }}</p>
        <p>
          <strong>Name: </strong>
          <q-input style="max-width: 300px"
            ref="inputRef"
            filled
            v-model="userData.name"
            :rules="[val => !!val || 'Field is required']"
          />
        </p>
        <p>
          <strong>Default photo </strong>
          <input
            type="checkbox"
            v-model="changeToDefaultPhoto"
          />
        </p>
        <div class="select-container">
          <strong>Gender: </strong>
          <q-select
            v-model="userData.gender"
            :options="genderOptions"
            class="select"
            emit-value
            map-options
          />
        </div>
        <div class="select-container" style="margin-top: 20px;">
          <strong>Country: </strong>
          <q-select
            v-model="userData.country"
            :options="countriesOptions"
            class="select"
            emit-value
            map-options
          />
        </div>
        <p style="margin-top: 20px;"><strong>Premium: </strong>
          <span :class="{ 'text-green': userData.premium, 'text-red': !userData.premium }">
            {{ formatPremium(userData.premium) }}
          </span>
        </p>
        <p><strong>Banned: </strong>
          <span :class="{ 'text-green': userData.banned, 'text-red': !userData.banned }">
            {{ formatBanned(userData.banned) }}
          </span>
        </p>
        <p><strong>Last Login At:</strong> {{ formatDate(userData.lastLoginAt) }}</p>
        <p><strong>Created At:</strong> {{ formatDate(userData.createdAt) }}</p>
        <button @click="saveUserData" :disabled="!isFormValid">
          Save Changes
        </button>
      </div>
      <div v-else>
        <p><strong>User ID (account):</strong> {{ userData.userId }}</p>
        <p><strong>Player ID (specific game):</strong> {{ userData.id }}</p>
        <p>
          <img :src="userData.photoUrl" alt="Player Photo" class="player-photo" v-if="userData.photoUrl" />
        </p>
        <p><strong>Name:</strong> {{ userData.name }}</p>
        <p><strong>Gender:</strong> {{ userData.gender }}</p>
        <p><strong>Country:</strong> {{ getCountryLabelFromCode(userData.country) }}</p>
        <p><strong>Premium: </strong>
          <span :class="{ 'text-green': userData.premium, 'text-red': !userData.premium }">
            {{ formatPremium(userData.premium) }}
          </span>
        </p>
        <p><strong>Banned: </strong>
          <span :class="{ 'text-green': userData.banned, 'text-red': !userData.banned }">
            {{ formatBanned(userData.banned) }}
          </span>
        </p>
        <p><strong>Last Login At:</strong> {{ formatDate(userData.lastLoginAt) }}</p>
        <p><strong>Created At:</strong> {{ formatDate(userData.createdAt) }}</p>
        <button @click="toggleEditMode">
          Edit Data
        </button>
      </div>
    </div>
    <div v-else>
      <q-spinner color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { QSpinner } from 'quasar';
import { formatDate } from 'src/Utils';
import { formatPremium } from 'src/Utils';
import { formatBanned } from 'src/Utils';
import { BASE_URL } from 'src/common';
import type { Player } from 'src/model/Player';
import type { Country } from 'src/model/countries';
import { countries } from 'src/model/countries'
import { getCountryLabelFromCode, getCountryCodeFromLabel } from 'src/model/countries'

const route = useRoute();
const isEditMode = ref(false);
const changeToDefaultPhoto = ref(false);
const playerId = ref(route.query.playerId as string);
const userId = ref(route.query.userId as string);
const userData = ref<Player>();

const genderOptions = ref([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non Binary', value: 'non_binary' },
  { label: 'Prefer not to say', value: 'prefer_not_say' },
])

const countriesOptions = ref<Country[]>(countries);

const fetchUserData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/player?userId=${userId.value}&playerId=${playerId.value}`);
    if (response.ok) {
      const playerData = await response.json();
      userData.value = {
        ...playerData,
        country: getCountryLabelFromCode(playerData.country),
      };
    } else {
      console.error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const saveUserData = async () => {
  if (!isFormValid.value) {
    console.error('Form is invalid. Fix errors before saving.');
    return;
  }
  try {
    await fetch(`${BASE_URL}/player/name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: userData.value?.id,
        name: userData.value?.name
      }),
    });
    if (changeToDefaultPhoto.value) {
      await fetch(`${BASE_URL}/player/photo/default`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: userData.value?.id
        }),
      });
    }
    await fetch(`${BASE_URL}/player/gender`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: userData.value?.id,
        gender: userData.value?.gender
      }),
    });
    await fetch(`${BASE_URL}/player/country`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: userData.value?.id,
        country: getCountryCodeFromLabel(userData.value?.country ?? '')
      }),
    });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

const isFormValid = computed(() => {
  return (
    userData.value?.name
  );
});

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

const handleBackButtonClick = () => {
  fetchUserData()
  isEditMode.value = false;
};

onMounted(() => {
  fetchUserData();
});
</script>

<style>
.account-details-container {
  padding: 20px;
  margin: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #ececec;
}
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.back-button {
  position: absolute;
  left: 0;
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.back-button:hover {
  background-color: #0056b3;
}
.player-photo {
  display: block;
  margin-top: 10px;
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ccc;
}
.select-container {
  display: flex;
  align-items: center;
}
.select {
  width: 150px;
  margin-left: 10px;
}
.account-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.text-green {
  color: green;
}
.text-red {
  color: red;
}
button {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
