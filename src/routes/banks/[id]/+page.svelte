<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { cards, categories } from '$lib/stores';
  import { showBackButton } from '$lib/tg';
  import { updateCardCashback, deleteUserCard } from '$lib/api';
  import type { UserCard } from '$lib/types';

  const cardId = $derived($page.params.id);

  let card = $state<UserCard | null>(null);
  let saving = $state(false);
  let deleting = $state(false);
  let error = $state<string | null>(null);

  // Local cashback state: category_id -> { active, percent }
  let cashbackState = $state<Record<string, { active: boolean; percent: string }>>({});

  $effect(() => {
    const found = $cards.find(c => c.id === cardId) ?? null;
    card = found;

    if (found) {
      const state: Record<string, { active: boolean; percent: string }> = {};
      for (const cat of $categories) {
        const existing = found.cashback.find(c => c.category_id === cat.id);
        state[cat.id] = {
          active: existing !== undefined && existing.percent > 0,
          percent: existing ? String(existing.percent) : '',
        };
      }
      cashbackState = state;
    }
  });

  let cleanupBack: (() => void) | null = null;

  onMount(() => {
    cleanupBack = showBackButton(() => goto('/banks'));
  });

  onDestroy(() => {
    cleanupBack?.();
  });

  function toggleCategory(catId: string) {
    cashbackState[catId].active = !cashbackState[catId].active;
    if (!cashbackState[catId].active) {
      cashbackState[catId].percent = '';
    }
  }

  async function save() {
    if (!card) return;
    saving = true;
    error = null;

    const cashback = Object.entries(cashbackState)
      .filter(([, v]) => v.active && v.percent !== '')
      .map(([category_id, v]) => ({
        category_id,
        percent: parseFloat(v.percent),
      }))
      .filter(c => c.percent > 0 && c.percent <= 100);

    try {
      await updateCardCashback(card.id, cashback);
      // Update local store
      cards.update(cs =>
        cs.map(c =>
          c.id === card!.id ? { ...c, cashback } : c
        )
      );
      goto('/banks');
    } catch (e) {
      error = e instanceof Error ? e.message : 'Ошибка сохранения';
    } finally {
      saving = false;
    }
  }

  async function removeCard() {
    if (!card) return;
    deleting = true;
    try {
      await deleteUserCard(card.id);
      cards.update(cs => cs.filter(c => c.id !== card!.id));
      goto('/banks');
    } catch (e) {
      error = e instanceof Error ? e.message : 'Ошибка удаления';
      deleting = false;
    }
  }
</script>

<div class="page">
  {#if !card}
    <div class="not-found">Карта не найдена</div>
  {:else}
    <header class="header">
      <h1 class="title">{card.bank.name} / {card.label}</h1>
    </header>

    <div class="categories">
      {#each $categories as cat}
        {@const state = cashbackState[cat.id]}
        {#if state}
          <div class="row" class:inactive={!state.active}>
            <button
              class="toggle"
              class:on={state.active}
              onclick={() => toggleCategory(cat.id)}
              type="button"
              aria-label="Переключить {cat.name}"
            >
              <span class="toggle-knob"></span>
            </button>
            <span class="cat-emoji">{cat.emoji}</span>
            <span class="cat-name">{cat.name}</span>
            {#if state.active}
              <div class="percent-wrap">
                <input
                  class="percent-input"
                  type="number"
                  inputmode="decimal"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="0"
                  bind:value={state.percent}
                />
                <span class="percent-suffix">%</span>
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <div class="actions">
      <button class="save-btn" onclick={save} disabled={saving} type="button">
        {saving ? 'Сохранение...' : 'Сохранить'}
      </button>
      <button class="delete-btn" onclick={removeCard} disabled={deleting} type="button">
        {deleting ? 'Удаление...' : 'Удалить карту'}
      </button>
    </div>
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

  .not-found {
    padding: 48px 16px;
    text-align: center;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 24px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }

  .row.inactive .cat-name {
    color: var(--text-secondary);
  }

  .toggle {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: var(--bg-raised);
    border: 1px solid var(--border);
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    padding: 0;
  }

  .toggle.on {
    background: var(--accent-dim);
    border-color: #7B61FF40;
  }

  .toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--text-secondary);
    transition: none;
  }

  .toggle.on .toggle-knob {
    left: 18px;
    background: var(--accent);
  }

  .cat-emoji {
    font-size: 16px;
    flex-shrink: 0;
  }

  .cat-name {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
  }

  .percent-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 8px;
    width: 72px;
    flex-shrink: 0;
  }

  .percent-input {
    width: 100%;
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
    text-align: right;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  .percent-input::-webkit-outer-spin-button,
  .percent-input::-webkit-inner-spin-button {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
  }

  .percent-suffix {
    font-size: 13px;
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .error {
    font-size: 13px;
    color: #FF6B6B;
    margin-bottom: 16px;
    text-align: center;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .save-btn {
    width: 100%;
    padding: 16px;
    background: var(--accent-dim);
    border: 1px solid #7B61FF40;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    color: var(--accent);
    cursor: pointer;
  }

  .save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .delete-btn {
    width: 100%;
    padding: 14px;
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 400;
    color: var(--text-secondary);
    cursor: pointer;
  }

  .delete-btn:disabled {
    opacity: 0.5;
  }
</style>
