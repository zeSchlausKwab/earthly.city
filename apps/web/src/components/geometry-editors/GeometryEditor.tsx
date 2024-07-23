import React from 'react';
import PointEditor from './PointEditor';
import LineStringEditor from './LineStringEditor';
import PolygonEditor from './PolygonEditor';
import MultiGeometryEditor from './MultiGeometryEditor';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface GeometryEditorProps {
    feature: GeoJSON.Feature;
    editMode: boolean;
    onChange: (feature: GeoJSON.Feature) => void;
}

const GeometryEditor: React.FC<GeometryEditorProps> = ({ feature, editMode, onChange }) => {
    const handlePropertyChange = (key: string, value: string) => {
        onChange({
            ...feature,
            properties: {
                ...feature.properties,
                [key]: value,
            },
        });
    };

    const handleGeometryChange = (geometry: GeoJSON.Geometry) => {
        onChange({
            ...feature,
            geometry,
        });
    };

    const renderGeometryEditor = () => {
        switch (feature.geometry.type) {
            case 'Point':
                return <PointEditor geometry={feature.geometry} editMode={editMode} onChange={handleGeometryChange} />;
            case 'LineString':
                return <LineStringEditor geometry={feature.geometry} editMode={editMode} onChange={handleGeometryChange} />;
            case 'Polygon':
                return <PolygonEditor geometry={feature.geometry} editMode={editMode} onChange={handleGeometryChange} />;
            case 'MultiPoint':
            case 'MultiLineString':
            case 'MultiPolygon':
                return <MultiGeometryEditor geometry={feature.geometry} editMode={editMode} onChange={handleGeometryChange} />;
            default:
                return <div>Unsupported geometry type</div>;
        }
    };

    return (
        <div>
            <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={feature.properties?.name || ''}
                    onChange={(e) => handlePropertyChange('name', e.target.value)}
                    disabled={!editMode}
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={feature.properties?.description || ''}
                    onChange={(e) => handlePropertyChange('description', e.target.value)}
                    disabled={!editMode}
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="color">Color</Label>
                <Input
                    id="color"
                    type="color"
                    value={feature.properties?.color || '#000000'}
                    onChange={(e) => handlePropertyChange('color', e.target.value)}
                    disabled={!editMode}
                />
            </div>
            {renderGeometryEditor()}
        </div>
    );
};

export default GeometryEditor;