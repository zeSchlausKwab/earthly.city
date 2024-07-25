"use client"

import { ScrollArea } from '@/components/ui/scroll-area';
import { useFeatureCollection } from '@/lib/store/featureCollection';
import { Feature } from 'geojson';
import React, { useState, useEffect } from 'react';
import GeometryEditor from './geometry-editors/GeometryEditor';
import { PlateEditor } from './PlateEditor';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

const RightSidebar: React.FC = () => {
  const { featureCollection, updateFeature, updateCollectionMetadata, saveChanges, publishFeatureEvent, unsavedChanges, isEditing, startEditing, stopEditing } = useFeatureCollection();
  const { toast } = useToast();

  const handleFeatureChange = (updatedFeature: Feature) => {
    if (isEditing) {
      updateFeature(updatedFeature);
    }
  };

  const handleCollectionMetadataChange = (key: 'name' | 'description', value: string) => {
    if (isEditing) {
      console.log('updating collection metadata', key, value);
      updateCollectionMetadata({ [key]: value });
    }
  };

  const handleSaveChanges = async () => {
    let success = false;

    if (featureCollection.naddr) {
      success = await saveChanges();
    } else {
      success = await publishFeatureEvent();
    }
    if (success) {
      toast({
        title: "Changes saved",
        description: "Your feature collection has been updated successfully.",
      });
      // Exit edit mode after successful save
      startEditing();
    } else {
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Feature Collection</h2>
      {isEditing ? (
        <>
          <div className="mb-4">
            <Label htmlFor="collection-name">Collection Name</Label>
            <Input
              id="collection-name"
              value={featureCollection.name || ''}
              onChange={(e) => handleCollectionMetadataChange('name', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="collection-description">Collection Description</Label>
            <PlateEditor
              initialValue={[{ type: 'p', children: [{ text: featureCollection.description }] }]}
              onChange={(value) => handleCollectionMetadataChange('description', JSON.stringify(value))}
              value={[{ type: 'p', children: [{ text: featureCollection.description }] }]}
              readOnly={!isEditing}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          {featureCollection.features.map((feature) => (
            <GeometryEditor
              key={feature.properties?.id}
              feature={feature}
              mode={isEditing ? 'edit' : 'view'}
              onChange={handleFeatureChange}
            />
          ))}
          <Button onClick={handleSaveChanges} disabled={!unsavedChanges} className="mt-4 mr-2">
            Save Changes
          </Button>
          <Button onClick={stopEditing} variant="outline" className="mt-4">
            Cancel
          </Button>
        </>
      ) : (
        <>
          <p>Name: {featureCollection.name}</p>
          <p>Description: {featureCollection.description}</p>
          <p>Features: {featureCollection.features.length}</p>
          {featureCollection.features.map((feature) => (
            <GeometryEditor
              key={feature.properties?.id}
              feature={feature}
              mode={isEditing ? 'edit' : 'view'}
              onChange={handleFeatureChange}
            />
          ))}
          <Button onClick={startEditing} className="mt-4">
            Edit Collection
          </Button>
        </>
      )}
    </ScrollArea>
  );
};

export default RightSidebar;
