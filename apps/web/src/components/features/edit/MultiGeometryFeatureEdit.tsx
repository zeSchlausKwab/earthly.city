// components/MultiGeometryFeatureEdit.tsx
import React from 'react';
import { Feature, MultiPoint, MultiLineString, MultiPolygon } from 'geojson';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface MultiGeometryFeatureEditProps {
    feature: Feature<MultiPoint | MultiLineString | MultiPolygon>;
    onChange: (updatedFeature: Feature<MultiPoint | MultiLineString | MultiPolygon>) => void;
}

export const MultiGeometryFeatureEdit: React.FC<MultiGeometryFeatureEditProps> = ({ feature, onChange }) => {
    const handlePropertyChange = (key: string, value: string) => {
        onChange({
            ...feature,
            properties: { ...feature.properties, [key]: value }
        });
    };

    const handleGeometryChange = (geometryIndex: number, newGeometry: any) => {
        const newCoordinates = [...feature.geometry.coordinates];
        newCoordinates[geometryIndex] = newGeometry;
        onChange({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: newCoordinates
            }
        });
    };

    const addGeometry = () => {
        const newCoordinates = [...feature.geometry.coordinates, []];
        onChange({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: newCoordinates
            }
        });
    };

    const removeGeometry = (geometryIndex: number) => {
        const newCoordinates = feature.geometry.coordinates.filter((_, index) => index !== geometryIndex);
        onChange({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: newCoordinates
            }
        });
    };

    const renderGeometryEdit = (geometry: any, geometryIndex: number) => {
        switch (feature.geometry.type) {
            case 'MultiPoint':
                return (
                    <div className="space-y-2">
                        <h4>Point {geometryIndex + 1}</h4>
                        <Input
                            type="number"
                            value={geometry[0]}
                            onChange={(e) => handleGeometryChange(geometryIndex, [parseFloat(e.target.value), geometry[1]])}
                            placeholder="Longitude"
                        />
                        <Input
                            type="number"
                            value={geometry[1]}
                            onChange={(e) => handleGeometryChange(geometryIndex, [geometry[0], parseFloat(e.target.value)])}
                            placeholder="Latitude"
                        />
                    </div>
                );
            case 'MultiLineString':
                return (
                    <div className="space-y-2">
                        <h4>LineString {geometryIndex + 1}</h4>
                        {geometry.map((point: number[], pointIndex: number) => (
                            <div key={pointIndex} className="flex space-x-2">
                                <Input
                                    type="number"
                                    value={point[0]}
                                    onChange={(e) => {
                                        const newGeometry = [...geometry];
                                        newGeometry[pointIndex] = [parseFloat(e.target.value), point[1]];
                                        handleGeometryChange(geometryIndex, newGeometry);
                                    }}
                                    placeholder="Longitude"
                                />
                                <Input
                                    type="number"
                                    value={point[1]}
                                    onChange={(e) => {
                                        const newGeometry = [...geometry];
                                        newGeometry[pointIndex] = [point[0], parseFloat(e.target.value)];
                                        handleGeometryChange(geometryIndex, newGeometry);
                                    }}
                                    placeholder="Latitude"
                                />
                            </div>
                        ))}
                    </div>
                );
            case 'MultiPolygon':
                return (
                    <div className="space-y-2">
                        <h4>Polygon {geometryIndex + 1}</h4>
                        {geometry.map((ring: number[][], ringIndex: number) => (
                            <div key={ringIndex} className="space-y-2">
                                <h5>Ring {ringIndex + 1}</h5>
                                {ring.map((point: number[], pointIndex: number) => (
                                    <div key={pointIndex} className="flex space-x-2">
                                        <Input
                                            type="number"
                                            value={point[0]}
                                            onChange={(e) => {
                                                const newGeometry = [...geometry];
                                                newGeometry[ringIndex][pointIndex] = [parseFloat(e.target.value), point[1]];
                                                handleGeometryChange(geometryIndex, newGeometry);
                                            }}
                                            placeholder="Longitude"
                                        />
                                        <Input
                                            type="number"
                                            value={point[1]}
                                            onChange={(e) => {
                                                const newGeometry = [...geometry];
                                                newGeometry[ringIndex][pointIndex] = [point[0], parseFloat(e.target.value)];
                                                handleGeometryChange(geometryIndex, newGeometry);
                                            }}
                                            placeholder="Latitude"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Multi-Geometry Feature</h3>
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
            <Accordion type="single" collapsible>
                {feature.geometry.coordinates.map((geometry, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>Geometry {index + 1}</AccordionTrigger>
                        <AccordionContent>
                            {renderGeometryEdit(geometry, index)}
                            <Button onClick={() => removeGeometry(index)}>Remove Geometry</Button>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Button onClick={addGeometry}>Add Geometry</Button>
        </div>
    );
};