<script lang="ts">
  let {
    width = '100%',
    height = '64px',
    radius = '12px',
  }: {
    width?: string;
    height?: string;
    radius?: string;
  } = $props();
</script>

<div class="skeleton" style="width: {width}; height: {height}; border-radius: {radius};"></div>

<style>
  .skeleton {
    background: var(--bg-raised);
    flex-shrink: 0;
  }
</style>
