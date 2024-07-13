import React from 'react';
import { Feature, FeatureCollection, LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'geojson';
import { PointFeatureEdit } from './PointFeatureEdit';
import { LineStringFeatureEdit } from './LineStringFeatureEdit';
import { PolygonFeatureEdit } from './PolygonFeatureEdit';
import { MultiGeometryFeatureEdit } from './MultiGeometryFeatureEdit';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

interface FeatureEditListProps {
    featureCollection: FeatureCollection;
    onFeatureCollectionChange: (updatedFeatureCollection: FeatureCollection) => void;
}

export const FeatureEditList: React.FC<FeatureEditListProps> = ({ featureCollection, onFeatureCollectionChange }) => {
    const handleFeatureChange = (updatedFeature: Feature) => {
        const updatedFeatures = featureCollection.features.map(feature =>
            feature.properties?.id === updatedFeature.properties?.id ? updatedFeature : feature
        );
        onFeatureCollectionChange({
            ...featureCollection,
            features: updatedFeatures
        });
    };

    const handleAddFeature = () => {
        const newFeature: Feature = {
            type: 'Feature',
            properties: {
                id: uuidv4(),
                name: `New Feature ${featureCollection.features.length + 1}`,
                description: 'Default description',
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
            },
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            }
        };
        onFeatureCollectionChange({
            ...featureCollection,
            features: [...featureCollection.features, newFeature]
        });
    };

    const handleRemoveFeature = (featureId: string) => {
        const updatedFeatures = featureCollection.features.filter(feature => feature.properties?.id !== featureId);
        onFeatureCollectionChange({
            ...featureCollection,
            features: updatedFeatures
        });
    };

    const renderFeatureEdit = (feature: Feature) => {
        switch (feature.geometry.type) {
            case 'Point':
                return (
                    <PointFeatureEdit
                        feature={feature as Feature<Point>}
                        onChange={handleFeatureChange}
                        onRemove={() => handleRemoveFeature(feature.properties?.id!)}
                    />
                );
            case 'LineString':
                return (
                    <LineStringFeatureEdit
                        feature={feature as Feature<LineString>}
                        onChange={handleFeatureChange}
                        onRemove={() => handleRemoveFeature(feature.properties?.id!)}
                    />
                );
            case 'Polygon':
                return (
                    <PolygonFeatureEdit
                        feature={feature as Feature<Polygon>}
                        onChange={handleFeatureChange}
                        onRemove={() => handleRemoveFeature(feature.properties?.id!)}
                    />
                );
            case 'MultiPoint':
            case 'MultiLineString':
            case 'MultiPolygon':
                return (
                    <MultiGeometryFeatureEdit
                        feature={feature as Feature<MultiPoint | MultiLineString | MultiPolygon>}
                        onChange={handleFeatureChange}
                        onRemove={() => handleRemoveFeature(feature.properties?.id!)}
                    />
                );
            default:
                return null;
        }
    };

    const collectionName = featureCollection.features[0]?.properties?.name || 'Unnamed Collection';

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">
                Editing: {collectionName}
            </h2>
            {featureCollection.features.map((feature) => (
                <div key={feature.properties?.id}>
                    {renderFeatureEdit(feature)}
                </div>
            ))}
            <Button onClick={handleAddFeature}>Add New Feature</Button>
        </div>
    );
};