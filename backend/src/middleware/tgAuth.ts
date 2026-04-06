import { createHmac } from 'crypto';
import type { Context, Next } from 'hono';

export function validateInitData(initData: string, botToken: string): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const expectedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return expectedHash === hash;
}

export function parseUser(initData: string): { telegram_id: number; username?: string; first_name?: string } {
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');
  if (!userStr) throw new Error('No user in initData');
  const user = JSON.parse(decodeURIComponent(userStr));
  return { telegram_id: user.id, username: user.username, first_name: user.first_name };
}

type Variables = { user: ReturnType<typeof parseUser> };

export function tgAuthMiddleware(botToken: string) {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    const initData = authHeader?.replace('TgInitData ', '');

    if (!initData || !validateInitData(initData, botToken)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
      c.set('user', parseUser(initData));
    } catch {
      return c.json({ error: 'Invalid user data' }, 401);
    }

    await next();
  };
}
