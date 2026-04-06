import {
  pgTable,
  uuid,
  bigint,
  varchar,
  numeric,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  telegram_id: bigint('telegram_id', { mode: 'number' }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const banks = pgTable('banks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 128 }).notNull(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  logo_url: varchar('logo_url', { length: 512 }).notNull().default(''),
  color: varchar('color', { length: 16 }).notNull().default('#888888'),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 128 }).notNull(),
  emoji: varchar('emoji', { length: 8 }).notNull().default('🏷️'),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
});

export const userCards = pgTable('user_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bank_id: uuid('bank_id').notNull().references(() => banks.id),
  label: varchar('label', { length: 64 }).notNull().default(''),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const userCashback = pgTable('user_cashback', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_card_id: uuid('user_card_id').notNull().references(() => userCards.id, { onDelete: 'cascade' }),
  category_id: uuid('category_id').notNull().references(() => categories.id),
  percent: numeric('percent', { precision: 5, scale: 2 }).notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const bankCashbackOffers = pgTable('bank_cashback_offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  bank_id: uuid('bank_id').notNull().references(() => banks.id),
  category_id: uuid('category_id').notNull().references(() => categories.id),
  card_type: varchar('card_type', { length: 64 }).notNull().default(''),
  percent: numeric('percent', { precision: 5, scale: 2 }).notNull(),
  valid_from: date('valid_from'),
  valid_to: date('valid_to'),
  source_url: varchar('source_url', { length: 512 }),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const userCardsRelations = relations(userCards, ({ one, many }) => ({
  user: one(users, { fields: [userCards.user_id], references: [users.id] }),
  bank: one(banks, { fields: [userCards.bank_id], references: [banks.id] }),
  cashback: many(userCashback),
}));

export const userCashbackRelations = relations(userCashback, ({ one }) => ({
  card: one(userCards, { fields: [userCashback.user_card_id], references: [userCards.id] }),
  category: one(categories, { fields: [userCashback.category_id], references: [categories.id] }),
}));
