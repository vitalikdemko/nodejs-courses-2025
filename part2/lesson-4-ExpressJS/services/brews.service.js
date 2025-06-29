export class BrewsService {
  constructor() {
    this.brews = [];
    this.counter = 1;
  }

  getAll(filters) {
    return this.brews.filter(b => {
      if (filters.method && b.method !== filters.method) return false;
      if (filters.ratingMin && b.rating < filters.ratingMin) return false;
      return true;
    });
  }

  getById(id) {
    console.log('getById: ',id)
    return this.brews.find(b => b.id === id);
  }

  create(brew) {
    console.log('create: ',brew)
    const newBrew = { id: String(this.counter++), ...brew };
    this.brews.push(newBrew);
    return newBrew;
  }

  update(id, brew) {
    console.log(`update ${id}: `,brew)
    const index = this.brews.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.brews[index] = { id, ...brew };
    return this.brews[index];
  }

  delete(id) {
    console.log('delete: ',id)
    const index = this.brews.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.brews.splice(index, 1);
    return true;
  }
}

export const brewsService = BrewsService;

