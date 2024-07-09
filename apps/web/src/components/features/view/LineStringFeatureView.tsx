// components/LineStringFeatureView.tsx
import React from 'react';
import { Feature, LineString } from 'geojson';
import { FeatureView } from './FeatureView';

interface LineStringFeatureViewProps {
    feature: Feature<LineString>;
}

export const LineStringFeatureView: React.FC<LineStringFeatureViewProps> = ({ feature }) => {
    return (
        <FeatureView feature={feature}>
            <p>Number of points: {feature.geometry.coordinates.length}</p>
        </FeatureView>
    );
};

