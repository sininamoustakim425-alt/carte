<script setup>
import { onMounted, ref } from 'vue'
import LocalEntityCards from '../components/LocalEntityCards.vue'
import { entitySchemas } from '../config/entitySchemas'

const items = ref([])
const schema = entitySchemas.equipements

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
        <h1>Équipements</h1>
        <p>Gestion locale des équipements</p>
      </div>
    </header>

    <section class="items-section">
      <div class="equipment-highlight">
        <h2>Équipements de football pour les mairies</h2>
        <div class="equipment-highlight-grid">
          <article class="equipment-highlight-card">
            <h3>⚽ Terrain synthétique</h3>
            <p>Terrain de football pour matchs scolaires, municipaux et entraînements.</p>
          </article>
          <article class="equipment-highlight-card">
            <h3>🏟️ Buts standards</h3>
            <p>Ensemble de buts réglementaires pour terrains intérieurs et extérieurs.</p>
          </article>
          <article class="equipment-highlight-card">
            <h3>🧢 Drapeaux et marquages</h3>
            <p>Équipements de marquage pour lignes de terrain et zones de jeu.</p>
          </article>
          <article class="equipment-highlight-card">
            <h3>⛹️ Ballons de football</h3>
            <p>Ballons adaptés aux matchs officiels et aux séances de formation.</p>
          </article>
          <article class="equipment-highlight-card">
            <h3>🏋️ Équipement d'entraînement</h3>
            <p>Cônes, plots et haies pour l'entraînement technique et physique.</p>
          </article>
          <article class="equipment-highlight-card">
            <h3>🧰 Matériel de maintenance</h3>
            <p>Outils et accessoires pour l'entretien des terrains et du matériel sportif.</p>
          </article>
        </div>
      </div>

      <h2>{{ items.length }} équipement(s)</h2>
      <LocalEntityCards :items="items" :schema="schema" />
    </section>
  </div>
</template>

<style scoped>
.equipment-highlight {
  background: #f8fafc;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 24px;
}

.equipment-highlight h2 {
  margin: 0 0 18px;
  font-size: 1.4rem;
}

.equipment-highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.equipment-highlight-card {
  background: white;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.equipment-highlight-card h3 {
  margin: 0 0 10px;
  font-size: 1rem;
}

.equipment-highlight-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}
</style>

