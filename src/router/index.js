import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UtilisateursView from '../views/UtilisateursView.vue'
import EquipementsView from '../views/EquipementsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import ReservationsView from '../views/ReservationsView.vue'
import PaiementsView from '../views/PaiementsView.vue'
import AgentsView from '../views/AgentsView.vue'
import ContactsView from '../views/ContactsView.vue'
import ProfilView from '../views/ProfilView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/utilisateurs',
    name: 'Utilisateurs',
    component: UtilisateursView,
  },
  {
    path: '/equipements',
    name: 'Equipements',
    component: EquipementsView,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesView,
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: ReservationsView,
  },
  {
    path: '/paiements',
    name: 'Paiements',
    component: PaiementsView,
  },
  {
    path: '/agents',
    name: 'Agents',
    component: AgentsView,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactsView,
  },
  {
    path: '/profil',
    name: 'Profil',
    component: ProfilView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  
  routes,
})

export default router

