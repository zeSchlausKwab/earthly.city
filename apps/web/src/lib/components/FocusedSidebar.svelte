<script lang="ts">
	import { focusedCollections, editingFeature } from '$lib/stores/appStore'
	import NewFeatureForm from './NewFeatureForm.svelte'

	function handleSave() {
		// Implement save logic here
		console.log('Saving feature:', $editingFeature)
		editingFeature.set(null)
	}
</script>

<div>
	<NewFeatureForm />

	{#if $editingFeature}
		<div class="mb-4 rounded bg-white p-2 shadow">
			<h3 class="font-semibold">Editing Feature</h3>
			<textarea bind:value={$editingFeature.content} class="mt-2 w-full rounded border p-2"></textarea>
			<button on:click={handleSave} class="mt-2 rounded bg-blue-500 p-2 text-white"> Save </button>
		</div>
	{/if}

	{#each $focusedCollections as collection}
		<div class="mb-2 rounded bg-white p-2 shadow">
			<h3 class="font-semibold">{collection.title}</h3>
			<p>{collection.description}</p>
		</div>
	{/each}
</div>
