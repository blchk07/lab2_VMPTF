export const STATUS_LABELS = {
  todo: 'Заплановано',
  in_progress: 'В роботі',
  done: 'Виконано'
};

export const PRIORITY_LABELS = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий'
};

export function formatStatus(value) {
  return STATUS_LABELS[value] || value || 'Не вказано';
}

export function formatPriority(value) {
  return PRIORITY_LABELS[value] || value || 'Не вказано';
}

export function formatDateTime(value) {
  if (!value) return 'Не вказано';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
