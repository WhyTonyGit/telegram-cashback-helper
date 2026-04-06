<script lang="ts">
  let reminderEnabled = $state(true);
</script>

<div class="page">
  <header class="header">
    <h1 class="title">Настройки</h1>
  </header>

  <section class="section">
    <div class="row">
      <div class="row-info">
        <span class="row-label">Напоминание об обновлении</span>
        <span class="row-desc">Каждый месяц напомним проверить кэшбэк</span>
      </div>
      <button
        class="toggle"
        class:on={reminderEnabled}
        onclick={() => { reminderEnabled = !reminderEnabled; }}
        type="button"
        aria-label="Напоминание"
      >
        <span class="knob"></span>
      </button>
    </div>
  </section>

  <section class="section coming-soon-section">
    <p class="section-title">Скоро</p>
    <div class="coming-soon-list">
      <div class="soon-item">
        <span class="soon-emoji">📊</span>
        <span class="soon-text">Статистика кэшбэка</span>
        <span class="badge">Скоро</span>
      </div>
      <div class="soon-item">
        <span class="soon-emoji">🔄</span>
        <span class="soon-text">Автозаполнение категорий</span>
        <span class="badge">Скоро</span>
      </div>
      <div class="soon-item">
        <span class="soon-emoji">📤</span>
        <span class="soon-text">Поделиться рекомендацией</span>
        <span class="badge">Скоро</span>
      </div>
    </div>
  </section>
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

  .section {
    margin-bottom: 24px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .row-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .row-label {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
  }

  .row-desc {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-secondary);
  }

  .toggle {
    width: 44px;
    height: 24px;
    border-radius: 12px;
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

  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--text-secondary);
  }

  .toggle.on .knob {
    left: 23px;
    background: var(--accent);
  }

  .section-title {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  .coming-soon-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .soon-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .soon-emoji {
    font-size: 18px;
    flex-shrink: 0;
  }

  .soon-text {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-secondary);
  }

  .badge {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-muted);
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 3px 8px;
  }
</style>
