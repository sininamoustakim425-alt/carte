<script setup>
import { computed, reactive, ref, watch } from 'vue'
import '../styles/localEntityCards.css'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  schema: {
    type: Object,
    required: true
  }
})

const localItems = ref([])
const form = reactive({})
const editingItemId = ref(null)
const editingItem = reactive({})
const statusMessage = ref('')
const equipmentSuggestions = [
  'Terrain synthétique',
  'Buts standards',
  'Ballons de football',
  'Drapeaux de marquage',
  'Plot de training',
  "Cones d'entraînement",
  'Filet de but',
  'Équipement de maintenance',
  'Table de marque',
  'Télécommande de terrain'
]
const categorySuggestions = [
  'Équipement sportif',
  'Matériel d’entraînement',
  'Équipement de sécurité',
  'Accessoires terrain',
  'Mobilier municipal'
]
const reservationSuggestions = [
  'Match municipal',
  'Entraînement junior',
  'Compétition locale',
  'Réservation scolaire',
  'Tournoi communal'
]

const storageKey = computed(() => {
  const schemaName = (props.schema?.title || 'entity')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
  return `local-${schemaName}-${props.schema?.idKey || 'items'}`
})

const displayItems = computed(() => {
  return [...(props.items || []), ...localItems.value]
})

function initForm() {
  for (const field of props.schema?.fields || []) {
    form[field.key] = ''
  }
}

function getSuggestionsForField(fieldKey) {
  if (fieldKey === 'Nom_equipement' && props.schema?.idKey === 'ID_equipement') {
    return equipmentSuggestions
  }

  if (fieldKey === 'Nom_categorie' && props.schema?.idKey === 'ID_categorie') {
    return categorySuggestions
  }

  if (fieldKey === 'Date_reservation' && props.schema?.idKey === 'ID_reservation') {
    return reservationSuggestions
  }

  return []
}

function resetEditingItem() {
  editingItemId.value = null
  for (const field of props.schema?.fields || []) {
    editingItem[field.key] = ''
  }
}

function setStatus(message) {
  statusMessage.value = message
}

function saveToStorage() {
  if (!storageKey.value) return
  localStorage.setItem(storageKey.value, JSON.stringify(localItems.value))
}

function loadFromStorage() {
  if (!storageKey.value) return
  const saved = localStorage.getItem(storageKey.value)
  if (saved) {
    try {
      localItems.value = JSON.parse(saved)
    } catch (error) {
      localItems.value = []
    }
  }
}

function addItem() {
  const requiredFields = props.schema?.fields || []

  const isValid = requiredFields.every((field) => {
    const value = form[field.key]
    return String(value || '').trim() !== ''
  })

  if (!isValid) return

  const newItem = {
    [props.schema.idKey]: Date.now(),
    ...Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, String(value).trim()])
    )
  }

  localItems.value = [newItem, ...localItems.value]
  saveToStorage()
  window.dispatchEvent(new Event('dashboard-refresh'))
  setStatus(`${props.schema?.title || 'Élément'} ajouté avec succès.`)
  initForm()
}

function startEdit(item) {
  setStatus('')
  editingItemId.value = item[props.schema.idKey]
  for (const field of props.schema?.fields || []) {
    editingItem[field.key] = item[field.key] || ''
  }
}

function saveEdit() {
  if (!editingItemId.value) return

  const itemId = editingItemId.value
  const updatedItem = {
    ...Object.fromEntries(
      Object.entries(editingItem).map(([key, value]) => [key, String(value || '').trim()])
    ),
    [props.schema.idKey]: itemId
  }

  const itemIndex = props.items.findIndex((item) => item[props.schema.idKey] === itemId)

  if (itemIndex !== -1) {
    props.items.splice(itemIndex, 1, {
      ...props.items[itemIndex],
      ...updatedItem
    })
  } else {
    const localIndex = localItems.value.findIndex((item) => item[props.schema.idKey] === itemId)
    if (localIndex !== -1) {
      localItems.value.splice(localIndex, 1, updatedItem)
      saveToStorage()
    }
  }

  window.dispatchEvent(new Event('dashboard-refresh'))
  setStatus(`${props.schema?.title || 'Élément'} mis à jour avec succès.`)
  resetEditingItem()
}

function deleteItem(item) {
  const itemId = item[props.schema.idKey]
  if (!itemId || !confirm('Voulez-vous supprimer cet élément ?')) return

  const itemIndex = props.items.findIndex((current) => current[props.schema.idKey] === itemId)
  if (itemIndex !== -1) {
    props.items.splice(itemIndex, 1)
  } else {
    localItems.value = localItems.value.filter((current) => current[props.schema.idKey] !== itemId)
    saveToStorage()
  }

  window.dispatchEvent(new Event('dashboard-refresh'))
  setStatus(`${props.schema?.title || 'Élément'} supprimé avec succès.`)
}

watch(
  () => props.schema,
  () => {
    initForm()
    resetEditingItem()
    loadFromStorage()
  },
  { immediate: true }
)
</script>

<template>
  <section class="local-entity-panel">
    <div class="local-entity-form">
      <h3>Ajouter {{ schema?.title || 'élément' }}</h3>
      <div class="local-entity-fields">
        <template v-for="field in schema?.fields || []" :key="field.key">
          <div class="local-entity-field-group">
            <input
              v-model="form[field.key]"
              :type="field.type"
              :placeholder="field.label"
            />
            <ul v-if="getSuggestionsForField(field.key).length && form[field.key]" class="suggestion-list">
              <li
                v-for="suggestion in getSuggestionsForField(field.key).filter((item) =>
                  item.toLowerCase().includes(String(form[field.key]).toLowerCase())
                )"
                :key="suggestion"
                @click="form[field.key] = suggestion"
              >
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </template>
      </div>
      <button class="local-entity-btn" type="button" @click="addItem">Ajouter</button>
    </div>

    <p v-if="statusMessage" class="local-entity-status">{{ statusMessage }}</p>

    <section class="local-entity-grid">
      <article v-for="item in displayItems" :key="item[schema.idKey]" class="local-entity-card">
        <div v-if="editingItemId === item[schema.idKey]" class="local-entity-edit-form">
          <template v-for="field in schema?.fields || []" :key="field.key">
            <div class="local-entity-field-group">
              <input
                v-model="editingItem[field.key]"
                :type="field.type"
                :placeholder="field.label"
              />
              <ul v-if="getSuggestionsForField(field.key).length && editingItem[field.key]" class="suggestion-list">
                <li
                  v-for="suggestion in getSuggestionsForField(field.key).filter((item) =>
                    item.toLowerCase().includes(String(editingItem[field.key]).toLowerCase())
                  )"
                  :key="suggestion"
                  @click="editingItem[field.key] = suggestion"
                >
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </template>
          <div class="local-entity-edit-actions">
            <button class="local-entity-edit-btn save" @click="saveEdit">Enregistrer</button>
            <button class="local-entity-edit-btn cancel" @click="resetEditingItem">Annuler</button>
          </div>
        </div>

        <template v-else>
          <div class="local-entity-header">
            <div>
              <p class="local-entity-label">{{ schema?.title || 'Élément' }}</p>
              <h3>{{ item[schema.titleKey] || 'Sans titre' }}</h3>
            </div>
            <span class="local-entity-badge">#{{ item[schema.idKey] }}</span>
          </div>

          <div class="local-entity-info">
            <p v-for="field in schema?.fields?.slice(0, 3) || []" :key="field.key">
              <span>{{ field.label }}</span>
              {{ item[field.key] || '—' }}
            </p>
          </div>

          <div class="local-entity-actions">
            <button class="local-entity-action-btn edit" @click="startEdit(item)">Modifier</button>
            <button class="local-entity-action-btn delete" @click="deleteItem(item)">Supprimer</button>
          </div>
        </template>
      </article>
    </section>
  </section>
</template>
