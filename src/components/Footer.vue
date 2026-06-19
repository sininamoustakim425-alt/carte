<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section footer-brand">
        <h3>Gestion des équipements</h3>
        <p>
          Plateforme moderne pour suivre les équipements, réservations, paiements et utilisateurs de votre ville.
        </p>
        <div class="footer-socials">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>

      <div class="footer-section">
        <h3>Navigation</h3>
        <ul>
          <li><a href="#">Accueil</a></li>
          <li><a href="#">Équipements</a></li>
          <li><a href="#">Réservations</a></li>
          <li><a href="#">Paiements</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Services</h3>
        <ul>
          <li><a href="#">Gestion des utilisateurs</a></li>
          <li><a href="#">Suivi des agents</a></li>
          <li><a href="#">Tableau de bord</a></li>
          <li><a href="#">Rapports</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Contact</h3>
        <p><strong>Email:</strong> moustakimsinina@gmail.com</p>
        <p><strong>Téléphone:</strong> 0639560364</p>
        <p><strong>Adresse:</strong> 12 chemin koutcha </p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Mairie Sport. Tous droits réservés.</p>
    </div>
  </footer>
</template>
