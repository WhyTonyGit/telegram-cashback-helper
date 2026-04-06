<script lang="ts">
  import { cards, categories, selectedCategory, recommendations, isLoading } from '$lib/stores';
  import CategoryChip from '$components/CategoryChip.svelte';
  import RecommendCard from '$components/RecommendCard.svelte';
  import EmptyState from '$components/EmptyState.svelte';
  import Skeleton from '$components/Skeleton.svelte';
  import { goto } from '$app/navigation';
  import { hapticImpact } from '$lib/tg';

  function selectCategory(id: string) {
    hapticImpact('light');
    selectedCategory.set($selectedCategory === id ? null : id);
  }

  const hasAnyPercent = $derived($recommendations.some(r => r.percent !== null));
</script>

<div class="page">
  <header class="header">
    <h1 class="title">Чем платить?</h1>
  </header>

  {#if $isLoading}
    <div class="section">
      <div class="chip-grid">
        {#each Array(6) as _}
          <Skeleton height="48px" radius="10px" />
        {/each}
      </div>
    </div>
  {:else if $cards.length === 0}
    <EmptyState
      icon="💳"
      text="Добавь карту, чтобы получать рекомендации"
      actionLabel="Добавить карту"
      onaction={() => goto('/banks/add')}
    />
  {:else}
    <section class="section">
      <div class="chip-grid">
        {#each $categories as cat}
          <CategoryChip
            category={cat}
            active={$selectedCategory === cat.id}
            onclick={() => selectCategory(cat.id)}
          />
        {/each}
      </div>
    </section>

    {#if $selectedCategory === null}
      <div class="hint">
        <span>Выбери категорию</span>
      </div>
    {:else if $recommendations.length === 0}
      <EmptyState text="Нет карт с кэшбэком в этой категории" />
    {:else if !hasAnyPercent}
      <div class="no-cashback">
        <span>Ни одна карта не даёт кэшбэк в этой категории</span>
      </div>
    {:else}
      <section class="section results">
        {#each $recommendations as item, i}
          <RecommendCard {item} rank={i + 1} />
        {/each}
      </section>
    {/if}
  {/if}
</div>

<style>
  .page {
    padding: 0 16px;
    padding-bottom: 16px;
  }

  .header {
    padding: 24px 0 16px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .section {
    margin-bottom: 24px;
  }

  .chip-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .hint {
    padding: 32px 0;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-secondary);
  }

  .no-cashback {
    padding: 32px 16px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-secondary);
  }

  .results {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
