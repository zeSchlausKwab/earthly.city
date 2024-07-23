"use client"

import 'leaflet/dist/leaflet.css';
import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import { GeomanControl } from './GeomanControl';
import Events from './Events';
import { GeoSearchControlComponent } from './GeoSearch';
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery';
import { Feature, GeoJsonObject } from 'geojson';
import { Layer, PathOptions } from 'leaflet';
import ReactDOMServer from 'react-dom/server';



const Map = () => {
    const { discoveredFeatures, subscribeToFeatures } = useFeatureDiscovery();

    useEffect(() => {
        const unsubscribe = subscribeToFeatures();
        return () => {
            unsubscribe();
        };
    }, []);

    const getFeatureStyle = (feature: GeoJsonObject | undefined): PathOptions => {
        if (!feature) {
            return {};
        }
        if (feature.type === 'Feature' && feature.properties && feature.properties.color) {
            return {
                color: feature.properties.color,
                weight: 3,
                opacity: 1,
                fillOpacity: 0.7
            };
        }
        // Default style if no color is specified
        return {
            color: '#3388ff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.7
        };
    };

    const onEachFeature = (feature: Feature, layer: Layer) => {
        if (feature.properties) {
            const popupContent = ReactDOMServer.renderToString(
                <div>
                    <h3 className="text-lg font-bold">{feature.properties.name || 'Unnamed Feature'}</h3>
                    <p>{feature.properties.description || 'No description'}</p>
                    {Object.entries(feature.properties).map(([key, value]) => (
                        key !== 'name' && key !== 'description' && (
                            <p key={key}><strong>{key}:</strong> {String(value)}</p>
                        )
                    ))}
                </div>
            );
            layer.bindPopup(popupContent);
        }
    };

    return (
        <>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=FTejVijNkqKWPbQui8i9"
                />

                <GeomanControl position="topleft" oneBlock />
                <Events />
                <GeoSearchControlComponent />
                {discoveredFeatures.map((feature) => (
                    <GeoJSON
                        key={feature.id}
                        data={feature.featureCollection}
                        pmIgnore={true}
                        style={getFeatureStyle}
                        onEachFeature={onEachFeature}
                    />
                ))}
            </MapContainer>
        </>
    );
};

export default Map;