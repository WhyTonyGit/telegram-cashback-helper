<script lang="ts">
  import type { Category } from '$lib/types';

  let {
    category,
    active = false,
    onclick,
  }: {
    category: Category;
    active?: boolean;
    onclick?: () => void;
  } = $props();
</script>

<button
  class="chip"
  class:active
  onclick={onclick}
  type="button"
>
  <span class="emoji">{category.emoji}</span>
  <span class="label">{category.name}</span>
</button>

<style>
  .chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: none;
  }

  .chip.active {
    background: var(--accent-dim);
    border-color: #7B61FF40;
  }

  .emoji {
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
  }

  .label {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1.3;
  }
</style>
