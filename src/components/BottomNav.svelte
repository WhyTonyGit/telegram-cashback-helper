<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const tabs = [
    { href: '/', label: 'Платить', icon: 'pay' },
    { href: '/banks', label: 'Карты', icon: 'cards' },
    { href: '/settings', label: 'Настройки', icon: 'settings' },
  ];

  function isActive(href: string): boolean {
    if (href === '/') return $page.url.pathname === '/';
    return $page.url.pathname.startsWith(href);
  }
</script>

<nav class="bottom-nav">
  {#each tabs as tab}
    <button
      class="tab"
      class:active={isActive(tab.href)}
      onclick={() => goto(tab.href)}
      type="button"
    >
      <span class="icon">
        {#if tab.icon === 'pay'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 9h16" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 13h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        {:else if tab.icon === 'cards'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="7" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 11h14" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        {:else if tab.icon === 'settings'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        {/if}
      </span>
      <span class="tab-label">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .bottom-nav {
    display: flex;
    align-items: stretch;
    background: var(--bg-primary);
    border-top: 1px solid var(--border);
    height: var(--nav-height);
    flex-shrink: 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    color: var(--text-secondary);
  }

  .tab.active {
    color: var(--text-primary);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tab-label {
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
  }

  .tab.active .tab-label {
    font-weight: 500;
  }
</style>
