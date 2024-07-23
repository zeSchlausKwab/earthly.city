"use client"

import { useFeatureCollection } from '@/lib/store/featureCollection';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import React from 'react';
import GeometryEditor from './geometry-editors/GeometryEditor';

const RightSidebar: React.FC = () => {
  const { featureCollection, editFeature } = useFeatureCollection();

  const handlePropertyChange = (feature: Feature<Geometry, GeoJsonProperties>) => {
    if (feature.properties?.id) {
      editFeature(feature.properties.id, feature.properties);
    }
  };

  return (
    <ScrollArea className="p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">Feature Details</h2>
      {featureCollection.features.map((feature, index) => (
        <GeometryEditor
          key={feature.properties?.id}
          feature={feature}
          editMode={true}
          onChange={handlePropertyChange}
        />
      ))}
    </ScrollArea>
  );
};

export default RightSidebar;