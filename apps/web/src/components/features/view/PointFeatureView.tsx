// components/PointFeatureView.tsx
import React from 'react';
import { Feature, Point } from 'geojson';
import { FeatureView } from './FeatureView';

interface PointFeatureViewProps {
    feature: Feature<Point>;
}

export const PointFeatureView: React.FC<PointFeatureViewProps> = ({ feature }) => {
    return (
        <FeatureView feature={feature}>
            <p>Coordinates: {feature.geometry.coordinates.join(', ')}</p>
        </FeatureView>
    );
};

