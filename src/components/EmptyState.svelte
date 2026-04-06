<script lang="ts">
  let {
    icon = '📭',
    text,
    actionLabel,
    onaction,
  }: {
    icon?: string;
    text: string;
    actionLabel?: string;
    onaction?: () => void;
  } = $props();
</script>

<div class="empty">
  <span class="icon">{icon}</span>
  <p class="text">{text}</p>
  {#if actionLabel && onaction}
    <button class="action" onclick={onaction} type="button">{actionLabel}</button>
  {/if}
</div>

<style>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px 24px;
    text-align: center;
  }

  .icon {
    font-size: 24px;
    color: var(--text-muted);
  }

  .text {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-secondary);
    max-width: 240px;
    line-height: 1.5;
  }

  .action {
    margin-top: 4px;
    padding: 10px 20px;
    background: var(--accent-dim);
    border: 1px solid #7B61FF40;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    color: var(--accent);
    cursor: pointer;
  }
</style>
