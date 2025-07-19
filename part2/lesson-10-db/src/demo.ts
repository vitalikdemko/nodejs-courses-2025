import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { UserRepository, User } from './repositories/user.repo';

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const userRepo = new UserRepository(pool);

async function runDemo() {
  try {
    const newUser: Omit<User, 'id'> = {
      name: 'Vitalik',
      email: 'vdemko@example.com',
    };
    // 1. ccreate new user
    const savedUser = await userRepo.save(newUser);
    console.log('Saved user:', savedUser);
    
    // 2. Get all
    const allUsers = await userRepo.find();
    console.log('All users:', allUsers);
    
    // 3. Update user
    const userId = savedUser.id;
    const updatedUser = await userRepo.update(userId, { name: 'Nathan' });
    console.log('Updated user:', updatedUser);
    
    // 4. Delete user
    await userRepo.delete(userId);
    console.log(`Deleted user with id: ${userId}`);
    
    // 5. Find after deletion
    const foundAfterDelete = await userRepo.findOne(userId);
    console.log('Find after delete:', foundAfterDelete);
  } catch (err) {
    console.error('Error during demo:', err);
  } finally {
    await pool.end();
  }
}

runDemo();
