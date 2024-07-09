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
            drawMarker: true,
            drawCircleMarker: false,
            drawPolyline: true,
            drawRectangle: true,
            drawPolygon: true,
            drawCircle: true,
            editMode: true,
            dragMode: true,
            cutPolygon: true,
            removalMode: true,
        });

        return () => {
            map.pm.removeControls();
        };
    }, [map]);

    return null;
};

export default GeomanControls;