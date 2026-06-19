<script setup>
import { ref } from 'vue'
import '../styles/contact.css'

const form = ref({
  nom: '',
  email: '',
  telephone: '',
  sujet: '',
  message: '',
})

const loading = ref(false)
const alertType = ref('')
const alertMsg = ref('')

const sujets = [
  'Réservation d\'équipement',
  'Information tarifs',
  'Problème technique',
  'Signalement',
  'Partenariat',
  'Autre',
]

function resetAlert() {
  alertType.value = ''
  alertMsg.value = ''
}

async function submitForm() {
  if (!form.value.nom || !form.value.email || !form.value.message) {
    alertType.value = 'error'
    alertMsg.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    alertType.value = 'error'
    alertMsg.value = 'Adresse e-mail invalide.'
    return
  }

  loading.value = true
  resetAlert()

  await new Promise((resolve) => setTimeout(resolve, 1200))

  loading.value = false
  alertType.value = 'success'
  alertMsg.value = 'Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.'

  form.value = { nom: '', email: '', telephone: '', sujet: '', message: '' }
}
</script>

<template>
  <div class="view">
    <!-- Hero -->
    <div class="contact-hero">
      <p class="eyebrow">Contactez-nous</p>
      <h1>Nous sommes à votre écoute</h1>
      <p>Une question, une demande de réservation ou un signalement ? Écrivez-nous et nous vous répondrons rapidement.</p>
    </div>

    <!-- Layout principal -->
    <div class="contact-layout">

      <!-- Colonne gauche : infos -->
      <div>
        <p class="contact-info-title">Nos coordonnées</p>

        <div class="contact-info-list">
          <div class="info-card">
            <div class="info-icon blue">📍</div>
            <div class="info-text">
              <h4>Adresse</h4>
              <p>12 Chemin Koutcha, Ville</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon green">📞</div>
            <div class="info-text">
              <h4>Téléphone</h4>
              <p>06 39 56 03 64</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon orange">✉️</div>
            <div class="info-text">
              <h4>Email</h4>
              <p>moustakimsinina@gmail.com</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon purple">🌐</div>
            <div class="info-text">
              <h4>Plateforme</h4>
              <p>Mairie Sport — Administration</p>
            </div>
          </div>
        </div>

        <!-- Horaires -->
        <div class="horaires-card">
          <h4>🕐 Horaires d'ouverture</h4>
          <div class="horaire-row">
            <span>Lundi – Vendredi</span>
            <span>08h00 – 18h00</span>
          </div>
          <div class="horaire-row">
            <span>Samedi</span>
            <span>09h00 – 14h00</span>
          </div>
          <div class="horaire-row">
            <span>Dimanche</span>
            <span>Fermé</span>
          </div>
        </div>
      </div>

      <!-- Colonne droite : formulaire -->
      <div class="contact-form-card">
        <h2>Envoyer un message</h2>
        <p>Remplissez le formulaire ci-dessous, nous vous répondrons dans les 24h.</p>

        <!-- Alerte -->
        <div v-if="alertMsg" :class="['alert', alertType === 'success' ? 'alert-success' : 'alert-error']">
          <span>{{ alertType === 'success' ? '✅' : '⚠️' }}</span>
          {{ alertMsg }}
        </div>

        <form @submit.prevent="submitForm" novalidate>
          <!-- Nom & Email -->
          <div class="form-row">
            <div class="form-group">
              <label>Nom complet <span class="required">*</span></label>
              <input
                v-model="form.nom"
                type="text"
                placeholder="Jean Dupont"
                @input="resetAlert"
              />
            </div>
            <div class="form-group">
              <label>Email <span class="required">*</span></label>
              <input
                v-model="form.email"
                type="email"
                placeholder="jean@example.com"
                @input="resetAlert"
              />
            </div>
          </div>

          <!-- Téléphone & Sujet -->
          <div class="form-row">
            <div class="form-group">
              <label>Téléphone</label>
              <input
                v-model="form.telephone"
                type="tel"
                placeholder="06 XX XX XX XX"
              />
            </div>
            <div class="form-group">
              <label>Sujet</label>
              <select v-model="form.sujet">
                <option value="">-- Choisir un sujet --</option>
                <option v-for="s in sujets" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <!-- Message -->
          <div class="form-group">
            <label>Message <span class="required">*</span></label>
            <textarea
              v-model="form.message"
              placeholder="Décrivez votre demande..."
              @input="resetAlert"
            ></textarea>
          </div>

          <button type="submit" class="btn-send" :disabled="loading">
            <span v-if="loading">⏳ Envoi en cours...</span>
            <span v-else>📨 Envoyer le message</span>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>
