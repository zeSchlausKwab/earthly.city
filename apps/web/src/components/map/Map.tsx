'use client'

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { FeatureCollection } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { featureDiscoveryStore } from '../../lib/store/feature-discovery';
import GeomanControls from './GeomanControls';

// Import default marker icon images
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Set up default icon
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
});

const Map = () => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<FeatureCollection[]>([]);
    const [, forceUpdate] = useState({});

    useEffect(() => {
        if (typeof window !== 'undefined' && !mapRef.current && mapContainerRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);
            const store = featureDiscoveryStore.getStore();
            const listenerId = store.addTableListener('features', () => {
                featuresRef.current = featureDiscoveryStore.getAllFeatures();
                forceUpdate({});
            });

            return () => {
                store.delListener(listenerId);
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.GeoJSON) {
                    mapRef.current?.removeLayer(layer);
                }
            });

            featuresRef.current.forEach((featureCollection) => {
                L.geoJSON(featureCollection).addTo(mapRef.current!);
            });
        }
    }, [featuresRef.current]);

    return (
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}>
            {mapRef.current && <GeomanControls map={mapRef.current} />}
        </div>
    );
};

export default Map;