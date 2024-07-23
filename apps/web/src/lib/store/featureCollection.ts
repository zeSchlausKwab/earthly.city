"use client"

import { atom, useAtom } from 'jotai';
import { FeatureCollection, Feature, GeoJsonProperties } from 'geojson';
import { v4 as uuidv4 } from "uuid";
import { generateRandomColor } from "@earthly-land/common";
import { publishFeatureCollectionEvent, updateFeatureCollectionEvent } from '../service/featureEventService';

const featureCollectionAtom = atom<FeatureCollection & { naddr?: string }>({
    type: 'FeatureCollection',
    features: [],
    id: uuidv4(),
    name: 'Default Collection',
    description: 'A collection of geographic features',
    // naddr will be undefined for new collections
});

const unsavedChangesAtom = atom<boolean>(false);

export const useFeatureCollection = () => {
    const [featureCollection, setFeatureCollection] = useAtom(featureCollectionAtom);
    const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

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

    return {
        featureCollection,
        createFeature,
        updateFeature,
        deleteFeature,
        editFeature,
        updateCollectionMetadata,
        saveChanges,
        publishFeatureEvent,
        unsavedChanges,
    };
};