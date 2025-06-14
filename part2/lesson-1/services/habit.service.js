
import { readDatabase, writeDatabase } from '../models/habit.model.js';
import { getDateOffset } from '../utils/getDateOffset.js';

const _generateId = () => {
  return Math.random().toString(36).substring(2, 10);
}

export const addHabit = (name, freq) => {
  const db = readDatabase();
  const habit = {
    id: _generateId(),
    name,
    freq,
    createdAt: new Date().toISOString(),
    doneDates: []
  };
  db.push(habit);
  writeDatabase(db);
  return habit;
}

export const listHabits = () => {
  return readDatabase();
}

export const deleteHabit = (id) => {
  const db = readDatabase();
  const updated = db.filter(h => h.id !== id);
  writeDatabase(updated);
}

export const updateHabit = (id, name, freq) => {
  const db = readDatabase();
  const habit = db.find(h => h.id === id);
  if (!habit) return null;
  if (name) habit.name = name;
  if (freq) habit.freq = freq;
  writeDatabase(db);
  return habit;
}

export const markDone = (id) => {
  const db = readDatabase();
  const habit = db.find(h => h.id === id);
  if (!habit) return null;
  const today = getDateOffset(0);
  if (!habit.doneDates.includes(today)) {
    habit.doneDates.push(today);
    writeDatabase(db);
  }
  return habit;
}

export const calculateStats = (days = 7) => {
  const db = readDatabase();
  const today = new Date();
  return db.map(habit => {
    const recent = habit.doneDates.filter(dateStr => {
      const date = new Date(dateStr);
      const diff = (today - date) / (1000 * 60 * 60 * 24);
      return diff < days;
    });
    return {
      id: habit.id,
      name: habit.name,
      freq: habit.freq,
      percent: ((recent.length / days) * 100).toFixed(1) + '%'
    };
  });
}
