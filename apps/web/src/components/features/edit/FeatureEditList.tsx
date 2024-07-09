// components/FeatureEditList.tsx
import React from 'react';
import { Feature, Geometry, Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon } from 'geojson';
import { PointFeatureEdit } from './PointFeatureEdit';
import { LineStringFeatureEdit } from './LineStringFeatureEdit';
import { PolygonFeatureEdit } from './PolygonFeatureEdit';
import { MultiGeometryFeatureEdit } from './MultiGeometryFeatureEdit';

interface FeatureEditListProps {
    features: Feature[];
    onFeatureChange: (featureId: string, updatedFeature: Feature) => void;
}

export const FeatureEditList: React.FC<FeatureEditListProps> = ({ features, onFeatureChange }) => {
    const handlePropertyChange = (featureId: string, key: string, value: string) => {
        const feature = features.find(f => f.properties?.id === featureId);
        if (feature) {
            const updatedFeature = {
                ...feature,
                properties: { ...feature.properties, [key]: value }
            };
            onFeatureChange(featureId, updatedFeature);
        }
    };

    const handleGeometryChange = (featureId: string, coordinates: any) => {
        const feature = features.find(f => f.properties?.id === featureId);
        if (feature) {
            const updatedFeature = {
                ...feature,
                geometry: { ...feature.geometry, coordinates }
            };
            onFeatureChange(featureId, updatedFeature);
        }
    };

    const renderFeatureEdit = (feature: Feature) => {
        switch (feature.geometry.type) {
            case 'Point':
                return (
                    <PointFeatureEdit
                        feature={feature as Feature<Point>}
                        onPropertyChange={(key, value) => handlePropertyChange(feature.properties?.id!, key, value)}
                        onGeometryChange={(coordinates) => handleGeometryChange(feature.properties?.id!, coordinates)}
                    />
                );
            case 'LineString':
                return (
                    <LineStringFeatureEdit
                        feature={feature as Feature<LineString>}
                        onPropertyChange={(key, value) => handlePropertyChange(feature.properties?.id!, key, value)}
                        onGeometryChange={(coordinates) => handleGeometryChange(feature.properties?.id!, coordinates)}
                    />
                );
            case 'Polygon':
                return (
                    <PolygonFeatureEdit
                        feature={feature as Feature<Polygon>}
                        onPropertyChange={(key, value) => handlePropertyChange(feature.properties?.id!, key, value)}
                        onGeometryChange={(coordinates) => handleGeometryChange(feature.properties?.id!, coordinates)}
                    />
                );
            case 'MultiPoint':
            case 'MultiLineString':
            case 'MultiPolygon':
                return (
                    <MultiGeometryFeatureEdit
                        feature={feature as Feature<MultiPoint | MultiLineString | MultiPolygon>}
                        onPropertyChange={(key, value) => handlePropertyChange(feature.properties?.id!, key, value)}
                        onGeometryChange={(coordinates) => handleGeometryChange(feature.properties?.id!, coordinates)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {features.map((feature) => (
                <div key={feature.properties?.id}>
                    {renderFeatureEdit(feature)}
                </div>
            ))}
        </div>
    );
};