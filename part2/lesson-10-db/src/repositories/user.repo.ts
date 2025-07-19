import { Pool } from 'pg';
import { Orm } from '../orm/orm';

export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserRepository extends Orm<User> {
  constructor(pool: Pool) {
    super('users', pool);
  }
}