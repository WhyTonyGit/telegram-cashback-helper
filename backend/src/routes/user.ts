import { Hono } from 'hono';
import { db } from '../db/index';
import { users, userCards, userCashback, banks, categories } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import type { parseUser } from '../middleware/tgAuth';

type Variables = { user: ReturnType<typeof parseUser> };

const userRouter = new Hono<{ Variables: Variables }>();

// Helper: resolve user_id from telegram_id
async function getUserId(telegram_id: number): Promise<string | null> {
  const rows = await db.select({ id: users.id }).from(users).where(eq(users.telegram_id, telegram_id)).limit(1);
  return rows[0]?.id ?? null;
}

// GET /user/cards
userRouter.get('/cards', async (c) => {
  const { telegram_id } = c.get('user');
  const userId = await getUserId(telegram_id);
  if (!userId) return c.json({ error: 'User not found' }, 404);

  const rows = await db
    .select({
      id: userCards.id,
      label: userCards.label,
      bank: {
        id: banks.id,
        name: banks.name,
        slug: banks.slug,
        logo_url: banks.logo_url,
        color: banks.color,
      },
    })
    .from(userCards)
    .innerJoin(banks, eq(banks.id, userCards.bank_id))
    .where(eq(userCards.user_id, userId));

  // Attach cashback for each card
  const result = await Promise.all(
    rows.map(async (card) => {
      const cashbackRows = await db
        .select({ category_id: userCashback.category_id, percent: userCashback.percent })
        .from(userCashback)
        .where(eq(userCashback.user_card_id, card.id));

      return {
        ...card,
        cashback: cashbackRows.map(r => ({
          category_id: r.category_id,
          percent: parseFloat(r.percent),
        })),
      };
    })
  );

  return c.json(result);
});

// POST /user/cards
userRouter.post('/cards', async (c) => {
  const { telegram_id } = c.get('user');
  const userId = await getUserId(telegram_id);
  if (!userId) return c.json({ error: 'User not found' }, 404);

  const body = await c.req.json<{ bank_id: string; label: string }>();
  if (!body.bank_id || !body.label?.trim()) {
    return c.json({ error: 'bank_id and label are required' }, 400);
  }

  const [newCard] = await db
    .insert(userCards)
    .values({ user_id: userId, bank_id: body.bank_id, label: body.label.trim() })
    .returning();

  const bankRow = await db.select().from(banks).where(eq(banks.id, body.bank_id)).limit(1);
  const bank = bankRow[0];
  if (!bank) return c.json({ error: 'Bank not found' }, 404);

  return c.json({ ...newCard, bank, cashback: [] }, 201);
});

// DELETE /user/cards/:id
userRouter.delete('/cards/:id', async (c) => {
  const { telegram_id } = c.get('user');
  const userId = await getUserId(telegram_id);
  if (!userId) return c.json({ error: 'User not found' }, 404);

  const cardId = c.req.param('id');
  const card = await db.select().from(userCards)
    .where(and(eq(userCards.id, cardId), eq(userCards.user_id, userId)))
    .limit(1);

  if (!card[0]) return c.json({ error: 'Card not found' }, 404);

  await db.delete(userCards).where(eq(userCards.id, cardId));
  return c.json({ ok: true });
});

// PUT /user/cards/:id/label
userRouter.put('/cards/:id/label', async (c) => {
  const { telegram_id } = c.get('user');
  const userId = await getUserId(telegram_id);
  if (!userId) return c.json({ error: 'User not found' }, 404);

  const cardId = c.req.param('id');
  const body = await c.req.json<{ label: string }>();

  const card = await db.select().from(userCards)
    .where(and(eq(userCards.id, cardId), eq(userCards.user_id, userId)))
    .limit(1);
  if (!card[0]) return c.json({ error: 'Card not found' }, 404);

  await db.update(userCards).set({ label: body.label }).where(eq(userCards.id, cardId));
  return c.json({ ok: true });
});

// PUT /user/cards/:id/cashback
userRouter.put('/cards/:id/cashback', async (c) => {
  const { telegram_id } = c.get('user');
  const userId = await getUserId(telegram_id);
  if (!userId) return c.json({ error: 'User not found' }, 404);

  const cardId = c.req.param('id');
  const body = await c.req.json<{ cashback: Array<{ category_id: string; percent: number }> }>();

  const card = await db.select().from(userCards)
    .where(and(eq(userCards.id, cardId), eq(userCards.user_id, userId)))
    .limit(1);
  if (!card[0]) return c.json({ error: 'Card not found' }, 404);

  // Validate percents
  for (const item of body.cashback) {
    if (item.percent <= 0 || item.percent > 100) {
      return c.json({ error: `Invalid percent: ${item.percent}` }, 400);
    }
  }

  // Replace all cashback for this card
  await db.delete(userCashback).where(eq(userCashback.user_card_id, cardId));

  if (body.cashback.length > 0) {
    await db.insert(userCashback).values(
      body.cashback.map(item => ({
        user_card_id: cardId,
        category_id: item.category_id,
        percent: String(item.percent),
      }))
    );
  }

  return c.json({ ok: true });
});

// GET /user/recommend/:category_id
userRouter.get('/recommend/:category_id', async (c) => {
  const { telegram_id } = c.get('user');
  const userId = await getUserId(telegram_id);
  if (!userId) return c.json({ error: 'User not found' }, 404);

  const categoryId = c.req.param('category_id');

  const cat = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
  if (!cat[0]) return c.json({ error: 'Category not found' }, 404);

  const rows = await db
    .select({
      card_id: userCards.id,
      label: userCards.label,
      bank_name: banks.name,
      bank_logo_url: banks.logo_url,
      bank_color: banks.color,
      percent: userCashback.percent,
    })
    .from(userCards)
    .innerJoin(banks, eq(banks.id, userCards.bank_id))
    .leftJoin(
      userCashback,
      and(eq(userCashback.user_card_id, userCards.id), eq(userCashback.category_id, categoryId))
    )
    .where(eq(userCards.user_id, userId));

  const results = rows
    .map((r, i) => ({
      rank: i + 1,
      card_id: r.card_id,
      label: r.label,
      bank: { name: r.bank_name, logo_url: r.bank_logo_url, color: r.bank_color },
      percent: r.percent !== null ? parseFloat(r.percent) : null,
    }))
    .sort((a, b) => (b.percent ?? -1) - (a.percent ?? -1))
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return c.json({ category: cat[0], results });
});

export default userRouter;
