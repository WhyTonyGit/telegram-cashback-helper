import type { UserCard, Category, Bank } from './types';
import { MOCK_CARDS, MOCK_CATEGORIES, MOCK_BANKS } from './mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let _authToken: string | null = null;

export function setAuthToken(token: string) {
  _authToken = token;
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (_authToken) {
    headers['Authorization'] = `TgInitData ${_authToken}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Auth ---

export async function authInit(): Promise<void> {
  if (USE_MOCK) return;
  await req('/auth/init', { method: 'POST' });
}

// --- Banks ---

export async function getBanks(): Promise<Bank[]> {
  if (USE_MOCK) return MOCK_BANKS;
  return req<Bank[]>('/banks');
}

// --- Categories ---

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) return MOCK_CATEGORIES;
  return req<Category[]>('/categories');
}

// --- User Cards ---

export async function getUserCards(): Promise<UserCard[]> {
  if (USE_MOCK) return structuredClone(MOCK_CARDS);
  return req<UserCard[]>('/user/cards');
}

export async function addUserCard(bank_id: string, label: string): Promise<UserCard> {
  if (USE_MOCK) {
    const bank = MOCK_BANKS.find(b => b.id === bank_id)!;
    const newCard: UserCard = {
      id: `${bank_id}-${Date.now()}`,
      label,
      bank,
      cashback: [],
    };
    return newCard;
  }
  return req<UserCard>('/user/cards', {
    method: 'POST',
    body: JSON.stringify({ bank_id, label }),
  });
}

export async function deleteUserCard(card_id: string): Promise<void> {
  if (USE_MOCK) return;
  await req(`/user/cards/${card_id}`, { method: 'DELETE' });
}

export async function updateCardLabel(card_id: string, label: string): Promise<void> {
  if (USE_MOCK) return;
  await req(`/user/cards/${card_id}/label`, {
    method: 'PUT',
    body: JSON.stringify({ label }),
  });
}

export async function updateCardCashback(
  card_id: string,
  cashback: Array<{ category_id: string; percent: number }>
): Promise<void> {
  if (USE_MOCK) return;
  await req(`/user/cards/${card_id}/cashback`, {
    method: 'PUT',
    body: JSON.stringify({ cashback }),
  });
}
