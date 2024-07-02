<script lang="ts">
	import '../app.postcss'
	import DiscoverySidebar from '$lib/components/DiscoverySidebar.svelte'
	import FocusedSidebar from '$lib/components/FocusedSidebar.svelte'
	import Header from '$lib/components/Header.svelte'
</script>

<div class="flex h-screen flex-col">
	<Header />

	<div class="flex flex-1 overflow-hidden">
		<aside class="w-1/4 overflow-y-auto bg-gray-100 p-4">
			<h2 class="mb-4 text-xl font-semibold">Discovery</h2>
			<DiscoverySidebar />
		</aside>

		<main class="flex-1 overflow-y-auto p-4">
			<slot />
		</main>

		<aside class="w-1/4 overflow-y-auto bg-gray-100 p-4">
			<h2 class="mb-4 text-xl font-semibold">Focused Collections</h2>
			<FocusedSidebar />
		</aside>
	</div>
</div>
