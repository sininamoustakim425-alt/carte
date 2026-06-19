<script setup>
import { ref, onMounted } from 'vue'
import ItemForm from '../components/ItemForm.vue'
import ItemCard from '../components/ItemCard.vue'

const products = ref([])
const isEditing = ref(false)
const editId = ref(null)
const statusMessage = ref('')

async function loadProducts() {
  try {
    const response = await fetch('/api/items')
    products.value = await response.json()
  } catch (error) {
    statusMessage.value = 'Erreur lors du chargement des produits'
  }
}

function resetForm() {
  isEditing.value = false
  editId.value = null
  statusMessage.value = ''
}

function editItem(item) {
  isEditing.value = true
  editId.value = item.id
}

async function saveItem(data) {
  try {
    const url = isEditing.value ? `/api/items/${editId.value}` : '/api/items'
    const method = isEditing.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      statusMessage.value = err?.message || 'Erreur lors de l\'enregistrement'
      return
    }

    await loadProducts()
    resetForm()
    statusMessage.value = isEditing.value ? 'Produit modifié' : 'Produit ajouté'
  } catch (error) {
    statusMessage.value = 'Erreur réseau'
  }
}

async function deleteItem(id) {
  try {
    const response = await fetch(`/api/items/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error()
    await loadProducts()
    statusMessage.value = 'Produit supprimé'
  } catch (error) {
    statusMessage.value = 'Erreur lors de la suppression'
  }
}

onMounted(loadProducts)
</script>

<template>
  <div class="view">
    <header class="hero">
      <div>
        <h1>Produits</h1>
        <p>Gérez vos produits avec ajout, modification et suppression</p>
      </div>
      <span class="badge">{{ products.length }} produits</span>
    </header>

    <ItemForm
      :item="isEditing ? products.find((p) => p.id === editId) : null"
      :isEditing="isEditing"
      :status="statusMessage"
      @save="saveItem"
      @cancel="resetForm"
    />

    <section class="cards">
      <ItemCard
        v-for="product in products"
        :key="product.id"
        :item="product"
        @edit="editItem"
        @delete="deleteItem"
      />
      <div v-if="products.length === 0" class="empty-state">
        <p>Aucun produit. Ajoutez-en un.</p>
      </div>
    </section>
  </div>
</template>
