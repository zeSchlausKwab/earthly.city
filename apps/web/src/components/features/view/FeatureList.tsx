// components/FeatureList.tsx
import React from 'react';
import { Feature, Geometry, LineString, Point, Polygon } from 'geojson';
import { PointFeatureView } from './PointFeatureView';
import { LineStringFeatureView } from './LineStringFeatureView';
import { PolygonFeatureView } from './PolygonFeatureView';
import { FeatureView } from './FeatureView';

interface FeatureListProps {
    features: Feature[];
    onSelectFeature: (feature: Feature) => void;
}

export const FeatureList: React.FC<FeatureListProps> = ({ features, onSelectFeature }) => {
    const renderFeature = (feature: Feature) => {
        switch (feature.geometry.type) {
            case 'Point':
                return <PointFeatureView feature={feature as Feature<Point>} />;
            case 'LineString':
                return <LineStringFeatureView feature={feature as Feature<LineString>} />;
            case 'Polygon':
                return <PolygonFeatureView feature={feature as Feature<Polygon>} />;
            case 'MultiPoint':
            case 'MultiLineString':
            case 'MultiPolygon':
            case 'GeometryCollection':
                // For multi-geometries and collections, we'll use the base FeatureView
                return <FeatureView feature={feature} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {features.map((feature) => (
                <div key={feature.properties?.id} onClick={() => onSelectFeature(feature)}>
                    {renderFeature(feature)}
                </div>
            ))}
        </div>
    );
};