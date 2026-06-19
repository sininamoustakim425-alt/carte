export const entitySchemas = {
  utilisateurs: {
    title: 'Utilisateur',
    endpoint: '/api/utilisateurs',
    fields: [
      { key: 'Nom_utilisateur', label: 'Nom', type: 'text' },
      { key: 'Pre_nom_utilisateur', label: 'Prénom', type: 'text' },
      { key: 'Email_utilisateur', label: 'Email', type: 'email' },
      { key: 'Telephone_utilisateur', label: 'Téléphone', type: 'text' },
      { key: 'AdressePostale_utilisateur', label: 'Adresse', type: 'text' },
    ],
    titleKey: 'Nom_utilisateur',
    subtitleKey: 'Email_utilisateur',
    idKey: 'ID_utilisateur'
  },
  equipements: {
    title: 'Équipement',
    endpoint: '/api/equipements',
    fields: [
      { key: 'Nom_equipement', label: 'Nom', type: 'text' },
      { key: 'Adresse_equipement', label: 'Adresse', type: 'text' },
      { key: 'Capacite_max', label: 'Capacité max', type: 'number' },
      { key: 'Etat_equipement', label: 'État', type: 'text' },
    ],
    titleKey: 'Nom_equipement',
    subtitleKey: 'Adresse_equipement',
    idKey: 'ID_equipement'
  },
  categories: {
    title: 'Catégorie',
    endpoint: '/api/categories',
    fields: [
      { key: 'Nom_categorie', label: 'Nom', type: 'text' },
      { key: 'Description_categorie', label: 'Description', type: 'text' },
    ],
    titleKey: 'Nom_categorie',
    subtitleKey: 'Description_categorie',
    idKey: 'ID_categorie'
  },
  reservations: {
    title: 'Réservation',
    endpoint: '/api/reservations',
    fields: [
      { key: 'Date_reservation', label: 'Date réservation', type: 'date' },
      { key: 'Date_utilisation', label: 'Date utilisation', type: 'date' },
      { key: 'Heure_debut', label: 'Heure début', type: 'time' },
    ],
    titleKey: 'Date_reservation',
    subtitleKey: 'Heure_debut',
    idKey: 'ID_reservation'
  },
  paiements: {
    title: 'Paiement',
    endpoint: '/api/paiements',
    fields: [
      { key: 'Date_paiement', label: 'Date paiement', type: 'date' },
      { key: 'Montant', label: 'Montant', type: 'number' },
      { key: 'Mode_paiement', label: 'Mode', type: 'text' },
      { key: 'Statut_paiement', label: 'Statut', type: 'text' },
    ],
    titleKey: 'Date_paiement',
    subtitleKey: 'Mode_paiement',
    idKey: 'ID_paiement'
  },
  agents: {
    title: 'Agent',
    endpoint: '/api/agents',
    fields: [
      { key: 'Nom_agent', label: 'Nom', type: 'text' },
      { key: 'Prenom_agent', label: 'Prénom', type: 'text' },
      { key: 'Email_agent', label: 'Email', type: 'email' },
      { key: 'Fonction_agent', label: 'Fonction', type: 'text' },
    ],
    titleKey: 'Nom_agent',
    subtitleKey: 'Email_agent',
    idKey: 'ID_agent'
  },
}

export function inferSchemaFromItem(item) {
  if (!item) return null

  const keyMap = {
    utilisateurs: ['Nom_utilisateur', 'Pre_nom_utilisateur', 'Email_utilisateur'],
    equipements: ['Nom_equipement', 'Adresse_equipement', 'Capacite_max'],
    categories: ['Nom_categorie', 'Description_categorie'],
    reservations: ['Date_reservation', 'Date_utilisation', 'Heure_debut'],
    paiements: ['Date_paiement', 'Montant', 'Mode_paiement'],
    agents: ['Nom_agent', 'Prenom_agent', 'Email_agent']
  }

  for (const [schemaName, keys] of Object.entries(keyMap)) {
    if (keys.some((key) => key in item)) {
      return entitySchemas[schemaName]
    }
  }

  return null
}
