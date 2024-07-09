// components/PointFeatureEdit.tsx
import React from 'react';
import { Feature, Point } from 'geojson';
import { FeatureEdit } from './FeatureEdit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PointFeatureEditProps {
    feature: Feature<Point>;
    onPropertyChange: (key: string, value: string) => void;
    onGeometryChange: (coordinates: number[]) => void;
}

export const PointFeatureEdit: React.FC<PointFeatureEditProps> = ({ feature, onPropertyChange, onGeometryChange }) => {
    const handleCoordinateChange = (index: number, value: string) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[index] = parseFloat(value);
        onGeometryChange(newCoordinates);
    };

    return (
        <FeatureEdit feature={feature} onPropertyChange={onPropertyChange}>
            <div className="space-y-2">
                <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                        id="longitude"
                        type="number"
                        value={feature.geometry.coordinates[0]}
                        onChange={(e) => handleCoordinateChange(0, e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                        id="latitude"
                        type="number"
                        value={feature.geometry.coordinates[1]}
                        onChange={(e) => handleCoordinateChange(1, e.target.value)}
                    />
                </div>
            </div>
        </FeatureEdit>
    );
};

// components/LineStringFeatureEdit.tsx and PolygonFeatureEdit.tsx would be similar, 
// but with more complex coordinate editing UI