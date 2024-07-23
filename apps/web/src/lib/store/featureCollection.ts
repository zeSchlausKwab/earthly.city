import { atom, useAtom } from 'jotai';
import { FeatureCollection, Feature, GeoJsonProperties } from 'geojson';
import { v4 as uuidv4 } from "uuid";
import { generateRandomColor } from "@earthly-land/common";

const featureCollectionAtom = atom<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
});

export const useFeatureCollection = () => {
    const [featureCollection, setFeatureCollection] = useAtom(featureCollectionAtom);

    const createFeature = (geoJSON: Feature) => {
        const newId = uuidv4();
        const newFeatureIndex = featureCollection.features.length;

        const newFeature: Feature = {
            ...geoJSON,
            properties: {
                ...geoJSON.properties,
                id: newId,
                name: `Feature ${newFeatureIndex + 1}`,
                description: `Description for feature ${newFeatureIndex + 1}`,
                color: generateRandomColor(),
            },
        };

        setFeatureCollection((prev) => ({
            ...prev,
            features: [...prev.features, newFeature],
        }));

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
    };

    const updateFeature = (updatedFeature: Feature) => {
        setFeatureCollection((prev) => ({
            ...prev,
            features: prev.features.map((feature) =>
                feature.properties?.id === updatedFeature.properties?.id ? updatedFeature : feature
            ),
        }));
    };

    const deleteFeature = (id: string) => {
        setFeatureCollection((prev) => ({
            ...prev,
            features: prev.features.filter((feature) => feature.properties?.id !== id),
        }));
    };

    return {
        featureCollection,
        createFeature,
        updateFeature,
        deleteFeature,
        editFeature,
    };
};