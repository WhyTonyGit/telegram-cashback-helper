import { writable, derived } from 'svelte/store';
import type { UserCard, Category, CardRecommendation } from './types';

export const cards = writable<UserCard[]>([]);
export const categories = writable<Category[]>([]);
export const selectedCategory = writable<string | null>(null);
export const isLoading = writable(true);
export const initDataRaw = writable<string | null>(null);

export const recommendations = derived<
  [typeof cards, typeof selectedCategory],
  CardRecommendation[]
>(
  [cards, selectedCategory],
  ([$cards, $cat]) => {
    if (!$cat) return [];
    return $cards
      .map(card => ({
        ...card,
        percent: card.cashback.find(c => c.category_id === $cat)?.percent ?? null
      }))
      .sort((a, b) => (b.percent ?? -1) - (a.percent ?? -1));
  }
);
