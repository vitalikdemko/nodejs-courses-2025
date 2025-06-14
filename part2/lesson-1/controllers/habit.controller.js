
import { addHabit, listHabits, deleteHabit, updateHabit, markDone, calculateStats } from '../services/habit.service.js';

export const handleAdd = (args) => {
  const name = _getArg(args, '--name');
  const freq = _getArg(args, '--freq');
  if (!name || !freq) {
    console.error('Usage: add --name "<habit>" --freq <daily|weekly|monthly>');
    return;
  }
  const habit = addHabit(name, freq);
  console.log('Habit added:', habit);
}

export const handleList = () => {
  const habits = listHabits();
  if (!habits.length) {
    console.log('No habits found.');
    return;
  }
  console.table(habits.map(h => ({
    ID: h.id,
    Name: h.name,
    Freq: h.freq,
    DoneToday: h.doneDates.includes(new Date().toISOString().split('T')[0])
  })));
}

export const handleDelete = (args) => {
  const id = _getArg(args, '--id');
  if (!id) return console.error('Usage: delete --id <id>');
  deleteHabit(id);
  console.log('Habit deleted.');
}

export const handleUpdate = (args) => {
  const id = _getArg(args, '--id');
  const name = _getArg(args, '--name');
  const freq = _getArg(args, '--freq');
  if (!id || (!name && !freq)) {
    console.error('Usage: update --id <id> --name "<name>" --freq <...>');
    return;
  }
  const updated = updateHabit(id, name, freq);
  if (updated) console.log('Habit updated:', updated);
  else console.error('Habit not found.');
}

export const handleDone = (args) => {
  const id = _getArg(args, '--id');
  if (!id) return console.error('Usage: done --id <id>');
  const updated = markDone(id);
  if (updated) console.log('Habit marked as done for today.');
  else console.error('Habit not found.');
}

export const handleStats = () => {
  const stats = calculateStats(7);
  console.table(stats);
}

const _getArg = (args, key) => {
  const i = args.indexOf(key);
  return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
}