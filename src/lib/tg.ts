import { browser } from '$app/environment';

let _initialized = false;

export function initTelegram(): { initDataRaw: string | null; user: unknown } {
  if (!browser) return { initDataRaw: null, user: null };
  if (_initialized) return { initDataRaw: null, user: null };

  try {
    // Dynamic import to avoid SSR issues
    const tg = (window as unknown as { Telegram?: { WebApp?: { initData?: string; initDataUnsafe?: { user?: unknown } } } }).Telegram?.WebApp;
    if (!tg?.initData) {
      console.warn('[TG] Not running inside Telegram, using mock mode');
      return { initDataRaw: null, user: null };
    }
    _initialized = true;
    return { initDataRaw: tg.initData, user: tg.initDataUnsafe?.user ?? null };
  } catch (e) {
    console.warn('[TG] SDK init failed:', e);
    return { initDataRaw: null, user: null };
  }
}

export function showBackButton(onClick: () => void): () => void {
  if (!browser) return () => {};
  const tg = (window as unknown as { Telegram?: { WebApp?: { BackButton?: { show: () => void; hide: () => void; onClick: (fn: () => void) => void; offClick: (fn: () => void) => void } } } }).Telegram?.WebApp;
  if (!tg?.BackButton) return () => {};
  tg.BackButton.show();
  tg.BackButton.onClick(onClick);
  return () => {
    tg.BackButton?.offClick(onClick);
    tg.BackButton?.hide();
  };
}

export function showMainButton(text: string, onClick: () => void): () => void {
  if (!browser) return () => {};
  const tg = (window as unknown as { Telegram?: { WebApp?: { MainButton?: { text: string; show: () => void; hide: () => void; onClick: (fn: () => void) => void; offClick: (fn: () => void) => void } } } }).Telegram?.WebApp;
  if (!tg?.MainButton) return () => {};
  tg.MainButton.text = text;
  tg.MainButton.show();
  tg.MainButton.onClick(onClick);
  return () => {
    tg.MainButton?.offClick(onClick);
    tg.MainButton?.hide();
  };
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (!browser) return;
  try {
    const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { impactOccurred: (s: string) => void } } } }).Telegram?.WebApp;
    tg?.HapticFeedback?.impactOccurred(style);
  } catch {}
}
