export class EntityManager {
  constructor() {
    this.items = []
    this.nextId = 1
  }

  getAll() {
    return this.items
  }

  getById(id) {
    return this.items.find(item =>
      Object.values(item).includes(id)
    )
  }

  add(entity) {
    if (entity.ID_utilisateur === undefined) {
      entity.ID_utilisateur = this.nextId++
    }

    if (entity.ID_equipement === undefined) {
      entity.ID_equipement = this.nextId++
    }

    if (entity.ID_categorie === undefined) {
      entity.ID_categorie = this.nextId++
    }

    if (entity.ID_reservation === undefined) {
      entity.ID_reservation = this.nextId++
    }

    if (entity.ID_paiement === undefined) {
      entity.ID_paiement = this.nextId++
    }

    if (entity.ID_agent === undefined) {
      entity.ID_agent = this.nextId++
    }

    this.items.push(entity)
    return entity
  }

  update(id, updatedData) {
    const index = this.items.findIndex(item =>
      Object.values(item).includes(id)
    )

    if (index === -1) {
      throw new Error('Élément introuvable')
    }

    this.items[index] = {
      ...this.items[index],
      ...updatedData
    }

    return this.items[index]
  }

  delete(id) {
    const index = this.items.findIndex(item =>
      Object.values(item).includes(id)
    )

    if (index === -1) {
      throw new Error('Élément introuvable')
    }

    this.items.splice(index, 1)
  }

  fromJSON(data) {
    this.items = data
  }
}

export class UtilisateurManager extends EntityManager {}
export class EquipementManager extends EntityManager {}
export class CategorieManager extends EntityManager {}
export class ReservationManager extends EntityManager {}
export class PaiementManager extends EntityManager {}
export class AgentManager extends EntityManager {}