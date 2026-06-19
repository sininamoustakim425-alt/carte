<script setup>
import { onMounted, ref } from 'vue'
import LocalEntityCards from '../components/LocalEntityCards.vue'
import { entitySchemas } from '../config/entitySchemas'

const items = ref([])
const schema = entitySchemas.agents

async function loadItems() {
  try {
    const response = await fetch(schema.endpoint)
    if (!response.ok) throw new Error('Erreur serveur')
    items.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

onMounted(loadItems)
</script>

<template>
  <div class="view">
    <header class="page-header">
      <div>
        <h1>Agents</h1>
        <p>Gestion locale des agents</p>
      </div>
    </header>

    <section class="items-section">
      <h2>{{ items.length }} agent(s)</h2>
      <LocalEntityCards :items="items" :schema="schema" />
    </section>
  </div>
</template>
