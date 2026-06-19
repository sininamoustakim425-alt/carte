<script setup>
import { ref, computed, onMounted } from 'vue'
import '../styles/profil.css'

const STORAGE_KEY = 'profil-utilisateur'

const defaultProfil = {
  prenom: 'Moustakim',
  nom: 'Sinina',
  email: 'moustakimsinina@gmail.com',
  telephone: '06 39 56 03 64',
  adresse: '12 Chemin Koutcha',
  role: 'Administrateur',
  dateInscription: '2024-01-15',
}

const profil = ref({ ...defaultProfil })
const editForm = ref({ ...defaultProfil })
const isEditing = ref(false)
const alert = ref({ type: '', msg: '' })

// Mot de passe
const pwForm = ref({ actuel: '', nouveau: '', confirm: '' })
const pwAlert = ref({ type: '', msg: '' })
const pwLoading = ref(false)

function loadProfil() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      profil.value = { ...defaultProfil, ...saved }
    }
  } catch { /* ignore */ }
}

function startEdit() {
  editForm.value = { ...profil.value }
  isEditing.value = true
  alert.value = { type: '', msg: '' }
}

function cancelEdit() {
  isEditing.value = false
  alert.value = { type: '', msg: '' }
}

function saveProfil() {
  if (!editForm.value.prenom || !editForm.value.nom || !editForm.value.email) {
    alert.value = { type: 'error', msg: 'Prénom, nom et email sont obligatoires.' }
    return
  }
  profil.value = { ...editForm.value }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profil.value))
  isEditing.value = false
  alert.value = { type: 'success', msg: 'Profil mis à jour avec succès !' }
  setTimeout(() => { alert.value = { type: '', msg: '' } }, 3000)
}

async function changePassword() {
  pwAlert.value = { type: '', msg: '' }
  if (!pwForm.value.actuel || !pwForm.value.nouveau || !pwForm.value.confirm) {
    pwAlert.value = { type: 'error', msg: 'Remplissez tous les champs.' }
    return
  }
  if (pwForm.value.nouveau.length < 6) {
    pwAlert.value = { type: 'error', msg: 'Le mot de passe doit contenir au moins 6 caractères.' }
    return
  }
  if (pwForm.value.nouveau !== pwForm.value.confirm) {
    pwAlert.value = { type: 'error', msg: 'Les nouveaux mots de passe ne correspondent pas.' }
    return
  }
  pwLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  pwLoading.value = false
  pwAlert.value = { type: 'success', msg: 'Mot de passe modifié avec succès !' }
  pwForm.value = { actuel: '', nouveau: '', confirm: '' }
  setTimeout(() => { pwAlert.value = { type: '', msg: '' } }, 3000)
}

function localEntityKey(title, idKey) {
  const schemaName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `local-${schemaName}-${idKey}`
}

function readLocalCount(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch { return 0 }
}

const stats = computed(() => [
  { label: 'Utilisateurs gérés', value: readLocalCount('local-users-dashboard'), icon: '👤' },
  { label: 'Réservations',        value: readLocalCount(localEntityKey('Réservation', 'ID_reservation')), icon: '📅' },
  { label: 'Paiements',           value: readLocalCount(localEntityKey('Paiement', 'ID_paiement')), icon: '💳' },
  { label: 'Agents',              value: readLocalCount(localEntityKey('Agent', 'ID_agent')), icon: '👨‍💼' },
])

const activites = [
  { icon: '✅', texte: 'Connexion réussie',              date: "Aujourd'hui, 09:14" },
  { icon: '📅', texte: 'Réservation #4 ajoutée',         date: "Aujourd'hui, 08:50" },
  { icon: '💳', texte: 'Paiement #3 enregistré',         date: 'Hier, 17:32' },
  { icon: '👤', texte: 'Utilisateur Mouad ajouté',       date: 'Hier, 14:10' },
  { icon: '🔧', texte: 'Profil mis à jour',              date: 'Il y a 3 jours' },
]

const initials = computed(() => {
  const p = profil.value.prenom?.[0] ?? ''
  const n = profil.value.nom?.[0] ?? ''
  return (p + n).toUpperCase()
})

onMounted(loadProfil)
</script>

<template>
  <div class="view">

    <!-- Hero -->
    <div class="profil-hero">
      <div class="profil-avatar-wrap">
        <div class="profil-avatar">{{ initials }}</div>
        <div class="profil-avatar-edit" title="Changer la photo">✏️</div>
      </div>
      <div class="profil-hero-info">
        <h1>{{ profil.prenom }} {{ profil.nom }}</h1>
        <p>{{ profil.email }}</p>
        <span class="profil-role-badge">{{ profil.role }}</span>
      </div>
    </div>

    <div class="profil-layout">

      <!-- Colonne gauche -->
      <div>
        <!-- Stats rapides -->
        <div class="profil-card">
          <h3>📊 Statistiques</h3>
          <div class="profil-stats">
            <div v-for="s in stats" :key="s.label" class="profil-stat-row">
              <span>{{ s.icon }} {{ s.label }}</span>
              <span>{{ s.value }}</span>
            </div>
            <div class="profil-stat-row">
              <span>📅 Membre depuis</span>
              <span>{{ new Date(profil.dateInscription).toLocaleDateString('fr-FR') }}</span>
            </div>
          </div>
        </div>

        <!-- Activité récente -->
        <div class="profil-card">
          <h3>🕐 Activité récente</h3>
          <div class="activite-list">
            <div v-for="(a, i) in activites" :key="i" class="activite-item">
              <span class="activite-icon">{{ a.icon }}</span>
              <span>{{ a.texte }}</span>
              <span class="activite-date">{{ a.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne droite -->
      <div>

        <!-- Infos / Édition -->
        <div class="profil-card">
          <h3>👤 Informations personnelles</h3>

          <div v-if="alert.msg" :class="['profil-alert', alert.type === 'success' ? 'profil-alert-success' : 'profil-alert-error']">
            {{ alert.type === 'success' ? '✅' : '⚠️' }} {{ alert.msg }}
          </div>

          <!-- Mode lecture -->
          <div v-if="!isEditing">
            <div class="profil-info-list">
              <div class="profil-info-row">
                <label>Prénom</label>
                <p>{{ profil.prenom }}</p>
              </div>
              <div class="profil-info-row">
                <label>Nom</label>
                <p>{{ profil.nom }}</p>
              </div>
              <div class="profil-info-row">
                <label>Email</label>
                <p>{{ profil.email }}</p>
              </div>
              <div class="profil-info-row">
                <label>Téléphone</label>
                <p>{{ profil.telephone || '—' }}</p>
              </div>
              <div class="profil-info-row">
                <label>Adresse</label>
                <p>{{ profil.adresse || '—' }}</p>
              </div>
              <div class="profil-info-row">
                <label>Rôle</label>
                <p>{{ profil.role }}</p>
              </div>
            </div>
            <div class="profil-btn-row" style="margin-top:20px">
              <button class="profil-btn profil-btn-primary" @click="startEdit">✏️ Modifier le profil</button>
            </div>
          </div>

          <!-- Mode édition -->
          <form v-else @submit.prevent="saveProfil" class="profil-form">
            <div class="profil-form-row">
              <div class="profil-field">
                <label>Prénom</label>
                <input v-model="editForm.prenom" type="text" placeholder="Prénom" />
              </div>
              <div class="profil-field">
                <label>Nom</label>
                <input v-model="editForm.nom" type="text" placeholder="Nom" />
              </div>
            </div>
            <div class="profil-field">
              <label>Email</label>
              <input v-model="editForm.email" type="email" placeholder="Email" />
            </div>
            <div class="profil-form-row">
              <div class="profil-field">
                <label>Téléphone</label>
                <input v-model="editForm.telephone" type="tel" placeholder="Téléphone" />
              </div>
              <div class="profil-field">
                <label>Rôle</label>
                <input v-model="editForm.role" type="text" disabled />
              </div>
            </div>
            <div class="profil-field">
              <label>Adresse</label>
              <input v-model="editForm.adresse" type="text" placeholder="Adresse" />
            </div>
            <div class="profil-btn-row">
              <button type="submit" class="profil-btn profil-btn-primary">💾 Enregistrer</button>
              <button type="button" class="profil-btn profil-btn-secondary" @click="cancelEdit">Annuler</button>
            </div>
          </form>
        </div>

        <!-- Changer mot de passe -->
        <div class="profil-card">
          <h3>🔒 Sécurité — Mot de passe</h3>

          <div v-if="pwAlert.msg" :class="['profil-alert', pwAlert.type === 'success' ? 'profil-alert-success' : 'profil-alert-error']">
            {{ pwAlert.type === 'success' ? '✅' : '⚠️' }} {{ pwAlert.msg }}
          </div>

          <form @submit.prevent="changePassword" class="profil-form">
            <div class="profil-field">
              <label>Mot de passe actuel</label>
              <input v-model="pwForm.actuel" type="password" placeholder="••••••••" />
            </div>
            <div class="profil-form-row">
              <div class="profil-field">
                <label>Nouveau mot de passe</label>
                <input v-model="pwForm.nouveau" type="password" placeholder="Min. 6 caractères" />
              </div>
              <div class="profil-field">
                <label>Confirmer</label>
                <input v-model="pwForm.confirm" type="password" placeholder="Répéter" />
              </div>
            </div>
            <div class="profil-btn-row">
              <button type="submit" class="profil-btn profil-btn-primary" :disabled="pwLoading">
                {{ pwLoading ? '⏳ Changement...' : '🔒 Changer le mot de passe' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>
