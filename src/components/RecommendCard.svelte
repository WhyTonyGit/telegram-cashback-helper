<script lang="ts">
  import type { CardRecommendation } from '$lib/types';
  import { formatPercent } from '$lib/utils';

  let {
    item,
    rank,
  }: {
    item: CardRecommendation;
    rank: number;
  } = $props();

  const isWinner = $derived(rank === 1 && item.percent !== null);
</script>

{#if isWinner}
  <div class="winner">
    <div class="winner-percent">{formatPercent(item.percent)}</div>
    <div class="winner-bank">{item.bank.name}</div>
    <div class="winner-label">{item.label}</div>
  </div>
{:else}
  <div class="card">
    <div class="logo">{item.bank.logo_url}</div>
    <div class="info">
      <span class="name">{item.bank.name}</span>
      <span class="card-label">{item.label}</span>
    </div>
    <div class="percent">{formatPercent(item.percent)}</div>
  </div>
{/if}

<style>
  .winner {
    background: var(--accent-dim);
    border: 1px solid #7B61FF40;
    border-radius: 16px;
    padding: 20px;
  }

  .winner-percent {
    font-size: 36px;
    font-weight: 300;
    color: var(--positive);
    line-height: 1;
    margin-bottom: 8px;
  }

  .winner-bank {
    font-size: 18px;
    font-weight: 400;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .winner-label {
    font-size: 12px;
    font-weight: 400;
    color: var(--text-secondary);
  }

  .card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
  }

  .logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    background: var(--bg-raised);
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .name {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
  }

  .card-label {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-secondary);
  }

  .percent {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-secondary);
    flex-shrink: 0;
  }
</style>
