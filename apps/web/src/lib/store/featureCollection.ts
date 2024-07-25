"use client"

import { generateRandomColor } from "@earthly-land/common";
import { Feature, FeatureCollection, GeoJsonProperties } from 'geojson';
import { atom, useAtom } from 'jotai';
import type { Map as LeafletMap } from 'leaflet';
import { v4 as uuidv4 } from "uuid";
import { publishFeatureCollectionEvent, updateFeatureCollectionEvent } from '../service/featureEventService';
import { DiscoveredFeature } from './featureDiscovery';

const featureCollectionAtom = atom<FeatureCollection & { naddr?: string, name: string, description: string }>({
    type: 'FeatureCollection',
    features: [],
    id: uuidv4(),
});

const unsavedChangesAtom = atom<boolean>(false);
const isEditingAtom = atom<boolean>(false);
const mapInstanceAtom = atom<LeafletMap | null>(null);

export const useFeatureCollection = () => {
    const [featureCollection, setFeatureCollection] = useAtom(featureCollectionAtom);
    const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);
    const [isEditing, setIsEditing] = useAtom(isEditingAtom);
    const [mapInstance, setMapInstance] = useAtom(mapInstanceAtom);

    const setMap = (map: LeafletMap) => {
        console.log('Setting map instance:', map);
        setMapInstance(map);
    };

    const zoomToFeatureBounds = (feature: DiscoveredFeature) => {
        console.log('typeof windowmapInstance && feature.featureCollection:', window, mapInstance, feature.featureCollection);
        if (typeof window !== 'undefined' && mapInstance && feature.featureCollection) {
            const L = require('leaflet');
            console.log('Zooming to feature bounds:', feature);
            const bounds = L.geoJSON(feature.featureCollection).getBounds();
            console.log('Bounds:', bounds);
            mapInstance.flyToBounds(bounds, {
                padding: [50, 50],
                maxZoom: 14,
            });
        }
    };

    const loadFeatureCollection = (feature: DiscoveredFeature, editMode: boolean) => {
        setFeatureCollection({
            ...feature.featureCollection,
            naddr: feature.naddr,
            name: feature.name,
            description: feature.description,
        });
        // setEditMode(editMode);
    };

    const createFeature = (geoJSON: Feature) => {
        const newFeatureIndex = featureCollection.features.length;

        const newFeature: Feature = {
            ...geoJSON,
            properties: {
                ...geoJSON.properties,
                id: uuidv4(),
                name: `Feature ${newFeatureIndex + 1}`,
                description: `Description for feature ${newFeatureIndex + 1}`,
                color: generateRandomColor(),
            },
        };

        setFeatureCollection((prev) => ({
            ...prev,
            features: [...prev.features, newFeature],
        }));
        setUnsavedChanges(true);

        return newFeature;
    };

    const editFeature = (id: string, updatedProperties: Partial<GeoJsonProperties>) => {
        setFeatureCollection((prev) => ({
            ...prev,
            features: prev.features.map((feature) => {
                if (feature.properties?.id === id) {
                    return {
                        ...feature,
                        properties: {
                            ...feature.properties,
                            ...updatedProperties,
                        },
                    };
                }
                return feature;
            }),
        }));
        setUnsavedChanges(true);
    };

    const updateFeature = (updatedFeature: Feature) => {
        setFeatureCollection((prev) => ({
            ...prev,
            features: prev.features.map((feature) =>
                feature.properties?.id === updatedFeature.properties?.id ? updatedFeature : feature
            ),
        }));
        setUnsavedChanges(true);
    };

    const deleteFeature = (id: string) => {
        setFeatureCollection((prev) => ({
            ...prev,
            features: prev.features.filter((feature) => feature.properties?.id !== id),
        }));
        setUnsavedChanges(true);
    };

    const updateCollectionMetadata = (metadata: Partial<Pick<FeatureCollection, 'name' | 'description'>>) => {
        setFeatureCollection((prev) => ({
            ...prev,
            ...metadata,
        }));
        setUnsavedChanges(true);
    };

    const publishFeatureEvent = async () => {
        try {
            await publishFeatureCollectionEvent(featureCollection);
            setUnsavedChanges(false);
            return true;
        } catch (error) {
            console.error('Error saving changes:', error);
            return false;
        }
    };

    const saveChanges = async () => {
        try {
            await updateFeatureCollectionEvent(featureCollection);
            setUnsavedChanges(false);
            return true;
        } catch (error) {
            console.error('Error saving changes:', error);
            return false;
        }
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    const stopEditing = () => {
        setIsEditing(false);
    };

    return {
        featureCollection,
        createFeature,
        updateFeature,
        deleteFeature,
        editFeature,
        updateCollectionMetadata,
        saveChanges,
        publishFeatureEvent,
        loadFeatureCollection,
        unsavedChanges,
        isEditing,
        startEditing,
        stopEditing,
        setMap,
        zoomToFeatureBounds,
    };
};