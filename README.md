# Cashback — Telegram Mini App

Показывает, какая карта даёт лучший кэшбэк в выбранной категории.

## Стек

- **Frontend:** SvelteKit 2 + Svelte 5, CSS Variables, Bun + Vite
- **Backend:** Bun + Hono, Drizzle ORM
- **БД:** PostgreSQL (Supabase)
- **Бот:** grammy

---

## Деплой на сервере (Docker)

Поднимает три контейнера: nginx (фронт + прокси), бэкенд, PostgreSQL.

### Шаг 1 — Получить переменные окружения

#### `BOT_TOKEN`
1. Открыть [@BotFather](https://t.me/BotFather) в Telegram
2. Отправить `/newbot`, задать имя и username бота
3. Скопировать токен вида `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`

#### `MINI_APP_URL`
Публичный HTTPS-адрес VM, по которому Telegram будет открывать приложение.
Telegram Mini App работает **только через HTTPS**.

Самый простой вариант — Caddy (автоматически выпускает SSL):
```bash
# установить Caddy на VM
apt install -y caddy

# /etc/caddy/Caddyfile
cashback.example.com {
    reverse_proxy localhost:80
}
```
Тогда `MINI_APP_URL=https://cashback.example.com`

#### `POSTGRES_PASSWORD`
Придумать самому, минимум 16 символов: `s0meStr0ngP4ssw0rd`

> `DATABASE_URL` задавать не нужно — Docker Compose строит его автоматически.

---

### Шаг 2 — Запустить

```bash
git clone <repo-url> && cd telegram-cashback-helper

cp .env.docker.example .env
nano .env  # вставить свои значения

docker compose up -d --build
```

Бэкенд при старте автоматически применяет миграции БД.

### Шаг 3 — Подключить Mini App к боту
1. [@BotFather](https://t.me/BotFather) → `/newapp` (или `/mybots` → выбрать бота → `Bot Settings` → `Menu Button`)
2. Указать URL: значение `MINI_APP_URL` из `.env`

---

## Быстрый старт (mock-режим)

Работает без бэкенда и БД — данные берутся из `src/lib/mock.ts`.

```bash
# 1. Установить зависимости
bun install

# 2. Создать .env
cp .env.example .env
# VITE_USE_MOCK=true уже выставлен

# 3. Запустить dev-сервер
bun run dev
```

Откроется на `http://localhost:5173`.

---

## Запуск с бэкендом

### 1. Настроить переменные окружения

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001
VITE_USE_MOCK=false
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://...
BOT_TOKEN=123456:ABC-DEF...
MINI_APP_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
PORT=3001
```

### 2. Применить схему БД

```bash
cd backend
bun install
bun run db:push
```

### 3. Запустить бэкенд

```bash
cd backend
bun run dev
```

### 4. Запустить фронтенд

```bash
# в корне проекта
bun run dev
```

---

## Сборка для продакшна

```bash
bun run build
# результат в папке build/
```

---

## Структура проекта

```
src/
  lib/
    api.ts          — fetch-запросы к бэкенду (+ mock-режим)
    tg.ts           — обёртка над window.Telegram.WebApp
    stores.ts       — Svelte stores (cards, categories, recommendations)
    mock.ts         — моковые данные для локальной разработки
    types.ts        — TypeScript типы
    utils.ts        — вспомогательные функции
  components/       — переиспользуемые компоненты
  routes/
    +page.svelte          — / (Чем платить?)
    banks/+page.svelte    — /banks (список карт)
    banks/[id]/           — /banks/:id (редактирование карты)
    banks/add/            — /banks/add (добавление карты)
    settings/             — /settings

backend/
  src/
    index.ts              — Hono-сервер, CORS, rate limit
    middleware/tgAuth.ts  — HMAC-валидация Telegram initData
    routes/               — auth, banks, categories, user
    db/schema.ts          — Drizzle-схема
```

---

## Переменные окружения

| Переменная | Описание |
|---|---|
| `VITE_API_URL` | URL бэкенда (по умолчанию `http://localhost:3001`) |
| `VITE_USE_MOCK` | `true` — использовать моковые данные, без бэкенда |
| `DATABASE_URL` | PostgreSQL connection string |
| `BOT_TOKEN` | Токен Telegram-бота |
| `MINI_APP_URL` | Публичный URL Mini App (для кнопки в боте) |
| `ALLOWED_ORIGINS` | Разрешённые CORS-домены (через запятую) |
