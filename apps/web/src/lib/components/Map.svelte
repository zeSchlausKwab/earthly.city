<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Map as LeafletMap, FeatureGroup } from 'leaflet';
	import { features, drawnFeature } from '$lib/stores/appStore';
	import { createFeature } from '$lib/services/api';

	let map: LeafletMap;
	let drawControl;
	let featureGroup: FeatureGroup;

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');
			await import('leaflet/dist/leaflet.css');
			await import('@geoman-io/leaflet-geoman-free');
			await import('@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css');

			map = L.map('map').setView([51.505, -0.09], 13);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);

			featureGroup = L.featureGroup().addTo(map);

			map.pm.addControls({
				position: 'topleft',
				drawCircle: false
			});

			map.on('pm:create', (e) => {
				const layer = e.layer;
				featureGroup.addLayer(layer);
				const geoJSON = layer.toGeoJSON();
				drawnFeature.set({
					type: 'Feature',
					geometry: geoJSON.geometry,
					properties: {}
				});
			});
		}
	});

	$: {
		if (featureGroup && $features) {
			featureGroup.clearLayers();
			$features.forEach((feature) => {
				L.geoJSON(feature.content).addTo(featureGroup);
			});
		}
	}
</script>

<div id="map" class="w-full h-full"></div>

<style>
	@import 'leaflet/dist/leaflet.css';
	@import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
</style>
