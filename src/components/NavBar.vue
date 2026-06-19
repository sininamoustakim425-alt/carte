<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'Accueil', path: '/', icon: '🏠' },
  { name: 'Utilisateurs', path: '/utilisateurs', icon: '👤' },
  { name: 'Équipements', path: '/equipements', icon: '⚽' },
  { name: 'Catégories', path: '/categories', icon: '📂' },
  { name: 'Réservations', path: '/reservations', icon: '📅' },
  { name: 'Paiements', path: '/paiements', icon: '💳' },
  { name: 'Agents', path: '/agents', icon: '👨‍💼' },
  { name: 'Contact', path: '/contact', icon: '✉️' },
  { name: 'Profil', path: '/profil', icon: '🧑' },
]
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">
      <div class="brand-icon">⚽</div>
      <div>
        <p class="brand-eyebrow">Administration</p>
        <h1>Gestion Équipements</h1>
      </div>
    </div>

    <ul class="nav-menu">
      <li v-for="item in navItems" :key="item.path">
        <RouterLink :to="item.path" :class="{ active: route.path === item.path }">
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
