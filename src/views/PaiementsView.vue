<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

const STORAGE_KEY = 'local-paiement-ID_paiement'

// ── Données ──────────────────────────────────────────────
const paiements = ref([])

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) paiements.value = JSON.parse(raw)
  } catch { paiements.value = [] }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paiements.value))
  window.dispatchEvent(new Event('dashboard-refresh'))
}

function handleRefresh() { load() }

onMounted(() => { load(); window.addEventListener('dashboard-refresh', handleRefresh) })
onBeforeUnmount(() => window.removeEventListener('dashboard-refresh', handleRefresh))

// ── Statuts ───────────────────────────────────────────────
const STATUTS = ['Payé', 'En attente', 'Annulé']
const MODES   = ['Carte bancaire', 'Espèces', 'Virement', 'Chèque', 'Mobile']

function statutClass(s = '') {
  const v = s.toLowerCase()
  if (['payé','paye','validé','valide'].includes(v))      return 'badge-ok'
  if (['en attente','attente','pending'].includes(v))     return 'badge-wait'
  if (['annulé','annule','rejeté','rejete'].includes(v))  return 'badge-reject'
  return 'badge-default'
}

function statutIcon(s = '') {
  const v = s.toLowerCase()
  if (['payé','paye'].includes(v))       return '✅'
  if (['en attente','attente'].includes(v)) return '⏳'
  if (['annulé','annule'].includes(v))   return '❌'
  return '•'
}

// ── Filtre & recherche ────────────────────────────────────
const filtre     = ref('Tous')
const recherche  = ref('')
const sortKey    = ref('Date_paiement')
const sortAsc    = ref(false)

const filtered = computed(() => {
  let list = [...paiements.value]

  if (filtre.value !== 'Tous')
    list = list.filter(p => (p.Statut_paiement || '').toLowerCase() === filtre.value.toLowerCase())

  if (recherche.value.trim())
    list = list.filter(p => {
      const q = recherche.value.toLowerCase()
      return (p.Mode_paiement || '').toLowerCase().includes(q)
        || String(p.Montant || '').includes(q)
        || (p.Date_paiement || '').includes(q)
        || (p.Statut_paiement || '').toLowerCase().includes(q)
    })

  list.sort((a, b) => {
    const va = a[sortKey.value] ?? ''
    const vb = b[sortKey.value] ?? ''
    const cmp = String(va).localeCompare(String(vb), 'fr', { numeric: true })
    return sortAsc.value ? cmp : -cmp
  })

  return list
})

function toggleSort(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

// ── Stats ─────────────────────────────────────────────────
const totalMontant = computed(() =>
  paiements.value.reduce((s, p) => s + (parseFloat(p.Montant) || 0), 0)
)
const payesMontant = computed(() =>
  paiements.value
    .filter(p => ['payé','paye'].includes((p.Statut_paiement||'').toLowerCase()))
    .reduce((s, p) => s + (parseFloat(p.Montant)||0), 0)
)
const payesCount    = computed(() =>
  paiements.value.filter(p => ['payé','paye'].includes((p.Statut_paiement||'').toLowerCase())).length
)
const attenteCount  = computed(() =>
  paiements.value.filter(p => ['en attente','attente'].includes((p.Statut_paiement||'').toLowerCase())).length
)
const annuleCount   = computed(() =>
  paiements.value.filter(p => ['annulé','annule'].includes((p.Statut_paiement||'').toLowerCase())).length
)

// ── Formulaire ajout ─────────────────────────────────────
const showForm = ref(false)
const formAlert = ref('')
const form = ref(emptyForm())

function emptyForm() {
  return { Date_paiement: today(), Montant: '', Mode_paiement: 'Carte bancaire', Statut_paiement: 'Payé' }
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function openForm() {
  form.value = emptyForm()
  formAlert.value = ''
  showForm.value = true
}

function addPaiement() {
  if (!form.value.Montant || !form.value.Date_paiement) {
    formAlert.value = 'Le montant et la date sont obligatoires.'
    return
  }
  if (isNaN(parseFloat(form.value.Montant)) || parseFloat(form.value.Montant) <= 0) {
    formAlert.value = 'Le montant doit être un nombre positif.'
    return
  }
  paiements.value.unshift({ ...form.value, ID_paiement: Date.now() })
  save()
  showForm.value = false
  formAlert.value = ''
}

// ── Édition ───────────────────────────────────────────────
const editId   = ref(null)
const editData = ref({})

function startEdit(p) {
  editId.value = p.ID_paiement
  editData.value = { ...p }
}

function saveEdit() {
  const idx = paiements.value.findIndex(p => p.ID_paiement === editId.value)
  if (idx !== -1) paiements.value.splice(idx, 1, { ...editData.value })
  save()
  editId.value = null
}

function cancelEdit() { editId.value = null }

// ── Suppression ───────────────────────────────────────────
function deletePaiement(id) {
  if (!confirm('Supprimer ce paiement ?')) return
  paiements.value = paiements.value.filter(p => p.ID_paiement !== id)
  save()
}

// ── Divers ────────────────────────────────────────────────
function fmt(n) {
  return parseFloat(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="view paiements-page">

    <!-- ── HEADER ──────────────────────────────────────── -->
    <header class="p-header">
      <div class="p-header-left">
        <p class="p-eyebrow">Finance</p>
        <h1>Paiements</h1>
        <p class="p-subtitle">Suivi et gestion de tous les paiements</p>
      </div>
      <button class="p-btn-add" @click="openForm">+ Nouveau paiement</button>
    </header>

    <!-- ── STATS ───────────────────────────────────────── -->
    <section class="p-stats">
      <div class="p-stat p-stat-blue">
        <div class="p-stat-top">
          <span class="p-stat-icon">💰</span>
          <span class="p-stat-label">Volume total</span>
        </div>
        <p class="p-stat-value">{{ fmt(totalMontant) }} €</p>
        <p class="p-stat-sub">{{ paiements.length }} transaction(s)</p>
      </div>

      <div class="p-stat p-stat-green">
        <div class="p-stat-top">
          <span class="p-stat-icon">✅</span>
          <span class="p-stat-label">Encaissé</span>
        </div>
        <p class="p-stat-value">{{ fmt(payesMontant) }} €</p>
        <p class="p-stat-sub">{{ payesCount }} paiement(s)</p>
      </div>

      <div class="p-stat p-stat-orange">
        <div class="p-stat-top">
          <span class="p-stat-icon">⏳</span>
          <span class="p-stat-label">En attente</span>
        </div>
        <p class="p-stat-value">{{ attenteCount }}</p>
        <p class="p-stat-sub">à traiter</p>
      </div>

      <div class="p-stat p-stat-red">
        <div class="p-stat-top">
          <span class="p-stat-icon">❌</span>
          <span class="p-stat-label">Annulés</span>
        </div>
        <p class="p-stat-value">{{ annuleCount }}</p>
        <p class="p-stat-sub">transaction(s)</p>
      </div>
    </section>

    <!-- ── FORMULAIRE AJOUT ─────────────────────────────── -->
    <Transition name="slide">
      <div v-if="showForm" class="p-form-card">
        <div class="p-form-header">
          <h3>➕ Nouveau paiement</h3>
          <button class="p-close-btn" @click="showForm = false">✕</button>
        </div>
        <p v-if="formAlert" class="p-form-alert">⚠️ {{ formAlert }}</p>
        <div class="p-form-grid">
          <div class="p-field">
            <label>Date <span class="req">*</span></label>
            <input v-model="form.Date_paiement" type="date" />
          </div>
          <div class="p-field">
            <label>Montant (€) <span class="req">*</span></label>
            <input v-model="form.Montant" type="number" min="0" step="0.01" placeholder="0.00" />
          </div>
          <div class="p-field">
            <label>Mode de paiement</label>
            <select v-model="form.Mode_paiement">
              <option v-for="m in MODES" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
          <div class="p-field">
            <label>Statut</label>
            <select v-model="form.Statut_paiement">
              <option v-for="s in STATUTS" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
        </div>
        <div class="p-form-actions">
          <button class="p-btn-save" @click="addPaiement">💾 Enregistrer</button>
          <button class="p-btn-cancel" @click="showForm = false">Annuler</button>
        </div>
      </div>
    </Transition>

    <!-- ── FILTRES & RECHERCHE ──────────────────────────── -->
    <div class="p-toolbar">
      <div class="p-filters">
        <button
          v-for="f in ['Tous', ...STATUTS]"
          :key="f"
          :class="['p-filter-btn', { active: filtre === f }]"
          @click="filtre = f"
        >
          {{ statutIcon(f) }} {{ f }}
          <span v-if="f === 'Tous'" class="p-filter-count">{{ paiements.length }}</span>
          <span v-else-if="f === 'Payé'"       class="p-filter-count">{{ payesCount }}</span>
          <span v-else-if="f === 'En attente'" class="p-filter-count">{{ attenteCount }}</span>
          <span v-else-if="f === 'Annulé'"     class="p-filter-count">{{ annuleCount }}</span>
        </button>
      </div>
      <div class="p-search-wrap">
        <span class="p-search-icon">🔍</span>
        <input
          v-model="recherche"
          class="p-search"
          type="text"
          placeholder="Rechercher..."
        />
      </div>
    </div>

    <!-- ── TABLEAU ──────────────────────────────────────── -->
    <div class="p-table-wrap">
      <table class="p-table" v-if="filtered.length > 0">
        <thead>
          <tr>
            <th @click="toggleSort('Date_paiement')" class="sortable">
              Date {{ sortKey === 'Date_paiement' ? (sortAsc ? '↑' : '↓') : '↕' }}
            </th>
            <th @click="toggleSort('Montant')" class="sortable">
              Montant {{ sortKey === 'Montant' ? (sortAsc ? '↑' : '↓') : '↕' }}
            </th>
            <th>Mode</th>
            <th @click="toggleSort('Statut_paiement')" class="sortable">
              Statut {{ sortKey === 'Statut_paiement' ? (sortAsc ? '↑' : '↓') : '↕' }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.ID_paiement">

            <!-- Mode édition -->
            <template v-if="editId === p.ID_paiement">
              <td><input v-model="editData.Date_paiement" type="date" class="p-inline-input" /></td>
              <td><input v-model="editData.Montant" type="number" step="0.01" class="p-inline-input" /></td>
              <td>
                <select v-model="editData.Mode_paiement" class="p-inline-input">
                  <option v-for="m in MODES" :key="m" :value="m">{{ m }}</option>
                </select>
              </td>
              <td>
                <select v-model="editData.Statut_paiement" class="p-inline-input">
                  <option v-for="s in STATUTS" :key="s" :value="s">{{ s }}</option>
                </select>
              </td>
              <td class="p-actions">
                <button class="p-act-btn save" @click="saveEdit">✓</button>
                <button class="p-act-btn cancel" @click="cancelEdit">✕</button>
              </td>
            </template>

            <!-- Mode lecture -->
            <template v-else>
              <td class="p-td-date">
                <span class="p-date-day">{{ new Date(p.Date_paiement).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }) }}</span>
                <span class="p-date-year">{{ new Date(p.Date_paiement).getFullYear() }}</span>
              </td>
              <td class="p-td-montant">{{ fmt(p.Montant) }} €</td>
              <td>
                <span class="p-mode-pill">{{ p.Mode_paiement || '—' }}</span>
              </td>
              <td>
                <span :class="['p-badge', statutClass(p.Statut_paiement)]">
                  {{ statutIcon(p.Statut_paiement) }} {{ p.Statut_paiement || '—' }}
                </span>
              </td>
              <td class="p-actions">
                <button class="p-act-btn edit" @click="startEdit(p)" title="Modifier">✏️</button>
                <button class="p-act-btn delete" @click="deletePaiement(p.ID_paiement)" title="Supprimer">🗑️</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>

      <div v-else class="p-empty">
        <p>💳</p>
        <p>Aucun paiement {{ filtre !== 'Tous' ? 'avec le statut "' + filtre + '"' : '' }}</p>
        <button class="p-btn-add-sm" @click="openForm">Ajouter un paiement</button>
      </div>
    </div>

    <!-- Résumé bas de page -->
    <div v-if="filtered.length > 0" class="p-footer-summary">
      <span>{{ filtered.length }} résultat(s) affiché(s)</span>
      <span class="p-footer-total">
        Total filtré : <strong>{{ fmt(filtered.reduce((s,p) => s + (parseFloat(p.Montant)||0), 0)) }} €</strong>
      </span>
    </div>

  </div>
</template>

<style scoped>
.paiements-page { padding-bottom: 40px; }

/* ── HEADER ── */
.p-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
}

.p-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #0ea5e9;
  margin-bottom: 6px;
}

.p-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.p-subtitle { color: #64748b; font-size: 0.93rem; }

.p-btn-add {
  background: linear-gradient(90deg, #1e3a8a, #0ea5e9);
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 4px 14px rgba(14,165,233,0.3);
}
.p-btn-add:hover { opacity: 0.9; transform: translateY(-1px); }

/* ── STATS ── */
.p-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.p-stat {
  border-radius: 18px;
  padding: 22px 20px;
  box-shadow: 0 2px 12px rgba(15,23,42,0.07);
}

.p-stat-blue   { background: linear-gradient(135deg,#eff6ff,#dbeafe); }
.p-stat-green  { background: linear-gradient(135deg,#f0fdf4,#dcfce7); }
.p-stat-orange { background: linear-gradient(135deg,#fffbeb,#fef3c7); }
.p-stat-red    { background: linear-gradient(135deg,#fff1f2,#ffe4e6); }

.p-stat-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.p-stat-icon  { font-size: 1.2rem; }
.p-stat-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }

.p-stat-value { font-size: 1.7rem; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
.p-stat-sub   { font-size: 0.8rem; color: #94a3b8; margin: 0; }

/* ── FORMULAIRE ── */
.p-form-card {
  background: #fff;
  border-radius: 18px;
  padding: 24px 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px rgba(15,23,42,0.1);
  border: 1.5px solid #e0e7ff;
}

.p-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.p-form-header h3 { font-size: 1.05rem; font-weight: 700; color: #0f172a; }

.p-close-btn {
  background: #f1f5f9; border: none; border-radius: 8px;
  width: 30px; height: 30px; cursor: pointer; font-size: 0.9rem; color: #64748b;
}
.p-close-btn:hover { background: #e2e8f0; }

.p-form-alert {
  background: #fee2e2; color: #991b1b; border-radius: 8px;
  padding: 9px 14px; font-size: 0.88rem; margin-bottom: 14px;
}

.p-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.p-field { display: flex; flex-direction: column; gap: 5px; }

.p-field label { font-size: 0.84rem; font-weight: 600; color: #374151; }
.req { color: #ef4444; }

.p-field input, .p-field select {
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 10px 12px; font-size: 0.93rem; background: #f8fafc;
  color: #0f172a; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.p-field input:focus, .p-field select:focus {
  border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); background: #fff;
}

.p-form-actions { display: flex; gap: 10px; }

.p-btn-save {
  background: linear-gradient(90deg,#1e3a8a,#0ea5e9); color: #fff;
  border: none; border-radius: 10px; padding: 10px 22px;
  font-weight: 700; cursor: pointer; font-size: 0.93rem;
}
.p-btn-cancel {
  background: #f1f5f9; color: #475569; border: none;
  border-radius: 10px; padding: 10px 18px; font-weight: 600; cursor: pointer;
}

/* ── TOOLBAR ── */
.p-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.p-filters { display: flex; gap: 8px; flex-wrap: wrap; }

.p-filter-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border: 1.5px solid #e2e8f0;
  border-radius: 999px; background: #fff;
  font-size: 0.88rem; font-weight: 600; color: #64748b;
  cursor: pointer; transition: all 0.18s;
}
.p-filter-btn:hover { border-color: #94a3b8; color: #0f172a; }
.p-filter-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }

.p-filter-count {
  background: rgba(255,255,255,0.25); border-radius: 999px;
  padding: 1px 7px; font-size: 0.78rem;
}
.p-filter-btn:not(.active) .p-filter-count { background: #f1f5f9; color: #475569; }

.p-search-wrap { position: relative; }
.p-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.9rem; }
.p-search {
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 9px 14px 9px 36px; font-size: 0.92rem;
  background: #fff; outline: none; width: 220px;
  transition: border-color 0.2s;
}
.p-search:focus { border-color: #3b82f6; }

/* ── TABLEAU ── */
.p-table-wrap {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(15,23,42,0.08);
  overflow: hidden;
  margin-bottom: 16px;
}

.p-table { width: 100%; border-collapse: collapse; }

.p-table thead tr { background: #f8fafc; border-bottom: 2px solid #e2e8f0; }

.p-table th {
  padding: 14px 16px; text-align: left;
  font-size: 0.78rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;
}

.p-table th.sortable { cursor: pointer; user-select: none; }
.p-table th.sortable:hover { color: #0f172a; }

.p-table tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
.p-table tbody tr:last-child { border-bottom: none; }
.p-table tbody tr:hover { background: #f8fafc; }

.p-table td { padding: 14px 16px; font-size: 0.93rem; color: #1e293b; vertical-align: middle; }

.p-td-date { white-space: nowrap; }
.p-date-day  { display: block; font-weight: 700; color: #0f172a; }
.p-date-year { display: block; font-size: 0.78rem; color: #94a3b8; }

.p-td-montant { font-weight: 800; font-size: 1rem; color: #0f172a; }

.p-mode-pill {
  display: inline-block;
  background: #f1f5f9; color: #475569;
  padding: 3px 12px; border-radius: 999px; font-size: 0.83rem; font-weight: 600;
}

/* Badges statut */
.p-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 999px;
  font-size: 0.82rem; font-weight: 700;
}
.badge-ok      { background: #dcfce7; color: #166534; }
.badge-wait    { background: #fef3c7; color: #92400e; }
.badge-reject  { background: #fee2e2; color: #991b1b; }
.badge-default { background: #f1f5f9; color: #475569; }

/* Inputs inline édition */
.p-inline-input {
  border: 1.5px solid #3b82f6; border-radius: 8px;
  padding: 6px 9px; font-size: 0.88rem; width: 100%; outline: none;
  background: #f0f9ff;
}

/* Boutons actions */
.p-actions { display: flex; gap: 6px; }

.p-act-btn {
  width: 34px; height: 34px; border: none; border-radius: 8px;
  cursor: pointer; font-size: 0.9rem; display: grid; place-items: center;
  transition: background 0.15s;
}
.p-act-btn.edit   { background: #eef2ff; }
.p-act-btn.edit:hover { background: #e0e7ff; }
.p-act-btn.delete { background: #fee2e2; }
.p-act-btn.delete:hover { background: #fecaca; }
.p-act-btn.save   { background: #dcfce7; color: #166534; font-weight: 800; width: auto; padding: 0 12px; }
.p-act-btn.cancel { background: #fee2e2; color: #991b1b; font-weight: 800; width: auto; padding: 0 12px; }

/* État vide */
.p-empty {
  padding: 60px 20px; text-align: center; color: #94a3b8;
}
.p-empty p:first-child { font-size: 3rem; margin-bottom: 10px; }
.p-empty p { font-size: 1rem; margin-bottom: 16px; }

.p-btn-add-sm {
  background: #0f172a; color: #fff; border: none;
  border-radius: 10px; padding: 10px 20px; cursor: pointer;
  font-weight: 700; font-size: 0.9rem;
}

/* Résumé bas */
.p-footer-summary {
  display: flex; justify-content: space-between;
  font-size: 0.88rem; color: #64748b; padding: 0 4px;
}
.p-footer-total strong { color: #0f172a; }

/* Transition formulaire */
.slide-enter-active, .slide-leave-active { transition: all 0.25s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-12px); }

/* Responsive */
@media (max-width: 700px) {
  .p-table th:nth-child(3), .p-table td:nth-child(3) { display: none; }
  .p-search { width: 160px; }
  .p-header { flex-direction: column; align-items: flex-start; }
}
</style>
