<script lang="ts">
	import { focusedCollections, editingFeature } from '$lib/stores/appStore';
	import NewFeatureForm from './NewFeatureForm.svelte';

	function handleSave() {
		// Implement save logic here
		console.log('Saving feature:', $editingFeature);
		editingFeature.set(null);
	}
</script>

<div>
	<NewFeatureForm />

	{#if $editingFeature}
		<div class="mb-4 p-2 bg-white rounded shadow">
			<h3 class="font-semibold">Editing Feature</h3>
			<textarea bind:value={$editingFeature.content} class="w-full p-2 border rounded mt-2"
			></textarea>
			<button on:click={handleSave} class="mt-2 p-2 bg-blue-500 text-white rounded"> Save </button>
		</div>
	{/if}

	{#each $focusedCollections as collection}
		<div class="mb-2 p-2 bg-white rounded shadow">
			<h3 class="font-semibold">{collection.title}</h3>
			<p>{collection.description}</p>
		</div>
	{/each}
</div>
