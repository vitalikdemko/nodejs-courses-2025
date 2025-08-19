
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let svc: ProfilesService;

  beforeEach(() => { svc = new ProfilesService(); });

  it('creates and returns id', () => {
    const p = svc.create({ email: 'tratata@aaa.aa', displayName: 'Vitalik', age: 30 });
    expect(p.id).toBeDefined();
  });

  it('throws on duplicate email', () => {
    svc.create({ email: 'tratata@aaa.aa', displayName: 'Vitalik', age: 30 });
    expect(() => svc.create({ email: 'tratata@aaa.aa', displayName: 'Vitalik2', age: 31 }))
      .toThrow('email already exists');
  });

  it('findById throws not found', () => {
    expect(() => svc.findById('999')).toThrow('not found');
  });
});
