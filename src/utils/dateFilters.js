export const getDateRange = (type, from, to) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  if (type === 'today') {
    return { start: new Date(y, m, d), end: new Date(y, m, d + 1) };
  }
  if (type === 'week') {
    const dayOfWeek = (now.getDay() + 6) % 7; // lunes = 0
    const start = new Date(y, m, d - dayOfWeek);
    return { start, end: new Date(y, m, d - dayOfWeek + 7) };
  }
  if (type === 'month') {
    return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) };
  }
  if (type === 'range' && from && to) {
    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const end = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1);
    return { start, end };
  }
  return { start: new Date(0), end: new Date(9999, 0, 1) };
};