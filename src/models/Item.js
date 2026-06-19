export class Item {
  constructor(id, title, description, category = 'general') {
    this.id = id
    this.title = title
    this.description = description
    this.category = category
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  update(title, description, category) {
    this.title = title
    this.description = description
    this.category = category
    this.updatedAt = new Date().toISOString()
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
