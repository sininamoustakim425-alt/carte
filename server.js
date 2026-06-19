import express from 'express'
import cors from 'cors'
import {
  UtilisateurManager,
  EquipementManager,
  CategorieManager,
  ReservationManager,
  PaiementManager,
  AgentManager,
} from './src/models/EntityManager.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Initialiser les managers
const utilisateurs = new UtilisateurManager()
const equipements = new EquipementManager()
const categories = new CategorieManager()
const reservations = new ReservationManager()
const paiements = new PaiementManager()
const agents = new AgentManager()

// Données initiales
utilisateurs.fromJSON([
  { ID_utilisateur: 1, Nom_utilisateur: 'Dupont', Pre_nom_utilisateur: 'Jean', Email_utilisateur: 'jean@mail.com', Telephone_utilisateur: '0612345678', AdressePostale_utilisateur: '10 rue de la Paix' },
  { ID_utilisateur: 2, Nom_utilisateur: 'Martin', Pre_nom_utilisateur: 'Marie', Email_utilisateur: 'marie@mail.com', Telephone_utilisateur: '0687654321', AdressePostale_utilisateur: '20 avenue du Stade' },
])

equipements.fromJSON([
  { ID_equipement: 1, Nom_equipement: 'Terrain de football', Adresse_equipement: 'Rue du stade', Capacite_max: 30, Etat_equipement: 'Ouvert' },
  { ID_equipement: 2, Nom_equipement: 'Terrain de tennis', Adresse_equipement: 'Rue du stade', Capacite_max: 4, Etat_equipement: 'Ouvert' },
])

categories.fromJSON([
  { ID_categorie: 1, Nom_categorie: 'Football/Tennis', Description_categorie: 'Sports collectifs' },
])

paiements.fromJSON([
  { ID_paiement: 1, Date_paiement: '16/06/2026', Montant: 25.00, Mode_paiement: 'Carte bancaire', Statut_paiement: 'Payé' },
])

agents.fromJSON([
  { ID_agent: 1, Nom_agent: 'Malik', Prenom_agent: 'Youssef', Email_agent: 'youssef@mail.com', Fonction_agent: 'Responsable réservation' },
])

// ==================== UTILISATEURS ====================
app.get('/api/utilisateurs', (req, res) => {
  res.json(utilisateurs.getAll())
})

app.post('/api/utilisateurs', (req, res) => {
  try {
    if (!req.body.Nom_utilisateur || !req.body.Email_utilisateur) {
      return res.status(400).json({ message: 'Nom et email requis.' })
    }
    const newUser = utilisateurs.add(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.get('/api/utilisateurs/:id', (req, res) => {
  const user = utilisateurs.getById(Number(req.params.id))
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' })
  res.json(user)
})

app.put('/api/utilisateurs/:id', (req, res) => {
  try {
    const updated = utilisateurs.update(Number(req.params.id), req.body)
    res.json(updated)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

app.delete('/api/utilisateurs/:id', (req, res) => {
  try {
    utilisateurs.delete(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// ==================== EQUIPEMENTS ====================
app.get('/api/equipements', (req, res) => {
  res.json(equipements.getAll())
})

app.post('/api/equipements', (req, res) => {
  try {
    if (!req.body.Nom_equipement) {
      return res.status(400).json({ message: 'Nom équipement requis.' })
    }
    const newEquip = equipements.add(req.body)
    res.status(201).json(newEquip)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.get('/api/equipements/:id', (req, res) => {
  const equip = equipements.getById(Number(req.params.id))
  if (!equip) return res.status(404).json({ message: 'Équipement non trouvé.' })
  res.json(equip)
})

app.put('/api/equipements/:id', (req, res) => {
  try {
    const updated = equipements.update(Number(req.params.id), req.body)
    res.json(updated)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

app.delete('/api/equipements/:id', (req, res) => {
  try {
    equipements.delete(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// ==================== CATEGORIES ====================
app.get('/api/categories', (req, res) => {
  res.json(categories.getAll())
})

app.post('/api/categories', (req, res) => {
  try {
    if (!req.body.Nom_categorie) {
      return res.status(400).json({ message: 'Nom catégorie requis.' })
    }
    const newCat = categories.add(req.body)
    res.status(201).json(newCat)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.put('/api/categories/:id', (req, res) => {
  try {
    const updated = categories.update(Number(req.params.id), req.body)
    res.json(updated)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

app.delete('/api/categories/:id', (req, res) => {
  try {
    categories.delete(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// ==================== RESERVATIONS ====================
app.get('/api/reservations', (req, res) => {
  res.json(reservations.getAll())
})

app.post('/api/reservations', (req, res) => {
  try {
    if (!req.body.Date_reservation || !req.body.Date_utilisation) {
      return res.status(400).json({ message: 'Dates requis.' })
    }
    const newRes = reservations.add(req.body)
    res.status(201).json(newRes)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.put('/api/reservations/:id', (req, res) => {
  try {
    const updated = reservations.update(Number(req.params.id), req.body)
    res.json(updated)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

app.delete('/api/reservations/:id', (req, res) => {
  try {
    reservations.delete(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// ==================== PAIEMENTS ====================
app.get('/api/paiements', (req, res) => {
  res.json(paiements.getAll())
})

app.post('/api/paiements', (req, res) => {
  try {
    if (!req.body.Date_paiement || !req.body.Montant) {
      return res.status(400).json({ message: 'Date et montant requis.' })
    }
    const newPay = paiements.add(req.body)
    res.status(201).json(newPay)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.put('/api/paiements/:id', (req, res) => {
  try {
    const updated = paiements.update(Number(req.params.id), req.body)
    res.json(updated)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

app.delete('/api/paiements/:id', (req, res) => {
  try {
    paiements.delete(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

// ==================== AGENTS ====================
app.get('/api/agents', (req, res) => {
  res.json(agents.getAll())
})

app.post('/api/agents', (req, res) => {
  try {
    if (!req.body.Nom_agent) {
      return res.status(400).json({ message: 'Nom agent requis.' })
    }
    const newAgent = agents.add(req.body)
    res.status(201).json(newAgent)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.put('/api/agents/:id', (req, res) => {
  try {
    const updated = agents.update(Number(req.params.id), req.body)
    res.json(updated)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

app.delete('/api/agents/:id', (req, res) => {
  try {
    agents.delete(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`)
})
