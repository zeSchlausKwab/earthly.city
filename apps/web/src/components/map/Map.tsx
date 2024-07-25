"use client"

import 'leaflet/dist/leaflet.css';
import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from "react-leaflet";
import { GeomanControl } from './GeomanControl';
import Events from './Events';
import { GeoSearchControlComponent } from './GeoSearch';
import { DiscoveredFeature, useFeatureDiscovery } from '@/lib/store/featureDiscovery';
import { Feature, GeoJsonObject, Point } from 'geojson';
import { Layer, PathOptions } from 'leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { useFeatureCollection } from '@/lib/store/featureCollection';

const SetMapInstance: React.FC = () => {
    const map = useMap();
    const { setMap } = useFeatureCollection();

    useEffect(() => {
        setMap(map);
    }, [map, setMap]);

    return null;
};


const Map = () => {
    const { discoveredFeatures, subscribeToFeatures } = useFeatureDiscovery();
    const { loadFeatureCollection, zoomToFeatureBounds } = useFeatureCollection();
    const { isEditing } = useFeatureCollection();


    const handleEdit = (feature: DiscoveredFeature) => {
        loadFeatureCollection(feature, true);
    };

    const handleView = (feature: DiscoveredFeature) => {
        loadFeatureCollection(feature, false);
    };


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

    const onEachFeature = (feature: Feature, layer: Layer, parent: DiscoveredFeature) => {
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
                    <div className='flex flex-row gap-2'>
                        <button class="edit-button">Edit</button>
                        <button class="view-button">View</button>
                    </div>
                </div>
            );

            const popup = L.popup().setContent(popupContent);
            layer.bindPopup(popup);

            layer.on('popupopen', () => {
                const popupElement = layer.getPopup()?.getElement();
                const editButton = popupElement?.querySelector('.edit-button');
                const viewButton = popupElement?.querySelector('.view-button');

                if (editButton) {
                    editButton.addEventListener('click', () => {
                        loadFeatureCollection(parent, true);
                        zoomToFeatureBounds(parent);
                    });
                }
                if (viewButton) {
                    viewButton.addEventListener('click', () => {
                        loadFeatureCollection(parent, false);
                        zoomToFeatureBounds(parent);
                    });
                }
            });
        }
    };



    const pointToLayer = (feature: Feature<Point, any>, latlng: L.LatLng) => {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: feature.properties?.color || '#3388ff',
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    };

    return (
        <>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={11}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=FTejVijNkqKWPbQui8i9"
                />
                <SetMapInstance />
                {isEditing && <GeomanControl position="topleft" oneBlock />}
                <Events />
                <GeoSearchControlComponent />
                {discoveredFeatures.map((feature) => (
                    <GeoJSON
                        key={feature.id}
                        data={feature.featureCollection}
                        pmIgnore={true}
                        style={getFeatureStyle}
                        pointToLayer={pointToLayer}
                        onEachFeature={(innerFeature, layer) => onEachFeature(innerFeature, layer, feature)}
                    />
                ))}
            </MapContainer>
        </>
    );
};

export default Map;