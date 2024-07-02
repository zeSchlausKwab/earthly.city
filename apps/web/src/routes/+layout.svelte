<script lang="ts">
	import '../app.postcss';
	import DiscoverySidebar from '$lib/components/DiscoverySidebar.svelte';
	import FocusedSidebar from '$lib/components/FocusedSidebar.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="flex flex-col h-screen">
	<Header />

	<div class="flex flex-1 overflow-hidden">
		<aside class="w-1/4 bg-gray-100 p-4 overflow-y-auto">
			<h2 class="text-xl font-semibold mb-4">Discovery</h2>
			<DiscoverySidebar />
		</aside>

		<main class="flex-1 p-4 overflow-y-auto">
			<slot />
		</main>

		<aside class="w-1/4 bg-gray-100 p-4 overflow-y-auto">
			<h2 class="text-xl font-semibold mb-4">Focused Collections</h2>
			<FocusedSidebar />
		</aside>
	</div>
</div>
