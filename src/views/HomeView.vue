<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const entities = ref([
  { title: 'Utilisateurs', icon: '👤', path: '/utilisateurs', description: 'Gérer les utilisateurs du système' },
  { title: 'Catégories', icon: '📂', path: '/categories', description: 'Gérer les catégories' },
  { title: 'Réservations', icon: '📅', path: '/reservations', description: 'Gérer les réservations' },
  { title: 'Paiements', icon: '💳', path: '/paiements', description: 'Gérer les paiements' },
  { title: 'Agents', icon: '👨‍💼', path: '/agents', description: 'Gérer les agents' },
])

const counts = ref({})

// Même formule que LocalEntityCards.vue pour calculer la clé localStorage
function localEntityKey(title, idKey) {
  const schemaName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `local-${schemaName}-${idKey}`
}

function readLocalCount(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

const storageKeyMap = {
  Utilisateurs: 'local-users-dashboard',
  Catégories:   localEntityKey('Catégorie',   'ID_categorie'),
  Réservations: localEntityKey('Réservation', 'ID_reservation'),
  Paiements:    localEntityKey('Paiement',    'ID_paiement'),
  Agents:       localEntityKey('Agent',       'ID_agent'),
}

function refreshCounts() {
  const updated = {}
  for (const [label, key] of Object.entries(storageKeyMap)) {
    updated[label] = readLocalCount(key)
  }
  counts.value = updated
}

function handleRefresh() { refreshCounts() }
function navigate(path) { if (path) router.push(path) }

onMounted(() => {
  refreshCounts()
  window.addEventListener('dashboard-refresh', handleRefresh)
})
onBeforeUnmount(() => {
  window.removeEventListener('dashboard-refresh', handleRefresh)
})

// ---- Auth ----
const authTab = ref('login') // 'login' | 'register'

const loginForm = ref({ email: '', password: '', remember: false })
const registerForm = ref({ prenom: '', nom: '', email: '', password: '', confirm: '' })

const authAlert = ref({ type: '', msg: '' })
const authLoading = ref(false)

function resetAlert() { authAlert.value = { type: '', msg: '' } }

async function handleLogin() {
  if (!loginForm.value.email || !loginForm.value.password) {
    authAlert.value = { type: 'error', msg: 'Veuillez remplir tous les champs.' }
    return
  }
  authLoading.value = true
  resetAlert()
  await new Promise(r => setTimeout(r, 1000))
  authLoading.value = false
  authAlert.value = { type: 'success', msg: `Bienvenue ! Connexion réussie.` }
  loginForm.value = { email: '', password: '', remember: false }
}

async function handleRegister() {
  const { prenom, nom, email, password, confirm } = registerForm.value
  if (!prenom || !nom || !email || !password || !confirm) {
    authAlert.value = { type: 'error', msg: 'Veuillez remplir tous les champs.' }
    return
  }
  if (password !== confirm) {
    authAlert.value = { type: 'error', msg: 'Les mots de passe ne correspondent pas.' }
    return
  }
  if (password.length < 6) {
    authAlert.value = { type: 'error', msg: 'Le mot de passe doit contenir au moins 6 caractères.' }
    return
  }
  authLoading.value = true
  resetAlert()
  await new Promise(r => setTimeout(r, 1200))
  authLoading.value = false
  authAlert.value = { type: 'success', msg: `Compte créé avec succès ! Vous pouvez maintenant vous connecter.` }
  registerForm.value = { prenom: '', nom: '', email: '', password: '', confirm: '' }
}

function switchTab(tab) {
  authTab.value = tab
  resetAlert()
}
</script>

<template>
  <div class="home-view">
    <!-- Hero -->
    <header class="hero">
      <div class="hero-content">
        <p class="eyebrow">Bienvenue</p>
        <h1>Gestion d'Équipements Sportifs</h1>
        <p>Système complet de gestion des réservations et des équipements accessibles</p>
      </div>
    </header>

    <!-- Stats -->
    <section class="stats-grid">
      <div v-for="entity in entities" :key="entity.title" class="stat-card" @click="navigate(entity.path)">
        <div class="stat-icon">{{ entity.icon }}</div>
        <h3>{{ entity.title }}</h3>
        <p class="stat-value">{{ counts[entity.title] ?? 0 }}</p>
        <p>{{ entity.description }}</p>
        <p class="stat-hint">Cliquez pour gérer →</p>
      </div>
    </section>

    <!-- Bloc Auth -->
    <section class="auth-section">
      <div class="auth-intro">
        <p class="auth-eyebrow">Espace personnel</p>
        <h2>Accédez à votre compte</h2>
        <p>Connectez-vous ou créez un compte pour gérer vos réservations et suivre vos équipements.</p>
      </div>

      <div class="auth-card">
        <!-- Onglets -->
        <div class="auth-tabs">
          <button
            :class="['auth-tab', { active: authTab === 'login' }]"
            @click="switchTab('login')"
          >
            🔑 Se connecter
          </button>
          <button
            :class="['auth-tab', { active: authTab === 'register' }]"
            @click="switchTab('register')"
          >
            📝 S'inscrire
          </button>
        </div>

        <!-- Alerte -->
        <div
          v-if="authAlert.msg"
          :class="['auth-alert', authAlert.type === 'success' ? 'auth-alert-success' : 'auth-alert-error']"
        >
          {{ authAlert.type === 'success' ? '✅' : '⚠️' }} {{ authAlert.msg }}
        </div>

        <!-- Formulaire Connexion -->
        <form v-if="authTab === 'login'" @submit.prevent="handleLogin" novalidate class="auth-form">
          <div class="auth-field">
            <label>Adresse e-mail</label>
            <input v-model="loginForm.email" type="email" placeholder="exemple@email.com" @input="resetAlert" />
          </div>
          <div class="auth-field">
            <label>Mot de passe</label>
            <input v-model="loginForm.password" type="password" placeholder="••••••••" @input="resetAlert" />
          </div>
          <div class="auth-row-between">
            <label class="auth-checkbox">
              <input v-model="loginForm.remember" type="checkbox" />
              Se souvenir de moi
            </label>
            <a href="#" class="auth-link">Mot de passe oublié ?</a>
          </div>
          <button type="submit" class="auth-btn" :disabled="authLoading">
            {{ authLoading ? '⏳ Connexion...' : '🔑 Se connecter' }}
          </button>
          <p class="auth-switch">
            Pas encore de compte ?
            <button type="button" class="auth-link-btn" @click="switchTab('register')">Créer un compte</button>
          </p>
        </form>

        <!-- Formulaire Inscription -->
        <form v-else @submit.prevent="handleRegister" novalidate class="auth-form">
          <div class="auth-row-2">
            <div class="auth-field">
              <label>Prénom <span class="req">*</span></label>
              <input v-model="registerForm.prenom" type="text" placeholder="Jean" @input="resetAlert" />
            </div>
            <div class="auth-field">
              <label>Nom <span class="req">*</span></label>
              <input v-model="registerForm.nom" type="text" placeholder="Dupont" @input="resetAlert" />
            </div>
          </div>
          <div class="auth-field">
            <label>Adresse e-mail <span class="req">*</span></label>
            <input v-model="registerForm.email" type="email" placeholder="exemple@email.com" @input="resetAlert" />
          </div>
          <div class="auth-row-2">
            <div class="auth-field">
              <label>Mot de passe <span class="req">*</span></label>
              <input v-model="registerForm.password" type="password" placeholder="Min. 6 caractères" @input="resetAlert" />
            </div>
            <div class="auth-field">
              <label>Confirmer <span class="req">*</span></label>
              <input v-model="registerForm.confirm" type="password" placeholder="Répéter le mot de passe" @input="resetAlert" />
            </div>
          </div>
          <button type="submit" class="auth-btn" :disabled="authLoading">
            {{ authLoading ? '⏳ Création...' : '📝 Créer mon compte' }}
          </button>
          <p class="auth-switch">
            Déjà un compte ?
            <button type="button" class="auth-link-btn" @click="switchTab('login')">Se connecter</button>
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 32px 0;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover { transform: translateY(-4px); }

.stat-icon { font-size: 2.5rem; margin-bottom: 12px; }
.stat-card h3 { margin: 12px 0 8px; }

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4338ca;
  margin: 8px 0;
}

.stat-hint { font-size: 0.85rem; color: #94a3b8; }

/* ---- Auth Section ---- */
.auth-section {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 48px;
  align-items: center;
  margin: 56px 0 32px;
}

.auth-intro .auth-eyebrow {
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #0ea5e9;
  margin-bottom: 10px;
}

.auth-intro h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 14px;
  line-height: 1.2;
}

.auth-intro p {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
}

/* Card */
.auth-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
}

/* Tabs */
.auth-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  gap: 4px;
}

.auth-tab {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  border-radius: 9px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-tab.active {
  background: linear-gradient(90deg, #1e3a8a, #0ea5e9);
  color: #fff;
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.3);
}

/* Alert */
.auth-alert {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 18px;
}

.auth-alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.auth-alert-error   { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

/* Form */
.auth-form { display: flex; flex-direction: column; gap: 16px; }

.auth-field { display: flex; flex-direction: column; gap: 5px; }

.auth-field label {
  font-size: 0.87rem;
  font-weight: 600;
  color: #374151;
}

.req { color: #ef4444; }

.auth-field input {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 0.95rem;
  background: #f8fafc;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.auth-field input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: #fff;
}

.auth-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.auth-row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
}

.auth-checkbox {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #475569;
  cursor: pointer;
  font-weight: 500;
}

.auth-checkbox input { accent-color: #3b82f6; }

.auth-link { color: #0ea5e9; font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }

.auth-btn {
  padding: 13px;
  background: linear-gradient(90deg, #1e3a8a, #0ea5e9);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  margin-top: 4px;
}

.auth-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.auth-switch {
  text-align: center;
  font-size: 0.88rem;
  color: #64748b;
}

.auth-link-btn {
  background: none;
  border: none;
  color: #0ea5e9;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  font-size: 0.88rem;
}

.auth-link-btn:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 860px) {
  .auth-section {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .auth-intro { text-align: center; }
}

@media (max-width: 480px) {
  .auth-row-2 { grid-template-columns: 1fr; }
  .auth-card { padding: 20px 16px; }
}
</style>
