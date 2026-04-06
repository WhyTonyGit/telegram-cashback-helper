<script lang="ts" module>
  function pluralCategories(n: number): string {
    if (n % 10 === 1 && n % 100 !== 11) return 'категория';
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'категории';
    return 'категорий';
  }
</script>

<script lang="ts">
  import type { UserCard } from '$lib/types';
  import { activeCategoriesCount } from '$lib/utils';

  let {
    card,
    onclick,
  }: {
    card: UserCard;
    onclick?: () => void;
  } = $props();

  const activeCount = $derived(activeCategoriesCount(card.cashback));
</script>

<button class="bank-card" {onclick} type="button">
  <div class="logo">{card.bank.logo_url}</div>
  <div class="info">
    <span class="bank-name">{card.bank.name}</span>
    <span class="card-label">{card.label}</span>
  </div>
  <div class="meta">
    <span class="active-count">{activeCount} {pluralCategories(activeCount)}</span>
  </div>
</button>

<style>
  .bank-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    height: 64px;
    width: 100%;
    cursor: pointer;
    text-align: left;
  }

  .logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--bg-raised);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .bank-name {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
  }

  .card-label {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-secondary);
  }

  .active-count {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-secondary);
    white-space: nowrap;
  }
</style>
