import type { UserCard, Category, Bank } from './types';

export const MOCK_BANKS: Bank[] = [
  { id: 'tinkoff', name: 'Тинькофф', slug: 'tinkoff', logo_url: '🟡', color: '#FFDD2D' },
  { id: 'sber', name: 'Сбер', slug: 'sber', logo_url: '🟢', color: '#21A038' },
  { id: 'alfa', name: 'Альфа', slug: 'alfa', logo_url: '🔴', color: '#EF3124' },
  { id: 'vtb', name: 'ВТБ', slug: 'vtb', logo_url: '🔵', color: '#009FDF' },
  { id: 'raif', name: 'Райффайзен', slug: 'raif', logo_url: '🟠', color: '#FFCE00' },
];

export const MOCK_CARDS: UserCard[] = [
  {
    id: 'tinkoff-black',
    label: 'Black',
    bank: MOCK_BANKS[0],
    cashback: [
      { category_id: 'food', percent: 5 },
      { category_id: 'transport', percent: 3 },
      { category_id: 'fuel', percent: 5 },
      { category_id: 'entertainment', percent: 2 },
    ]
  },
  {
    id: 'sber-prime',
    label: 'SberPrime',
    bank: MOCK_BANKS[1],
    cashback: [
      { category_id: 'food', percent: 3 },
      { category_id: 'supermarket', percent: 5 },
      { category_id: 'pharmacy', percent: 4 },
    ]
  },
  {
    id: 'alfa-cash',
    label: 'Cash Back',
    bank: MOCK_BANKS[2],
    cashback: [
      { category_id: 'food', percent: 7 },
      { category_id: 'transport', percent: 2 },
      { category_id: 'supermarket', percent: 3 },
      { category_id: 'entertainment', percent: 5 },
    ]
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'food', name: 'Кафе и рестораны', emoji: '🍔', slug: 'food' },
  { id: 'transport', name: 'Транспорт', emoji: '🚇', slug: 'transport' },
  { id: 'supermarket', name: 'Супермаркеты', emoji: '🛒', slug: 'supermarket' },
  { id: 'fuel', name: 'АЗС', emoji: '⛽', slug: 'fuel' },
  { id: 'pharmacy', name: 'Аптеки', emoji: '💊', slug: 'pharmacy' },
  { id: 'entertainment', name: 'Развлечения', emoji: '🎬', slug: 'entertainment' },
];
