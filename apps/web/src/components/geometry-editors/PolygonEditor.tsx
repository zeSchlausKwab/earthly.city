import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PolygonEditorProps {
  geometry: GeoJSON.Polygon;
  editMode: boolean;
  onChange: (geometry: GeoJSON.Polygon) => void;
}

const PolygonEditor: React.FC<PolygonEditorProps> = ({ geometry, editMode, onChange }) => {
  const handleCoordinateChange = (ringIndex: number, pointIndex: number, coordIndex: number, value: number) => {
    const newCoordinates = [...geometry.coordinates];
    newCoordinates[ringIndex][pointIndex][coordIndex] = value;
    onChange({
      ...geometry,
      coordinates: newCoordinates,
    });
  };

  const addPoint = (ringIndex: number) => {
    const newCoordinates = [...geometry.coordinates];
    newCoordinates[ringIndex].push([0, 0]);
    onChange({
      ...geometry,
      coordinates: newCoordinates,
    });
  };

  const removePoint = (ringIndex: number, pointIndex: number) => {
    const newCoordinates = [...geometry.coordinates];
    newCoordinates[ringIndex] = newCoordinates[ringIndex].filter((_, i) => i !== pointIndex);
    onChange({
      ...geometry,
      coordinates: newCoordinates,
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Polygon</h3>
      {geometry.coordinates.map((ring, ringIndex) => (
        <div key={ringIndex} className="mb-4">
          <h4 className="text-md font-medium mb-2">Ring {ringIndex + 1}</h4>
          {ring.map((coord, pointIndex) => (
            <div key={pointIndex} className="flex items-center space-x-2 mb-2">
              <Input
                type="number"
                value={coord[0]}
                onChange={(e) => handleCoordinateChange(ringIndex, pointIndex, 0, parseFloat(e.target.value))}
                disabled={!editMode}
                placeholder="Longitude"
              />
              <Input
                type="number"
                value={coord[1]}
                onChange={(e) => handleCoordinateChange(ringIndex, pointIndex, 1, parseFloat(e.target.value))}
                disabled={!editMode}
                placeholder="Latitude"
              />
              {editMode && (
                <Button onClick={() => removePoint(ringIndex, pointIndex)} variant="destructive">Remove</Button>
              )}
            </div>
          ))}
          {editMode && (
            <Button onClick={() => addPoint(ringIndex)} className="mt-2">Add Point</Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PolygonEditor;