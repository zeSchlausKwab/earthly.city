// components/Map.tsx
'use client'

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { Feature, FeatureCollection } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { featureDiscoveryStore } from '../../lib/store/feature-discovery';
import GeomanControls from './GeomanControls';
import DiscoveredFeatures from './DiscoveredFeatures';

import { addFeatureAtom, editStateAtom, removeFeatureAtom, updateFeatureAtom } from '@/lib/store/edit';
import { useAtom } from 'jotai';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { ndkStore } from '@/lib/store/ndk';
import MapController from './MapController';

// Set up default icon
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
});

const Map = () => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [features, setFeatures] = useState<FeatureCollection[]>([]);
    const [mapReady, setMapReady] = useState(false);
    const [, addFeature] = useAtom(addFeatureAtom);
    const [, updateFeature] = useAtom(updateFeatureAtom);
    const [, removeFeature] = useAtom(removeFeatureAtom);
    const [editState] = useAtom(editStateAtom);

    useEffect(() => {
        if (typeof window !== 'undefined' && !mapRef.current && mapContainerRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);

            const store = featureDiscoveryStore.getStore();

            const listenerId = store.addTableListener('features', () => {
                const allFeatures = featureDiscoveryStore.getAllFeatures();
                console.log("allFeatures", allFeatures);
                setFeatures(allFeatures);
            });

            setMapReady(true);
            featureDiscoveryStore.subscribeToFeatures();

            return () => {
                store.delListener(listenerId);
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }
    }, []);

    const handleEditFeature = (feature: Feature) => {
        const ndk = ndkStore.getNDK();
        if (feature.properties?.pubkey === ndk.activeUser?.pubkey) {
            addFeature(feature);
        } else {
            const clonedFeature: Feature = {
                ...feature,
                properties: {
                    ...feature.properties,
                    id: undefined,
                    pubkey: ndk.activeUser?.pubkey,
                }
            };
            addFeature(clonedFeature);
        }
    };

    useEffect(() => {
        if (mapReady && mapRef.current) {
            mapRef.current.on('pm:create', (e) => {
                const layer = e.layer;
                const geojson = layer.toGeoJSON() as Feature;
                addFeature(geojson);
            });

            mapRef.current.on('pm:edit', (e) => {
                const layer = e.layer;
                const geojson = layer.toGeoJSON() as Feature;
                updateFeature(geojson);
            });

            mapRef.current.on('pm:remove', (e) => {
                const layer = e.layer;
                const featureId = (layer.feature as Feature).properties?.id;
                if (featureId) {
                    removeFeature(featureId);
                }
            });
        }
    }, [mapReady, addFeature, updateFeature, removeFeature]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.GeoJSON) {
                    mapRef.current?.removeLayer(layer);
                }
            });

            L.geoJSON([...features, editState.featureCollection], {
                style: (feature) => {
                    return {
                        color: feature?.properties?.color || '#3388ff',
                    };
                },
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(() => {
                        const popupContent = document.createElement('div');
                        popupContent.innerHTML = `
                            <h3>${feature.properties?.name || 'Unnamed Feature'}</h3>
                            <p>${feature.properties?.description || 'No description'}</p>
                        `;
                        const editButton = document.createElement('button');
                        editButton.innerText = 'Edit';
                        editButton.onclick = () => handleEditFeature(feature);
                        popupContent.appendChild(editButton);
                        return popupContent;
                    });
                }
            }).addTo(mapRef.current);
        }
    }, [features, editState]);

    return (
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}>
            {mapReady && mapRef.current && (
                <>
                    <GeomanControls map={mapRef.current} />
                    <DiscoveredFeatures map={mapRef.current} features={features} />
                    <MapController map={mapRef.current} />
                </>
            )}
        </div>
    );
};

export default Map;