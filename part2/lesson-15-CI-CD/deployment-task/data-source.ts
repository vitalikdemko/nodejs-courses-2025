import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/entities/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: false,
});
