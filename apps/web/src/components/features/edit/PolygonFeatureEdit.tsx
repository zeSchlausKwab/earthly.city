// components/PolygonFeatureEdit.tsx
import React from 'react';
import { Feature, Polygon } from 'geojson';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PolygonFeatureEditProps {
    feature: Feature<Polygon>;
    onChange: (updatedFeature: Feature<Polygon>) => void;
}

export const PolygonFeatureEdit: React.FC<PolygonFeatureEditProps> = ({ feature, onChange }) => {
    const handlePropertyChange = (key: string, value: string) => {
        onChange({
            ...feature,
            properties: { ...feature.properties, [key]: value }
        });
    };

    const handleCoordinateChange = (ringIndex: number, pointIndex: number, coordIndex: number, value: string) => {
        const newCoordinates = JSON.parse(JSON.stringify(feature.geometry.coordinates));
        newCoordinates[ringIndex][pointIndex][coordIndex] = parseFloat(value);
        onChange({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: newCoordinates
            }
        });
    };

    const addPoint = (ringIndex: number) => {
        const newCoordinates = JSON.parse(JSON.stringify(feature.geometry.coordinates));
        newCoordinates[ringIndex].push([0, 0]);
        onChange({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: newCoordinates
            }
        });
    };

    const removePoint = (ringIndex: number, pointIndex: number) => {
        const newCoordinates = JSON.parse(JSON.stringify(feature.geometry.coordinates));
        newCoordinates[ringIndex].splice(pointIndex, 1);
        onChange({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: newCoordinates
            }
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Polygon Feature</h3>
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
            {feature.geometry.coordinates.map((ring, ringIndex) => (
                <div key={ringIndex} className="space-y-2">
                    <h4>Ring {ringIndex + 1}</h4>
                    {ring.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex space-x-2">
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
                            <Button onClick={() => removePoint(ringIndex, pointIndex)}>Remove</Button>
                        </div>
                    ))}
                    <Button onClick={() => addPoint(ringIndex)}>Add Point</Button>
                </div>
            ))}
        </div>
    );
};