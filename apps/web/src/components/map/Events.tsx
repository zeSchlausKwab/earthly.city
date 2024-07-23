import { useFeatureCollection } from "@/lib/store/featureCollection";
import L, { Layer, LeafletMouseEvent } from "leaflet";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const Events = () => {
    const map = useMap();
    const { featureCollection, createFeature, updateFeature, deleteFeature } = useFeatureCollection();
    const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

    const attachLayerEvents = (layer: Layer, geoJSON: GeoJSON.Feature) => {
        layer.on("click", (e: LeafletMouseEvent) => {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <h3>${geoJSON.properties?.name}</h3>
                    <p>${geoJSON.properties?.description}</p>
                `)
                .openOn(map);
        });

        layer.on("pm:edit", (e) => {
            const updatedGeoJSON = e.layer.toGeoJSON() as GeoJSON.Feature;
            updateFeature(updatedGeoJSON);
        });

        layer.on("pm:remove", (e) => {
            const removedGeoJSON = e.layer.toGeoJSON() as GeoJSON.Feature;
            deleteFeature(removedGeoJSON.properties?.id);
        });
    };

    useEffect(() => {
        if (map) {
            map.on("pm:create", (e) => {
                const layer = e.layer;
                const geoJSON = layer.toGeoJSON() as GeoJSON.Feature;
                const newFeature = createFeature(geoJSON);

                // Add the new feature to the existing GeoJSON layer
                if (geoJsonLayerRef.current) {
                    geoJsonLayerRef.current.addData(newFeature);
                    const newLayer = geoJsonLayerRef.current.getLayers()[geoJsonLayerRef.current.getLayers().length - 1];
                    attachLayerEvents(newLayer, newFeature);
                    if (newLayer instanceof L.Path) {
                        newLayer.pm.enable();
                    }
                }

                // Remove the temporary layer created by Geoman
                map.removeLayer(layer);
            });

            if (geoJsonLayerRef.current) {
                map.removeLayer(geoJsonLayerRef.current);
            }

            geoJsonLayerRef.current = L.geoJSON(featureCollection, {
                style: (feature) => ({
                    color: feature?.properties?.color || "#000000",
                }),
                onEachFeature: (feature, layer) => {
                    attachLayerEvents(layer, feature);
                    if (layer instanceof L.Path) {
                        layer.pm.enable();
                    }
                },
            }).addTo(map);
        }

        return () => {
            if (map) {
                map.off("pm:create");
                if (geoJsonLayerRef.current) {
                    map.removeLayer(geoJsonLayerRef.current);
                }
            }
        };
    }, [map, featureCollection]);

    return null;
};

export default Events;