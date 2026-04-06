<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { cards } from '$lib/stores';
  import { getBanks, addUserCard } from '$lib/api';
  import { showBackButton } from '$lib/tg';
  import type { Bank } from '$lib/types';
  import Skeleton from '$components/Skeleton.svelte';

  let banks = $state<Bank[]>([]);
  let query = $state('');
  let loading = $state(true);
  let selectedBank = $state<Bank | null>(null);
  let label = $state('');
  let adding = $state(false);
  let error = $state<string | null>(null);

  const filtered = $derived(
    query.trim()
      ? banks.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
      : banks
  );

  let cleanupBack: (() => void) | null = null;

  onMount(async () => {
    cleanupBack = showBackButton(() => {
      if (selectedBank) {
        selectedBank = null;
      } else {
        goto('/banks');
      }
    });

    try {
      banks = await getBanks();
    } finally {
      loading = false;
    }
  });

  onDestroy(() => cleanupBack?.());

  async function confirmAdd() {
    if (!selectedBank || !label.trim()) return;
    adding = true;
    error = null;
    try {
      const newCard = await addUserCard(selectedBank.id, label.trim());
      cards.update(cs => [...cs, newCard]);
      goto(`/banks/${newCard.id}`);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Ошибка добавления';
      adding = false;
    }
  }
</script>

<div class="page">
  <header class="header">
    <h1 class="title">
      {#if selectedBank}
        {selectedBank.name}
      {:else}
        Добавить карту
      {/if}
    </h1>
  </header>

  {#if selectedBank}
    <div class="add-form">
      <p class="form-label">Название карты</p>
      <input
        class="text-input"
        type="text"
        placeholder="Например: Black, Cash Back..."
        bind:value={label}
        maxlength="32"
      />
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <button
        class="confirm-btn"
        onclick={confirmAdd}
        disabled={adding || !label.trim()}
        type="button"
      >
        {adding ? 'Добавление...' : 'Добавить'}
      </button>
    </div>
  {:else}
    <div class="search-wrap">
      <input
        class="search-input"
        type="search"
        placeholder="Поиск банка..."
        bind:value={query}
      />
    </div>

    {#if loading}
      <div class="list">
        {#each Array(5) as _}
          <Skeleton height="56px" radius="12px" />
        {/each}
      </div>
    {:else}
      <div class="list">
        {#each filtered as bank}
          <button
            class="bank-row"
            onclick={() => { selectedBank = bank; label = ''; }}
            type="button"
          >
            <span class="logo">{bank.logo_url}</span>
            <span class="bank-name">{bank.name}</span>
          </button>
        {/each}
        {#if filtered.length === 0}
          <p class="no-results">Ничего не найдено</p>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .page {
    padding: 0 16px 24px;
  }

  .header {
    padding: 24px 0 16px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .search-wrap {
    margin-bottom: 16px;
  }

  .search-input {
    width: 100%;
    padding: 12px 14px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
  }

  .search-input::placeholder {
    color: var(--text-secondary);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bank-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    width: 100%;
  }

  .logo {
    font-size: 24px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-raised);
    border-radius: 8px;
    flex-shrink: 0;
  }

  .bank-name {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
  }

  .no-results {
    font-size: 14px;
    color: var(--text-secondary);
    text-align: center;
    padding: 32px 0;
  }

  .add-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-label {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .text-input {
    width: 100%;
    padding: 14px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
  }

  .text-input::placeholder {
    color: var(--text-secondary);
  }

  .text-input:focus {
    border-color: var(--accent);
  }

  .error {
    font-size: 13px;
    color: #FF6B6B;
    text-align: center;
  }

  .confirm-btn {
    width: 100%;
    padding: 16px;
    background: var(--accent-dim);
    border: 1px solid #7B61FF40;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    color: var(--accent);
    cursor: pointer;
    margin-top: 8px;
  }

  .confirm-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
