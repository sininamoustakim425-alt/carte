<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import '../styles/utlisateurlocale.css'

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  }
})

const STORAGE_KEY = 'local-users-dashboard'
const localUsers = ref([])
const statusMessage = ref('')
const newUser = ref({
  Nom_utilisateur: '',
  Pre_nom_utilisateur: '',
  Email_utilisateur: '',
  Telephone_utilisateur: '',
  AdressePostale_utilisateur: ''
})
const editingUserId = ref(null)
const editingUser = ref({
  Nom_utilisateur: '',
  Pre_nom_utilisateur: '',
  Email_utilisateur: '',
  Telephone_utilisateur: '',
  AdressePostale_utilisateur: ''
})

const sampleUsers = [
  {
    ID_utilisateur: 101,
    Nom_utilisateur: 'Benali',
    Pre_nom_utilisateur: 'Karim',
    Email_utilisateur: 'karim@example.com',
    Telephone_utilisateur: '0600000001',
    AdressePostale_utilisateur: 'Rue de la Paix, Casablanca'
  },
  {
    ID_utilisateur: 102,
    Nom_utilisateur: 'Ait Ali',
    Pre_nom_utilisateur: 'Sara',
    Email_utilisateur: 'sara@example.com',
    Telephone_utilisateur: '0600000002',
    AdressePostale_utilisateur: 'Avenue Hassan II, Rabat'
  },
  {
    ID_utilisateur: 103,
    Nom_utilisateur: 'Mouad',
    Pre_nom_utilisateur: 'Yassin',
    Email_utilisateur: 'yassin@example.com',
    Telephone_utilisateur: '0600000003',
    AdressePostale_utilisateur: 'Quartier El Maarif, Tanger'
  }
]

const usersToDisplay = computed(() => {
  if (props.users && props.users.length > 0) {
    return props.users
  }
  return localUsers.value
})

function saveLocalUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localUsers.value))
}

function loadLocalUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        localUsers.value = parsed
        return
      }
    }
  } catch (error) {
    console.warn('Impossible de charger les utilisateurs locaux.', error)
  }

  localUsers.value = [...sampleUsers]
  saveLocalUsers()
}

function resetForm() {
  newUser.value = {
    Nom_utilisateur: '',
    Pre_nom_utilisateur: '',
    Email_utilisateur: '',
    Telephone_utilisateur: '',
    AdressePostale_utilisateur: ''
  }
}

function resetEditingUser() {
  editingUserId.value = null
  editingUser.value = {
    Nom_utilisateur: '',
    Pre_nom_utilisateur: '',
    Email_utilisateur: '',
    Telephone_utilisateur: '',
    AdressePostale_utilisateur: ''
  }
}

function setStatus(message) {
  statusMessage.value = message
}

function addUser() {
  const name = newUser.value.Nom_utilisateur?.trim()
  const email = newUser.value.Email_utilisateur?.trim()

  if (!name || !email) return

  const userToAdd = {
    ID_utilisateur: Date.now(),
    Nom_utilisateur: name,
    Pre_nom_utilisateur: newUser.value.Pre_nom_utilisateur?.trim() || '',
    Email_utilisateur: email,
    Telephone_utilisateur: newUser.value.Telephone_utilisateur?.trim() || '',
    AdressePostale_utilisateur: newUser.value.AdressePostale_utilisateur?.trim() || ''
  }

  if (props.users && props.users.length > 0) {
    props.users.unshift(userToAdd)
  } else {
    localUsers.value = [userToAdd, ...localUsers.value]
    saveLocalUsers()
  }

  window.dispatchEvent(new Event('dashboard-refresh'))
  setStatus('Utilisateur ajouté avec succès.')
  resetForm()
}

function startEdit(user) {
  setStatus('')
  editingUserId.value = user.ID_utilisateur
  editingUser.value = {
    Nom_utilisateur: user.Nom_utilisateur || '',
    Pre_nom_utilisateur: user.Pre_nom_utilisateur || '',
    Email_utilisateur: user.Email_utilisateur || '',
    Telephone_utilisateur: user.Telephone_utilisateur || '',
    AdressePostale_utilisateur: user.AdressePostale_utilisateur || ''
  }
}

function saveEdit() {
  const userId = editingUserId.value
  if (!userId) return

  const updatedUser = {
    ...editingUser.value,
    ID_utilisateur: userId
  }

  if (props.users && props.users.length > 0) {
    const index = props.users.findIndex((user) => user.ID_utilisateur === userId)
    if (index !== -1) {
      props.users.splice(index, 1, updatedUser)
    }
  } else {
    localUsers.value = localUsers.value.map((user) =>
      user.ID_utilisateur === userId ? updatedUser : user
    )
    saveLocalUsers()
  }

  window.dispatchEvent(new Event('dashboard-refresh'))
  setStatus('Utilisateur mis à jour avec succès.')
  resetEditingUser()
}

function deleteUser(user) {
  const userId = user.ID_utilisateur
  if (!userId || !confirm('Voulez-vous supprimer cet utilisateur ?')) return

  if (props.users && props.users.length > 0) {
    const index = props.users.findIndex((item) => item.ID_utilisateur === userId)
    if (index !== -1) {
      props.users.splice(index, 1)
    }
  } else {
    localUsers.value = localUsers.value.filter((item) => item.ID_utilisateur !== userId)
    saveLocalUsers()
  }

  window.dispatchEvent(new Event('dashboard-refresh'))
  setStatus('Utilisateur supprimé avec succès.')
}

watch(
  () => props.users,
  (newUsers) => {
    if (!newUsers || newUsers.length === 0) {
      loadLocalUsers()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (!props.users || props.users.length === 0) {
    loadLocalUsers()
  }
})
</script>

<template>
  <section class="utilisateurs-locale-panel">
    <div class="utilisateurs-locale-form">
      <h3>Ajouter un utilisateur</h3>
      <div class="utilisateurs-locale-fields">
        <input v-model="newUser.Nom_utilisateur" placeholder="Nom" />
        <input v-model="newUser.Pre_nom_utilisateur" placeholder="Prénom" />
        <input v-model="newUser.Email_utilisateur" placeholder="Email" />
        <input v-model="newUser.Telephone_utilisateur" placeholder="Téléphone" />
        <input v-model="newUser.AdressePostale_utilisateur" placeholder="Adresse" />
      </div>
      <button class="utilisateurs-locale-btn" @click="addUser">Ajouter</button>
    </div>

    <p v-if="statusMessage" class="utilisateur-status">{{ statusMessage }}</p>

    <section class="utilisateurs-locale-grid">
      <article
        v-for="user in usersToDisplay"
        :key="user.ID_utilisateur || `${user.Nom_utilisateur}-${user.Email_utilisateur}`"
        class="utilisateur-locale-card"
      >
        <div v-if="editingUserId === user.ID_utilisateur" class="utilisateur-edit-form">
          <input v-model="editingUser.Nom_utilisateur" placeholder="Nom" />
          <input v-model="editingUser.Pre_nom_utilisateur" placeholder="Prénom" />
          <input v-model="editingUser.Email_utilisateur" placeholder="Email" />
          <input v-model="editingUser.Telephone_utilisateur" placeholder="Téléphone" />
          <input v-model="editingUser.AdressePostale_utilisateur" placeholder="Adresse" />
          <div class="utilisateur-edit-actions">
            <button class="utilisateur-edit-btn save" @click="saveEdit">Enregistrer</button>
            <button class="utilisateur-edit-btn cancel" @click="resetEditingUser">Annuler</button>
          </div>
        </div>

        <template v-else>
          <div class="utilisateur-locale-header">
            <div>
              <p class="utilisateur-locale-label">Utilisateur</p>
              <h3>{{ user.Nom_utilisateur }} {{ user.Pre_nom_utilisateur }}</h3>
            </div>
            <span class="utilisateur-locale-badge">#{{ user.ID_utilisateur || 'new' }}</span>
          </div>

          <div class="utilisateur-locale-info">
            <p><span>Email</span> {{ user.Email_utilisateur || '—' }}</p>
            <p><span>Téléphone</span> {{ user.Telephone_utilisateur || '—' }}</p>
            <p><span>Adresse</span> {{ user.AdressePostale_utilisateur || '—' }}</p>
          </div>

          <div class="utilisateur-card-actions">
            <button class="utilisateur-action-btn edit" @click="startEdit(user)">Modifier</button>
            <button class="utilisateur-action-btn delete" @click="deleteUser(user)">Supprimer</button>
          </div>
        </template>
      </article>
    </section>
  </section>
</template>
