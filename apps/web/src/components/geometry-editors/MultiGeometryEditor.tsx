import React from 'react';
import PointEditor from './PointEditor';
import LineStringEditor from './LineStringEditor';
import PolygonEditor from './PolygonEditor';
import { Button } from '../ui/button';

interface MultiGeometryEditorProps {
  geometry: GeoJSON.MultiPoint | GeoJSON.MultiLineString | GeoJSON.MultiPolygon;
  editMode: boolean;
  onChange: (geometry: GeoJSON.MultiPoint | GeoJSON.MultiLineString | GeoJSON.MultiPolygon) => void;
}

const MultiGeometryEditor: React.FC<MultiGeometryEditorProps> = ({ geometry, editMode, onChange }) => {
  const handleGeometryChange = (index: number, updatedGeometry: GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon) => {
    const newCoordinates = [...geometry.coordinates];
    newCoordinates[index] = updatedGeometry.coordinates;
    onChange({
      ...geometry,
      coordinates: newCoordinates,
    });
  };

  const addGeometry = () => {
    const newCoordinates = [...geometry.coordinates, getEmptyCoordinates()];
    onChange({
      ...geometry,
      coordinates: newCoordinates,
    });
  };

  const removeGeometry = (index: number) => {
    const newCoordinates = geometry.coordinates.filter((_, i) => i !== index);
    onChange({
      ...geometry,
      coordinates: newCoordinates,
    });
  };

  const getEmptyCoordinates = () => {
    switch (geometry.type) {
      case 'MultiPoint':
        return [0, 0];
      case 'MultiLineString':
        return [[0, 0], [1, 1]];
      case 'MultiPolygon':
        return [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]];
      default:
        return [];
    }
  };

  const renderEditor = (coords: any, index: number) => {
    switch (geometry.type) {
      case 'MultiPoint':
        return (
          <PointEditor
            geometry={{ type: 'Point', coordinates: coords }}
            editMode={editMode}
            onChange={(updatedGeometry) => handleGeometryChange(index, updatedGeometry)}
          />
        );
      case 'MultiLineString':
        return (
          <LineStringEditor
            geometry={{ type: 'LineString', coordinates: coords }}
            editMode={editMode}
            onChange={(updatedGeometry) => handleGeometryChange(index, updatedGeometry)}
          />
        );
      case 'MultiPolygon':
        return (
          <PolygonEditor
            geometry={{ type: 'Polygon', coordinates: coords }}
            editMode={editMode}
            onChange={(updatedGeometry) => handleGeometryChange(index, updatedGeometry)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{geometry.type}</h3>
      {geometry.coordinates.map((coords, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <h4 className="text-md font-medium mb-2">{geometry.type.replace('Multi', '')} {index + 1}</h4>
          {renderEditor(coords, index)}
          {editMode && (
            <Button onClick={() => removeGeometry(index)} variant="destructive" className="mt-2">
              Remove {geometry.type.replace('Multi', '')}
            </Button>
          )}
        </div>
      ))}
      {editMode && (
        <Button onClick={addGeometry} className="mt-2">
          Add {geometry.type.replace('Multi', '')}
        </Button>
      )}
    </div>
  );
};

export default MultiGeometryEditor;