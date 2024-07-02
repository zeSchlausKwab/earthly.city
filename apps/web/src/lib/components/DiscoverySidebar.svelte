<script lang="ts">
	import { discoveryItems, features } from '$lib/stores/appStore'
	import { onMount } from 'svelte'
	import { getFeatures } from '$lib/services/api'

	onMount(async () => {
		const fetchedFeatures = await getFeatures()
		features.set(fetchedFeatures)
		discoveryItems.set(
			fetchedFeatures.map((f) => ({
				id: f.id,
				title: `Feature ${f.id}`,
				description: `Kind: ${f.kind}, Pubkey: ${f.pubkey}`
			}))
		)
	})
</script>

<div>
	{#each $discoveryItems as item}
		<div class="mb-2 rounded bg-white p-2 shadow">
			<h3 class="font-semibold">{item.title}</h3>
			<p>{item.description}</p>
		</div>
	{/each}
</div>
