import { Hono } from 'hono';
import { db } from '../db/index';
import { users } from '../db/schema';
import { parseUser } from '../middleware/tgAuth';
import { eq } from 'drizzle-orm';

const auth = new Hono();

auth.post('/init', async (c) => {
  const authHeader = c.req.header('Authorization');
  const initData = authHeader?.replace('TgInitData ', '');
  if (!initData) return c.json({ error: 'Unauthorized' }, 401);

  let tgUser: ReturnType<typeof parseUser>;
  try {
    tgUser = parseUser(initData);
  } catch {
    return c.json({ error: 'Invalid initData' }, 400);
  }

  const existing = await db.select().from(users).where(eq(users.telegram_id, tgUser.telegram_id)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({ telegram_id: tgUser.telegram_id });
  }

  return c.json({ ok: true });
});

export default auth;
