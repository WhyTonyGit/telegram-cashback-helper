<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import BottomNav from '$components/BottomNav.svelte';
  import { cards, categories, isLoading, initDataRaw as initDataRawStore } from '$lib/stores';
  import { initTelegram } from '$lib/tg';
  import { setAuthToken, authInit, getUserCards, getCategories } from '$lib/api';

  let { children } = $props();

  onMount(async () => {
    const { initDataRaw, user: _user } = initTelegram();

    if (initDataRaw) {
      initDataRawStore.set(initDataRaw);
      setAuthToken(initDataRaw);
      await authInit().catch(console.warn);
    }

    try {
      const [cardsData, catsData] = await Promise.all([
        getUserCards(),
        getCategories(),
      ]);
      cards.set(cardsData);
      categories.set(catsData);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      isLoading.set(false);
    }
  });
</script>

<div class="app">
  <div class="content">
    {@render children()}
  </div>
  <BottomNav />
</div>

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
</style>
