import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database.json');

const _readDatabase = async() => {
  try {
    const data = await readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const _writeDatabase = async(data) => {
  const json = JSON.stringify(data, null, 2);
  await writeFile(dbPath, json);
};

const _generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const listUsers = async() => {
  const users = await _readDatabase();
  return users;
};


export const getUserById = async (id) => {
  const users = await _readDatabase();
  const user = users.find(u => u.id === id);
  return user || null;
};

export const createUser = async(userData) =>{
  const users = await _readDatabase();
  const newUser = {
    id: _generateId(),
    name: userData.name,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  await _writeDatabase(users);
  return newUser;
};

export const updateUser = async (id, updates) => {
  const users = await _readDatabase();
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return null;
  }
  const user = users[userIndex];
  if (updates.name !== undefined) {
    user.name = updates.name;
  }
  users[userIndex] = user;
  await _writeDatabase(users);
  return user;
};

export const deleteUser = async(id) => {
  const users = await _readDatabase();
  const initialLength = users.length;
  const updatedUsers = users.filter(u => u.id !== id);
  if (updatedUsers.length === initialLength) {
    return false;
  }
  await _writeDatabase(updatedUsers);
  return true;
};
