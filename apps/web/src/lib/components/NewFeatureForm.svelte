<script lang="ts">
	import { drawnFeature, features } from '$lib/stores/appStore'
	import { createFeature } from '$lib/services/api'
	import { randomColor } from '@earthly-land/common'

	let name = ''
	let description = ''
	let color = '#ff0000'

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
			}

			const createdFeature = await createFeature(newFeature)
			features.update((f) => [...f, createdFeature])
			drawnFeature.set(null)
			name = ''
			description = ''
			color = randomColor()
		}
	}
</script>

{#if $drawnFeature}
	<div class="mb-4 rounded bg-white p-2 shadow">
		<h3 class="font-semibold">New Feature</h3>
		<form on:submit|preventDefault={handleSubmit} class="mt-2 space-y-2">
			<input bind:value={name} placeholder="Name" class="w-full rounded border p-2" />
			<textarea bind:value={description} placeholder="Description" class="w-full rounded border p-2"></textarea>
			<div class="flex items-center">
				<label for="color" class="mr-2">Color:</label>
				<input id="color" type="color" bind:value={color} class="rounded border p-1" />
			</div>
			<button type="submit" class="w-full rounded bg-blue-500 p-2 text-white"> Save Feature </button>
		</form>
	</div>
{/if}
