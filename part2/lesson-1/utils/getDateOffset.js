
export function getDateOffset(offset = 0) {
  const shift = parseInt(process.env.DATE_OFFSET || offset || 0, 10);
  const date = new Date();
  date.setDate(date.getDate() + shift);
  return date.toISOString().split('T')[0]; //YYYY-MM-DD
}
