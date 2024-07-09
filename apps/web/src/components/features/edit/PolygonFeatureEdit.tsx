import React from 'react';
import { Feature, Polygon } from 'geojson';
import { FeatureEdit } from './FeatureEdit';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PolygonFeatureEditProps {
    feature: Feature<Polygon>;
    onPropertyChange: (key: string, value: string) => void;
    onGeometryChange: (coordinates: number[][][]) => void;
}

export const PolygonFeatureEdit: React.FC<PolygonFeatureEditProps> = ({ feature, onPropertyChange, onGeometryChange }) => {
    const handleCoordinateChange = (ringIndex: number, pointIndex: number, coord: number, value: string) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[ringIndex][pointIndex][coord] = parseFloat(value);
        onGeometryChange(newCoordinates);
    };

    const addPoint = (ringIndex: number) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[ringIndex].push([0, 0]);
        onGeometryChange(newCoordinates);
    };

    const removePoint = (ringIndex: number, pointIndex: number) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[ringIndex] = newCoordinates[ringIndex].filter((_, i) => i !== pointIndex);
        onGeometryChange(newCoordinates);
    };

    return (
        <FeatureEdit feature={feature} onPropertyChange={onPropertyChange}>
            <div className="space-y-4">
                {feature.geometry.coordinates.map((ring, ringIndex) => (
                    <div key={ringIndex} className="space-y-2">
                        <h4>Ring {ringIndex + 1}</h4>
                        {ring.map((point, pointIndex) => (
                            <div key={pointIndex} className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    value={point[0]}
                                    onChange={(e) => handleCoordinateChange(ringIndex, pointIndex, 0, e.target.value)}
                                    placeholder="Longitude"
                                />
                                <Input
                                    type="number"
                                    value={point[1]}
                                    onChange={(e) => handleCoordinateChange(ringIndex, pointIndex, 1, e.target.value)}
                                    placeholder="Latitude"
                                />
                                <Button onClick={() => removePoint(ringIndex, pointIndex)} variant="destructive">Remove</Button>
                            </div>
                        ))}
                        <Button onClick={() => addPoint(ringIndex)}>Add Point to Ring</Button>
                    </div>
                ))}
            </div>
        </FeatureEdit>
    );
};