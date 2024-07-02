<script lang="ts">
	import { browser } from '$app/environment';
	import { createFeature, getFeatures } from '$lib/services/api';
	import type { Map as LeafletMap } from 'leaflet';
	import { onMount } from 'svelte';

	let map: LeafletMap | undefined;
	let features: any[] = [];
	let newFeature = {
		kind: 37515,
		pubkey: '',
		content: {},
		tags: [] as any[]
	};

	let L: typeof import('leaflet');

	onMount(async () => {
		if (browser) {
			L = await import('leaflet');
			await import('leaflet/dist/leaflet.css');

			map = L.map('map').setView([51.505, -0.09], 13);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);

			features = await getFeatures();
		}
	});

	async function handleSubmit() {
		const created = await createFeature(newFeature);
		features = [...features, created];
		newFeature = {
			kind: 37515,
			pubkey: '',
			content: {},
			tags: []
		};
	}
</script>

<svelte:head>
	<title>Earthly Land</title>
</svelte:head>

<main class="p-4">
	<h1 class="text-3xl font-bold text-center my-4">Welcome to Earthly Land</h1>
	<div id="map" class="w-full h-[400px] mb-4"></div>

	<h2 class="text-2xl font-bold mb-2">Features</h2>
	<ul class="mb-4">
		{#each features as feature}
			<li>{JSON.stringify(feature)}</li>
		{/each}
	</ul>

	<h2 class="text-2xl font-bold mb-2">Add New Feature</h2>
	<form on:submit|preventDefault={handleSubmit} class="space-y-2">
		<input bind:value={newFeature.pubkey} placeholder="Pubkey" class="w-full p-2 border rounded" />
		<textarea
			bind:value={newFeature.content}
			placeholder="Content (JSON)"
			class="w-full p-2 border rounded"
		></textarea>
		<button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Add Feature</button>
	</form>
</main>

<style>
	@import 'leaflet/dist/leaflet.css';
</style>
