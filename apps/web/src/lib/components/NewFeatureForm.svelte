<script lang="ts">
	import { drawnFeature, features } from '$lib/stores/appStore';
	import { createFeature } from '$lib/services/api';

	let name = '';
	let description = '';
	let color = '#ff0000';

	async function handleSubmit() {
		if ($drawnFeature) {
			const newFeature = {
				kind: 37515,
				pubkey: 'test-pubkey', // This should be the actual user's pubkey
				content: {
					...$drawnFeature,
					properties: {
						name,
						description,
						color
					}
				},
				tags: []
			};

			const createdFeature = await createFeature(newFeature);
			features.update((f) => [...f, createdFeature]);
			drawnFeature.set(null);
			name = '';
			description = '';
			color = '#ff0000';
		}
	}
</script>

{#if $drawnFeature}
	<div class="mb-4 p-2 bg-white rounded shadow">
		<h3 class="font-semibold">New Feature</h3>
		<form on:submit|preventDefault={handleSubmit} class="mt-2 space-y-2">
			<input bind:value={name} placeholder="Name" class="w-full p-2 border rounded" />
			<textarea bind:value={description} placeholder="Description" class="w-full p-2 border rounded"
			></textarea>
			<div class="flex items-center">
				<label for="color" class="mr-2">Color:</label>
				<input id="color" type="color" bind:value={color} class="p-1 border rounded" />
			</div>
			<button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">
				Save Feature
			</button>
		</form>
	</div>
{/if}
