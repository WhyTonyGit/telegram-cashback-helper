<script lang="ts">
  import { cards, isLoading } from '$lib/stores';
  import BankCard from '$components/BankCard.svelte';
  import EmptyState from '$components/EmptyState.svelte';
  import Skeleton from '$components/Skeleton.svelte';
  import { goto } from '$app/navigation';
</script>

<div class="page">
  <header class="header">
    <h1 class="title">Карты</h1>
  </header>

  {#if $isLoading}
    <div class="list">
      {#each Array(3) as _}
        <Skeleton height="64px" radius="12px" />
      {/each}
    </div>
  {:else if $cards.length === 0}
    <EmptyState
      icon="💳"
      text="Здесь будут твои карты"
      actionLabel="Добавить первую карту"
      onaction={() => goto('/banks/add')}
    />
  {:else}
    <div class="list">
      {#each $cards as card}
        <BankCard {card} onclick={() => goto(`/banks/${card.id}`)} />
      {/each}

      <button class="add-btn" onclick={() => goto('/banks/add')} type="button">
        Добавить карту
      </button>
    </div>
  {/if}
</div>

<style>
  .page {
    padding: 0 16px 16px;
  }

  .header {
    padding: 24px 0 16px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-secondary);
    cursor: pointer;
    width: 100%;
    margin-top: 8px;
  }
</style>
