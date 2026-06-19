export class Utilisateur {
  constructor(id, nom, prenom, email, telephone, adresse) {
    this.ID_utilisateur = id
    this.Nom_utilisateur = nom
    this.Pre_nom_utilisateur = prenom
    this.Email_utilisateur = email
    this.Telephone_utilisateur = telephone
    this.AdressePostale_utilisateur = adresse
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  update(nom, prenom, email, telephone, adresse) {
    this.Nom_utilisateur = nom
    this.Pre_nom_utilisateur = prenom
    this.Email_utilisateur = email
    this.Telephone_utilisateur = telephone
    this.AdressePostale_utilisateur = adresse
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      ID_utilisateur: this.ID_utilisateur,
      Nom_utilisateur: this.Nom_utilisateur,
      Pre_nom_utilisateur: this.Pre_nom_utilisateur,
      Email_utilisateur: this.Email_utilisateur,
      Telephone_utilisateur: this.Telephone_utilisateur,
      AdressePostale_utilisateur: this.AdressePostale_utilisateur,
    }
  }
}

export class Equipement {
  constructor(id, nom, adresse, capaciteMax, etat) {
    this.ID_equipement = id
    this.Nom_equipement = nom
    this.Adresse_equipement = adresse
    this.Capacite_max = capaciteMax
    this.Etat_equipement = etat
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  update(nom, adresse, capaciteMax, etat) {
    this.Nom_equipement = nom
    this.Adresse_equipement = adresse
    this.Capacite_max = capaciteMax
    this.Etat_equipement = etat
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      ID_equipement: this.ID_equipement,
      Nom_equipement: this.Nom_equipement,
      Adresse_equipement: this.Adresse_equipement,
      Capacite_max: this.Capacite_max,
      Etat_equipement: this.Etat_equipement,
    }
  }
}

export class Categorie {
  constructor(id, nom, description) {
    this.ID_categorie = id
    this.Nom_categorie = nom
    this.Description_categorie = description
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  update(nom, description) {
    this.Nom_categorie = nom
    this.Description_categorie = description
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      ID_categorie: this.ID_categorie,
      Nom_categorie: this.Nom_categorie,
      Description_categorie: this.Description_categorie,
    }
  }
}

export class Reservation {
  constructor(id, dateReservation, dateUtilisation, heureDebut) {
    this.ID_reservation = id
    this.Date_reservation = dateReservation
    this.Date_utilisation = dateUtilisation
    this.Heure_debut = heureDebut
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  update(dateReservation, dateUtilisation, heureDebut) {
    this.Date_reservation = dateReservation
    this.Date_utilisation = dateUtilisation
    this.Heure_debut = heureDebut
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      ID_reservation: this.ID_reservation,
      Date_reservation: this.Date_reservation,
      Date_utilisation: this.Date_utilisation,
      Heure_debut: this.Heure_debut,
    }
  }
}

export class Paiement {
  constructor(id, datePaiement, montant, modePaiement, statut) {
    this.ID_paiement = id
    this.Date_paiement = datePaiement
    this.Montant = montant
    this.Mode_paiement = modePaiement
    this.Statut_paiement = statut
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  update(datePaiement, montant, modePaiement, statut) {
    this.Date_paiement = datePaiement
    this.Montant = montant
    this.Mode_paiement = modePaiement
    this.Statut_paiement = statut
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      ID_paiement: this.ID_paiement,
      Date_paiement: this.Date_paiement,
      Montant: this.Montant,
      Mode_paiement: this.Mode_paiement,
      Statut_paiement: this.Statut_paiement,
    }
  }
}

export class Agent {
  constructor(id, nom, prenom, email, fonction) {
    this.ID_agent = id
    this.Nom_agent = nom
    this.Prenom_agent = prenom
    this.Email_agent = email
    this.Fonction_agent = fonction
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  update(nom, prenom, email, fonction) {
    this.Nom_agent = nom
    this.Prenom_agent = prenom
    this.Email_agent = email
    this.Fonction_agent = fonction
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      ID_agent: this.ID_agent,
      Nom_agent: this.Nom_agent,
      Prenom_agent: this.Prenom_agent,
      Email_agent: this.Email_agent,
      Fonction_agent: this.Fonction_agent,
    }
  }
}
