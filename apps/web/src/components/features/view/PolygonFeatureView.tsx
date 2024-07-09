// components/PolygonFeatureView.tsx
import React from 'react';
import { Feature, Polygon } from 'geojson';
import { FeatureView } from './FeatureView';

interface PolygonFeatureViewProps {
    feature: Feature<Polygon>;
}

export const PolygonFeatureView: React.FC<PolygonFeatureViewProps> = ({ feature }) => {
    return (
        <FeatureView feature={feature}>
            <p>Number of rings: {feature.geometry.coordinates.length}</p>
            <p>Number of points in outer ring: {feature.geometry.coordinates[0].length}</p>
        </FeatureView>
    );
};