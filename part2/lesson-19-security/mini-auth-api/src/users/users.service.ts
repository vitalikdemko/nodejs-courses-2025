import { Injectable } from '@nestjs/common';

export type AppUser = {
  id: number;
  email: string;
  password: string;
  roles: ('user' | 'admin')[];
};

@Injectable()
export class UsersService {
  private users: AppUser[] = [
    { id: 1, email: 'demo@example.com',  password: 'P@ssw0rd!', roles: ['user'] },
    { id: 2, email: 'admin@example.com', password: 'P@ssw0rd!', roles: ['admin'] },
  ];

  async findByEmail(email: string): Promise<AppUser | undefined> {
    return this.users.find(u => u.email === email);
  }
}
