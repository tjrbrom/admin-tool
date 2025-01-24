<template>
  <q-page>
    <div class="q-pa-md">
      <q-list bordered separator>
        <q-item v-for="entry in entries" :key="entry.id">
          <q-item-section class="text-weight-bold">
            {{ entry.name }}
          </q-item-section>
          <q-item-section class="text-weight-bold" side> {{ entry.amount }} </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-footer></q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const entries = ref([
  {
    id: '1',
    name: 'example1',
    amount: 100,
  },
  {
    id: '2',
    name: 'example2',
    amount: 200,
  },
  {
    id: '3',
    name: 'example3',
    amount: 300,
  },
  {
    id: '4',
    name: 'example4',
    amount: 400,
  },
])
</script>
