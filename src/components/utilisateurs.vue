<script setup>
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <section class="users-grid">
    <article v-for="user in users" :key="user.ID_utilisateur" class="user-card">
      <div class="user-card-header">
        <div>
          <p class="user-label">Utilisateur</p>
          <h3>{{ user.Nom_utilisateur }} {{ user.Pre_nom_utilisateur }}</h3>
        </div>
        <span class="user-badge">#{{ user.ID_utilisateur }}</span>
      </div>

      <div class="user-info">
        <p><span>Email</span> {{ user.Email_utilisateur || '—' }}</p>
        <p><span>Téléphone</span> {{ user.Telephone_utilisateur || '—' }}</p>
        <p><span>Adresse</span> {{ user.AdressePostale_utilisateur || '—' }}</p>
      </div>

      <div class="card-actions">
        <button class="secondary" type="button" @click="emit('edit', user)">Modifier</button>
        <button class="danger" type="button" @click="emit('delete', user.ID_utilisateur)">Supprimer</button>
      </div>
    </article>
  </section>
</template>
