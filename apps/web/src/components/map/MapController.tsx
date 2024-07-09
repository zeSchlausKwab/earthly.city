'use client';

import { FeatureCollection } from "geojson";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const zoomToFeatureCollectionAtom = atom<FeatureCollection | null>(null);


const MapController: React.FC<{ map: L.Map | null }> = ({ map }) => {
    const [zoomToFeatureCollection] = useAtom(zoomToFeatureCollectionAtom);

    useEffect(() => {
        if (map && zoomToFeatureCollection) {
            const bounds = L.geoJSON(zoomToFeatureCollection).getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, zoomToFeatureCollection]);

    return null;
};

export default MapController;

