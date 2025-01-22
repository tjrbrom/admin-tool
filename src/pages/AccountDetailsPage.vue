<template>
  <div class="account-details-container">
    <h2 class="account-title">Account Details</h2>
    <div v-if="userData">
      <div v-if="isEditMode">
        <p>
          <strong>Name: </strong>
          <input v-model="userData.name" />
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
        <div class="select-container">
          <strong>Country: </strong>
          <q-select
            v-model="userData.country"
            :options="countriesOptions"
            class="select"
            emit-value
            map-options
          />
        </div>
      </div>
      <div v-else>
        <p><strong>User ID:</strong> {{ userData.userId }}</p>
        <p><strong>Player ID:</strong> {{ userData.id }}</p>
        <p><strong>Name:</strong> {{ userData.name }}</p>
        <p>
          <strong>Photo:</strong>
          <img :src="userData.photoUrl" alt="Player Photo" class="player-photo" v-if="userData.photoUrl" />
        </p>
          <p><strong>Gender:</strong> {{ userData.gender }}</p>
        <p><strong>Country:</strong> {{ userData.country }}</p>
        <p><strong>Premium:</strong> {{ userData.premium }}</p>
        <p><strong>Banned:</strong> {{ userData.banned }}</p>
        <p><strong>Last Login At:</strong> {{ new Date(userData.lastLoginAt).toISOString() }}</p>
        <p><strong>Created At:</strong> {{ new Date(userData.createdAt).toISOString() }}</p>
      </div>
    </div>
    <div v-else>
      <q-spinner color="primary" />
    </div>
    <button @click="toggleEditMode">
      {{ isEditMode ? 'Save Changes' : 'Edit Details' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { QSpinner } from 'quasar';
import type { Player } from 'src/model/Player';
import type { Country } from 'src/model/countries';
import { countries } from 'src/model/countries'

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
    const response = await fetch(`http://localhost:3344/admin/player?userId=${userId.value}&playerId=${playerId.value}`);
    if (response.ok) {
      userData.value = await response.json();
    } else {
      console.error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const saveUserData = async () => {
  try {
    await fetch(`http://localhost:3344/admin/player/name`, {
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
      await fetch(`http://localhost:3344/admin/player/photo/default`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: userData.value?.id
        }),
      });
    }
    await fetch(`http://localhost:3344/admin/player/gender`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: userData.value?.id,
        gender: userData.value?.gender
      }),
    });
    await fetch(`http://localhost:3344/admin/player/country`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: userData.value?.id,
        country: userData.value?.country
      }),
    });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

const toggleEditMode = () => {
  if (isEditMode.value) {
    saveUserData();
  }
  isEditMode.value = !isEditMode.value;
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
