import React from 'react';
import { Input } from '../ui/input';

interface PointEditorProps {
    geometry: GeoJSON.Point;
    editMode: boolean;
    onChange: (geometry: GeoJSON.Point) => void;
}

const PointEditor: React.FC<PointEditorProps> = ({ geometry, editMode, onChange }) => {
    const [longitude, latitude] = geometry.coordinates;

    const handleChange = (index: number, value: number) => {
        const newCoordinates = [...geometry.coordinates];
        newCoordinates[index] = value;
        onChange({
            ...geometry,
            coordinates: newCoordinates,
        });
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Point</h3>
            <div className="flex flex-col space-y-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <Input
                        type="number"
                        className='h-8 text-xs'
                        value={longitude}
                        onChange={(e) => handleChange(0, parseFloat(e.target.value))}
                        disabled={!editMode}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <Input
                        type="number"
                        className='h-8 text-xs'
                        value={latitude}
                        onChange={(e) => handleChange(1, parseFloat(e.target.value))}
                        disabled={!editMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default PointEditor;