import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bot } from 'grammy';
import { tgAuthMiddleware, parseUser } from './middleware/tgAuth';
import authRouter from './routes/auth';
import banksRouter from './routes/banks';
import categoriesRouter from './routes/categories';
import userRouter from './routes/user';

const app = new Hono();
const PORT = parseInt(process.env.PORT ?? '3001');
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'];
const BOT_TOKEN = process.env.BOT_TOKEN!;

// CORS
app.use('*', cors({
  origin: ALLOWED_ORIGINS,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Rate limiting (in-memory, per telegram_id)
const rateLimitMap = new Map<number, { count: number; reset: number }>();

app.use('/user/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const initData = authHeader?.replace('TgInitData ', '');
  if (!initData) return c.json({ error: 'Unauthorized' }, 401);

  let telegram_id: number;
  try {
    telegram_id = parseUser(initData).telegram_id;
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const now = Date.now();
  const entry = rateLimitMap.get(telegram_id);
  if (entry && now < entry.reset) {
    if (entry.count >= 60) {
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }
    entry.count++;
  } else {
    rateLimitMap.set(telegram_id, { count: 1, reset: now + 60_000 });
  }

  await next();
});

// Auth middleware for /user/*
app.use('/user/*', tgAuthMiddleware(BOT_TOKEN));

// Routes
app.route('/auth', authRouter);
app.route('/banks', banksRouter);
app.route('/categories', categoriesRouter);
app.route('/user', userRouter);

// Health check
app.get('/health', (c) => c.json({ ok: true }));

// --- Monthly reminder bot job ---
export async function sendMonthlyReminders() {
  if (!BOT_TOKEN || !process.env.MINI_APP_URL) return;

  const bot = new Bot(BOT_TOKEN);
  const { db } = await import('./db/index');
  const { users } = await import('./db/schema');

  const allUsers = await db.select().from(users);
  for (const user of allUsers) {
    try {
      await bot.api.sendMessage(
        user.telegram_id,
        '🔄 Начался новый месяц — возможно, категории кэшбэка изменились.\n\nПроверь и обнови их в приложении.',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Обновить категории', web_app: { url: process.env.MINI_APP_URL! } }
            ]]
          }
        }
      );
      await Bun.sleep(100);
    } catch (e) {
      console.error(`Failed to send reminder to ${user.telegram_id}:`, e);
    }
  }
}

// Cron: 0 10 1 * * (1st of each month at 10:00)
const now = new Date();
function scheduleMonthlyCron() {
  const nextRun = new Date(now.getFullYear(), now.getMonth() + 1, 1, 10, 0, 0);
  const delay = nextRun.getTime() - Date.now();
  setTimeout(async () => {
    await sendMonthlyReminders();
    scheduleMonthlyCron();
  }, delay);
}
scheduleMonthlyCron();

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`Backend running on port ${PORT}`);
