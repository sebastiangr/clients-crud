<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
	// let { children } = $props();
</script>

<!-- {@render children()} -->

<Header name="SvelteKit" />
<div class="container mx-auto p-4 mt-24 pb-24">
  <slot />
</div>

<Footer />