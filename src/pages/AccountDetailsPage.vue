<template>
  <div>
    <h2>Account Details</h2>

    <div v-if="userData">
      <p><strong>User ID:</strong> {{ userData.userId }}</p>
      <p><strong>Name:</strong> {{ userData.name }}</p>
      <p><strong>Photo:</strong> {{ userData.photoUrl }}</p>
      <p><strong>Gender:</strong> {{ userData.gender }}</p>
      <p><strong>Country:</strong> {{ userData.country }}</p>
      <p><strong>Premium:</strong> {{ userData.premium }}</p>
      <p><strong>Banned:</strong> {{ userData.banned }}</p>
      <p><strong>Last Login At:</strong> {{ new Date(userData.lastLoginAt).toISOString() }}</p>
      <p><strong>Created At:</strong> {{ new Date(userData.createdAt).toISOString() }}</p>
    </div>

    <div v-else>
      <q-spinner color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { QSpinner } from 'quasar';
import type { Player } from 'src/model/Player';

const route = useRoute();

const userId = ref(route.query.userId as string);
const userData = ref<Player>();

const fetchUserData = async () => {
  try {
    console.log(userId.value)
    const response = await fetch(`http://localhost:3344/admin/player?userId=${userId.value}`);
    if (response.ok) {
      userData.value = await response.json();
    } else {
      console.error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style>
</style>
