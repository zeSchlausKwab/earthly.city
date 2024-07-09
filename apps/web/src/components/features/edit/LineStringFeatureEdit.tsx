import React from 'react';
import { Feature, LineString } from 'geojson';
import { FeatureEdit } from './FeatureEdit';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LineStringFeatureEditProps {
    feature: Feature<LineString>;
    onPropertyChange: (key: string, value: string) => void;
    onGeometryChange: (coordinates: number[][]) => void;
}

export const LineStringFeatureEdit: React.FC<LineStringFeatureEditProps> = ({ feature, onPropertyChange, onGeometryChange }) => {
    const handleCoordinateChange = (index: number, coord: number, value: string) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[index][coord] = parseFloat(value);
        onGeometryChange(newCoordinates);
    };

    const addPoint = () => {
        const newCoordinates = [...feature.geometry.coordinates, [0, 0]];
        onGeometryChange(newCoordinates);
    };

    const removePoint = (index: number) => {
        const newCoordinates = feature.geometry.coordinates.filter((_, i) => i !== index);
        onGeometryChange(newCoordinates);
    };

    return (
        <FeatureEdit feature={feature} onPropertyChange={onPropertyChange}>
            <div className="space-y-2">
                {feature.geometry.coordinates.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={point[0]}
                            onChange={(e) => handleCoordinateChange(index, 0, e.target.value)}
                            placeholder="Longitude"
                        />
                        <Input
                            type="number"
                            value={point[1]}
                            onChange={(e) => handleCoordinateChange(index, 1, e.target.value)}
                            placeholder="Latitude"
                        />
                        <Button onClick={() => removePoint(index)} variant="destructive">Remove</Button>
                    </div>
                ))}
                <Button onClick={addPoint}>Add Point</Button>
            </div>
        </FeatureEdit>
    );
};