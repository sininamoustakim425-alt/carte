<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigate(path) {
  if (path) router.push(path)
}
</script>

<template>
  <header class="hero">
    <div class="hero-content">
      <p class="eyebrow">Bienvenue</p>
      <h1>Gestion d'Équipements Sportifs</h1>
      <p>inscrivez-vous pour accéder à toutes les fonctionnalités</p>
    </div>

    <section class="stats-grid">
      <div class="stat-card" @click="navigate('/products')">
        <div class="stat-icon">📦</div>
        <h3>Produits</h3>
        <p class="stat-hint">Cliquez pour gérer →</p>
      </div>
      <div class="stat-card" @click="navigate('/contacts')">
        <div class="stat-icon">👥</div>
        <h3>Contacts</h3>
        <p class="stat-hint">Cliquez pour gérer →</p>
      </div>
    </section>
  </header>
</template>
