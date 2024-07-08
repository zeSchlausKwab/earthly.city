'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';

interface GeomanControlsProps {
    map: L.Map;
}

const GeomanControls: React.FC<GeomanControlsProps> = ({ map }) => {
    useEffect(() => {
        map.pm.addControls({
            position: 'topleft',
            drawCircle: false,
        });

        map.on('pm:create', (e) => {
            const layer = e.layer;
            const geoJSON = layer.toGeoJSON();
            console.log('Created feature:', geoJSON);
            // Here you would typically send this to your backend or update your state
        });

        return () => {
            map.pm.removeControls();
            map.off('pm:create');
        };
    }, [map]);

    return null;
};

export default GeomanControls;