export const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(date),
  );

export const formatDuration = (minutes: number) => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const truncate = (text: string, len = 100) =>
  text && text.length > len ? `${text.slice(0, len)}…` : text;
