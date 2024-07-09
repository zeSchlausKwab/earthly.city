// components/MultiGeometryFeatureEdit.tsx
import React from 'react';
import { Feature, MultiPoint, MultiLineString, MultiPolygon } from 'geojson';
import { FeatureEdit } from './FeatureEdit';
import { PointFeatureEdit } from './PointFeatureEdit';
import { LineStringFeatureEdit } from './LineStringFeatureEdit';
import { PolygonFeatureEdit } from './PolygonFeatureEdit';
import { Button } from '@/components/ui/button';

interface MultiGeometryFeatureEditProps {
    feature: Feature<MultiPoint | MultiLineString | MultiPolygon>;
    onPropertyChange: (key: string, value: string) => void;
    onGeometryChange: (coordinates: any[]) => void;
}

export const MultiGeometryFeatureEdit: React.FC<MultiGeometryFeatureEditProps> = ({ feature, onPropertyChange, onGeometryChange }) => {
    const handleGeometryChange = (index: number, coordinates: any) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[index] = coordinates;
        onGeometryChange(newCoordinates);
    };

    const addGeometry = () => {
        const newCoordinates = [...feature.geometry.coordinates, []];
        onGeometryChange(newCoordinates);
    };

    const removeGeometry = (index: number) => {
        const newCoordinates = feature.geometry.coordinates.filter((_, i) => i !== index);
        onGeometryChange(newCoordinates);
    };

    const renderGeometry = (coordinates: any, index: number) => {
        switch (feature.geometry.type) {
            case 'MultiPoint':
                return (
                    <PointFeatureEdit
                        feature={{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates } }}
                        onPropertyChange={() => { }}
                        onGeometryChange={(coords) => handleGeometryChange(index, coords)}
                    />
                );
            case 'MultiLineString':
                return (
                    <LineStringFeatureEdit
                        feature={{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } }}
                        onPropertyChange={() => { }}
                        onGeometryChange={(coords) => handleGeometryChange(index, coords)}
                    />
                );
            case 'MultiPolygon':
                return (
                    <PolygonFeatureEdit
                        feature={{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates } }}
                        onPropertyChange={() => { }}
                        onGeometryChange={(coords) => handleGeometryChange(index, coords)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <FeatureEdit feature={feature} onPropertyChange={onPropertyChange}>
            <div className="space-y-4">
                {feature.geometry.coordinates.map((coords, index) => (
                    <div key={index} className="border p-4 rounded">
                        <h4>{feature.geometry.type.replace('Multi', '')} {index + 1}</h4>
                        {renderGeometry(coords, index)}
                        <Button onClick={() => removeGeometry(index)} variant="destructive">Remove {feature.geometry.type.replace('Multi', '')}</Button>
                    </div>
                ))}
                <Button onClick={addGeometry}>Add {feature.geometry.type.replace('Multi', '')}</Button>
            </div>
        </FeatureEdit>
    );
};