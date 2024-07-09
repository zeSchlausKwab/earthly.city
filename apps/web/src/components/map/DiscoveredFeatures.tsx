// components/DiscoveredFeatures.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { FeatureCollection, Feature } from 'geojson';
import { useAtom } from 'jotai';
import { editStateAtom } from '@/lib/store/edit';

interface DiscoveredFeaturesProps {
    map: L.Map;
    features: FeatureCollection[];
}

const DiscoveredFeatures: React.FC<DiscoveredFeaturesProps> = ({ map, features }) => {
    const layerRef = useRef<L.GeoJSON | null>(null);
    const [editState] = useAtom(editStateAtom);

    useEffect(() => {
        if (layerRef.current) {
            map.removeLayer(layerRef.current);
        }

        const editingFeatureIds = new Set(editState.featureCollection.features.map(f => f.properties?.id));

        const filteredFeatures: FeatureCollection = {
            type: 'FeatureCollection',
            features: features.flatMap(fc =>
                fc.features.filter(f => !editingFeatureIds.has(f.properties?.id))
            )
        };

        layerRef.current = L.geoJSON(filteredFeatures, {
            style: (feature) => {
                return {
                    color: feature?.properties?.color || '#3388ff',
                };
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`
          <h3>${feature.properties?.name || 'Unnamed Feature'}</h3>
          <p>${feature.properties?.description || 'No description'}</p>
        `);
            }
        }).addTo(map);

        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current);
            }
        };
    }, [map, features, editState]);

    return null;
};

export default DiscoveredFeatures;