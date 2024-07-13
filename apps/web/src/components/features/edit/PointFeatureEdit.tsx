// components/PointFeatureEdit.tsx
import React from 'react';
import { Feature, Point } from 'geojson';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PointFeatureEditProps {
    feature: Feature<Point>;
    onChange: (updatedFeature: Feature<Point>) => void;
}

export const PointFeatureEdit: React.FC<PointFeatureEditProps> = ({ feature, onChange }) => {
    const handlePropertyChange = (key: string, value: string) => {
        onChange({
            ...feature,
            properties: { ...feature.properties, [key]: value }
        });
    };

    const handleCoordinateChange = (index: number, value: string) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[index] = parseFloat(value);
        onChange({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: newCoordinates
            }
        });
    };

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Point Feature</h3>
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={feature.properties?.name || ''}
                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={feature.properties?.description || ''}
                    onChange={(e) => handlePropertyChange('description', e.target.value)}
                />
            </div>
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
    );
};