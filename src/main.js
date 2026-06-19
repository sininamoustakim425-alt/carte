import { createApp } from 'vue'
import './styles/global.css'
import './styles/navbar.css'
import './styles/hero.css'
import './styles/footer.css'
import './styles/components.css'
import './styles/views.css'
import App from './App.vue'
import router from './router'

// Même formule que LocalEntityCards.vue
function localEntityKey(title, idKey) {
  const schemaName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `local-${schemaName}-${idKey}`
}

function seedIfEmpty(key, data) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

seedIfEmpty('local-users-dashboard', [
  { ID_utilisateur: 101, Nom_utilisateur: 'Benali', Pre_nom_utilisateur: 'Karim', Email_utilisateur: 'karim@example.com', Telephone_utilisateur: '0600000001', AdressePostale_utilisateur: 'Rue de la Paix, Casablanca' },
  { ID_utilisateur: 102, Nom_utilisateur: 'Ait Ali', Pre_nom_utilisateur: 'Sara', Email_utilisateur: 'sara@example.com', Telephone_utilisateur: '0600000002', AdressePostale_utilisateur: 'Avenue Hassan II, Rabat' },
  { ID_utilisateur: 103, Nom_utilisateur: 'Mouad', Pre_nom_utilisateur: 'Yassin', Email_utilisateur: 'yassin@example.com', Telephone_utilisateur: '0600000003', AdressePostale_utilisateur: 'Quartier El Maarif, Tanger' },
])

seedIfEmpty(localEntityKey('Catégorie', 'ID_categorie'), [
  { ID_categorie: 1, Nom_categorie: 'Équipement sportif', Description_categorie: 'Matériel de sport général' },
  { ID_categorie: 2, Nom_categorie: 'Matériel entraînement', Description_categorie: 'Accessoires pour entraînements' },
  { ID_categorie: 3, Nom_categorie: 'Sécurité', Description_categorie: 'Équipements de sécurité' },
])

seedIfEmpty(localEntityKey('Réservation', 'ID_reservation'), [
  { ID_reservation: 1, Date_reservation: '2026-06-10', Date_utilisation: '2026-06-15', Heure_debut: '09:00' },
  { ID_reservation: 2, Date_reservation: '2026-06-11', Date_utilisation: '2026-06-18', Heure_debut: '14:00' },
  { ID_reservation: 3, Date_reservation: '2026-06-12', Date_utilisation: '2026-06-20', Heure_debut: '10:30' },
  { ID_reservation: 4, Date_reservation: '2026-06-13', Date_utilisation: '2026-06-22', Heure_debut: '16:00' },
])

seedIfEmpty(localEntityKey('Paiement', 'ID_paiement'), [
  { ID_paiement: 1, Date_paiement: '2026-06-10', Montant: '150', Mode_paiement: 'Carte bancaire', Statut_paiement: 'Payé' },
  { ID_paiement: 2, Date_paiement: '2026-06-11', Montant: '80',  Mode_paiement: 'Espèces',       Statut_paiement: 'Payé' },
  { ID_paiement: 3, Date_paiement: '2026-06-12', Montant: '200', Mode_paiement: 'Virement',      Statut_paiement: 'En attente' },
  { ID_paiement: 4, Date_paiement: '2026-06-13', Montant: '120', Mode_paiement: 'Carte bancaire', Statut_paiement: 'En attente' },
  { ID_paiement: 5, Date_paiement: '2026-06-14', Montant: '60',  Mode_paiement: 'Espèces',       Statut_paiement: 'Annulé' },
])

seedIfEmpty(localEntityKey('Agent', 'ID_agent'), [
  { ID_agent: 1, Nom_agent: 'Saidi',   Prenom_agent: 'Omar',   Email_agent: 'omar@mairie.fr',   Fonction_agent: 'Responsable terrain' },
  { ID_agent: 2, Nom_agent: 'Khalil',  Prenom_agent: 'Nadia',  Email_agent: 'nadia@mairie.fr',  Fonction_agent: 'Gestionnaire réservations' },
  { ID_agent: 3, Nom_agent: 'Moussaoui', Prenom_agent: 'Hamid', Email_agent: 'hamid@mairie.fr', Fonction_agent: 'Agent de maintenance' },
])

const app = createApp(App)

app.use(router)
app.mount('#app')
