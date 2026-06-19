<script setup>
import { computed } from 'vue'
import { inferSchemaFromItem } from '../config/entitySchemas'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])

const schema = computed(() => inferSchemaFromItem(props.item))

const itemId = computed(() => {
  if (!props.item || !schema.value) return ''
  return props.item[schema.value.idKey] ?? ''
})

const displayTitle = computed(() => {
  if (!props.item || !schema.value) return 'Objet'
  return props.item[schema.value.titleKey] || 'Sans nom'
})

const detailFields = computed(() => {
  if (!schema.value?.fields) return []
  return schema.value.fields.slice(0, 3)
})

function handleEdit() {
  emit('edit', props.item)
}

function handleDelete() {
  emit('delete', itemId.value)
}
</script>

<template>
  <article class="card">
    <div class="card-head">
      <div>
        <h3>{{ displayTitle }}</h3>
        <p class="card-meta">ID {{ itemId }}</p>
      </div>
      <span class="card-tag">{{ schema?.title || 'Objet' }}</span>
    </div>

    <div v-if="detailFields.length" class="card-details">
      <p v-for="field in detailFields" :key="field.key" class="card-description">
        <strong>{{ field.label }} :</strong> {{ item[field.key] || '—' }}
      </p>
    </div>

    <div class="card-actions">
      <button class="secondary" type="button" @click="handleEdit">Modifier</button>
      <button class="danger" type="button" @click="handleDelete">Supprimer</button>
    </div>
  </article>
</template>
