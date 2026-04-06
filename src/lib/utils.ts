export function formatPercent(percent: number | null): string {
  if (percent === null) return '—';
  return `${percent}%`;
}

export function activeCategoriesCount(cashback: Array<{ percent: number }>): number {
  return cashback.filter(c => c.percent > 0).length;
}
