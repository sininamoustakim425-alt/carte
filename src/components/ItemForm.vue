<script setup>
import { computed, reactive, watch } from 'vue'
import { inferSchemaFromItem } from '../config/entitySchemas'

const props = defineProps({
  item: Object,
  isEditing: Boolean,
  status: String,
  schema: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const selectedSchema = computed(() => props.schema || inferSchemaFromItem(props.item))

const form = reactive({})

function getEmptyForm(schema) {
  return Object.fromEntries(schema?.fields.map((field) => [field.key, '']) || [])
}

function resetForm() {
  Object.assign(form, getEmptyForm(selectedSchema.value))
}

watch(
  selectedSchema,
  (schema) => {
    resetForm()

    if (props.item) {
      for (const field of schema?.fields || []) {
        form[field.key] = props.item[field.key] ?? ''
      }
    }
  },
  { immediate: true, deep: true }
)

function submit() {
  emit('save', { ...form })
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <section class="form-card" v-if="selectedSchema">
    <h2>
      {{ isEditing ? `Modifier ${selectedSchema.title}` : `Ajouter ${selectedSchema.title}` }}
    </h2>

    <p v-if="status" class="form-status">{{ status }}</p>

    <form @submit.prevent="submit" class="item-form">
      <div class="form-grid">
        <label
          v-for="field in selectedSchema.fields"
          :key="field.key"
          :class="field.key === 'Description_categorie' || field.key === 'AdressePostale_utilisateur' ? 'full-width' : ''"
        >
          {{ field.label }}
          <input v-model="form[field.key]" :type="field.type" />
        </label>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="cancel">
          Annuler
        </button>
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Enregistrer' : 'Ajouter' }}
        </button>
      </div>
    </form>
  </section>
</template>