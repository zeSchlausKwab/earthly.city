// components/FeatureView.tsx
import React from 'react';
import { Feature } from 'geojson';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureViewProps {
    feature: Feature;
}

export const FeatureView: React.FC<FeatureViewProps> = ({ feature }) => {
    const { properties, geometry } = feature;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{properties?.name || 'Unnamed Feature'}</CardTitle>
                <Badge>{geometry.type}</Badge>
            </CardHeader>
            <CardContent>
                <p>{properties?.description || 'No description'}</p>
                <div style={{ backgroundColor: properties?.color || '#000000', width: 20, height: 20, marginTop: 10 }} />
                {/* Render specific geometry information here */}
            </CardContent>
        </Card>
    );
};