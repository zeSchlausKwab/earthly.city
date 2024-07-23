import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface LineStringEditorProps {
    geometry: GeoJSON.LineString;
    editMode: boolean;
    onChange: (geometry: GeoJSON.LineString) => void;
}

const LineStringEditor: React.FC<LineStringEditorProps> = ({ geometry, editMode, onChange }) => {
    const handleCoordinateChange = (index: number, coordIndex: number, value: number) => {
        const newCoordinates = [...geometry.coordinates];
        newCoordinates[index][coordIndex] = value;
        onChange({
            ...geometry,
            coordinates: newCoordinates,
        });
    };

    const addPoint = () => {
        const newCoordinates = [...geometry.coordinates, [0, 0]];
        onChange({
            ...geometry,
            coordinates: newCoordinates,
        });
    };

    const removePoint = (index: number) => {
        const newCoordinates = geometry.coordinates.filter((_, i) => i !== index);
        onChange({
            ...geometry,
            coordinates: newCoordinates,
        });
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">LineString</h3>
            {geometry.coordinates.map((coord, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                        type="number"
                        value={coord[0]}
                        onChange={(e) => handleCoordinateChange(index, 0, parseFloat(e.target.value))}
                        disabled={!editMode}
                        placeholder="Longitude"
                    />
                    <Input
                        type="number"
                        value={coord[1]}
                        onChange={(e) => handleCoordinateChange(index, 1, parseFloat(e.target.value))}
                        disabled={!editMode}
                        placeholder="Latitude"
                    />
                    {editMode && (
                        <Button onClick={() => removePoint(index)} variant="destructive">Remove</Button>
                    )}
                </div>
            ))}
            {editMode && (
                <Button onClick={addPoint} className="mt-2">Add Point</Button>
            )}
        </div>
    );
};

export default LineStringEditor;