// lib/store/edit.ts

import { atom } from 'jotai';
import { Feature, FeatureCollection } from 'geojson';
import { v4 as uuidv4 } from 'uuid';
import { publishFeature } from '../nostr/publishFeature';

export type EditMode = 'view' | 'create' | 'edit';

export interface EditState {
    featureCollection: FeatureCollection;
    mode: EditMode;
}

const initialFeatureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
};

const initialEditState: EditState = {
    featureCollection: initialFeatureCollection,
    mode: 'view'
};

export const editStateAtom = atom<EditState>(initialEditState);

export const setModeAtom = atom(
    null,
    (get, set, mode: EditMode) => {
        const currentState = get(editStateAtom);
        set(editStateAtom, { ...currentState, mode });
    }
);

export const addFeatureAtom = atom(
    null,
    (get, set, feature: Feature) => {
        const currentState = get(editStateAtom);
        const newFeature = {
            ...feature,
            properties: {
                ...feature.properties,
                id: feature.properties?.id || uuidv4(),
                name: feature.properties?.name || `New Feature ${currentState.featureCollection.features.length + 1}`,
                description: feature.properties?.description || 'Default description',
                color: feature.properties?.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            }
        };
        set(editStateAtom, {
            ...currentState,
            featureCollection: {
                ...currentState.featureCollection,
                features: [...currentState.featureCollection.features, newFeature]
            },
            mode: 'edit'
        });
    }
);

export const updateFeatureAtom = atom(
    null,
    (get, set, updatedFeature: Feature) => {
        const currentState = get(editStateAtom);
        const updatedFeatures = currentState.featureCollection.features.map(feature =>
            feature.properties?.id === updatedFeature.properties?.id ? updatedFeature : feature
        );
        set(editStateAtom, {
            ...currentState,
            featureCollection: {
                ...currentState.featureCollection,
                features: updatedFeatures
            }
        });
    }
);

export const removeFeatureAtom = atom(
    null,
    (get, set, featureId: string) => {
        const currentState = get(editStateAtom);
        const updatedFeatures = currentState.featureCollection.features.filter(feature =>
            feature.properties?.id !== featureId
        );
        set(editStateAtom, {
            ...currentState,
            featureCollection: {
                ...currentState.featureCollection,
                features: updatedFeatures
            }
        });
    }
);

export const updateFeatureCollectionAtom = atom(
    null,
    (get, set, updatedFeatureCollection: FeatureCollection) => {
        const currentState = get(editStateAtom);
        set(editStateAtom, {
            ...currentState,
            featureCollection: updatedFeatureCollection
        });
    }
);

export const setPropertyAtom = atom(
    null,
    (get, set, featureId: string, key: string, value: any) => {
        const currentState = get(editStateAtom);
        const updatedFeatures = currentState.featureCollection.features.map(feature => {
            if (feature.properties?.id === featureId) {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        [key]: value
                    }
                };
            }
            return feature;
        });
        set(editStateAtom, {
            ...currentState,
            featureCollection: {
                ...currentState.featureCollection,
                features: updatedFeatures
            }
        });
    }
);

export const clearEditStateAtom = atom(
    null,
    (_, set) => {
        set(editStateAtom, initialEditState);
    }
);

export const publishFeatureAtom = atom(
    null,
    async (get, set) => {
        const { featureCollection } = get(editStateAtom);
        try {
            const publishedEvent = await publishFeature(featureCollection);
            // You might want to update the featureCollection with the published event id
            set(editStateAtom, initialEditState);
            return publishedEvent;
        } catch (error) {
            console.error('Error publishing feature:', error);
            throw error;
        }
    }
);