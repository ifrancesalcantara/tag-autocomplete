export class Tag {
  constructor (params = {}) {
    const {
      id,
      text
    } = params
    this.id = id || null
    this.text = text || null
  }
}
