"use client";

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { editStateAtom, clearEditStateAtom, addFeatureAtom, updateFeatureCollectionAtom, publishFeatureAtom } from '../lib/store/edit';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeatureCollection, Feature } from 'geojson';
import { FeatureList } from './features/view/FeatureList';
import { FeatureEditList } from './features/edit/FeatureEditList';
import { toast } from './ui/use-toast';
import { ndkStore } from '@/lib/store/ndk';

const RightSidebar: React.FC = () => {
    const [editState, setEditState] = useAtom(editStateAtom);
    const [, clearEditState] = useAtom(clearEditStateAtom);
    const [, addFeature] = useAtom(addFeatureAtom);
    const [, updateFeatureCollection] = useAtom(updateFeatureCollectionAtom);
    const [, publishFeature] = useAtom(publishFeatureAtom);

    const [isPublishing, setIsPublishing] = useState(false);

    const handleFeatureCollectionChange = (updatedFeatureCollection: FeatureCollection) => {
        updateFeatureCollection(updatedFeatureCollection);
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await publishFeature();
            toast({
                title: "Success",
                description: "Feature published successfully",
            });
            clearEditState();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to publish feature. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleEditFeature = (feature: Feature) => {
        const ndk = ndkStore.getNDK();
        if (feature.properties?.pubkey === ndk.activeUser?.pubkey) {
            // If the feature belongs to the current user, edit it
            setEditState(prev => ({
                ...prev,
                featureCollection: {
                    type: 'FeatureCollection',
                    features: [feature]
                },
                mode: 'edit'
            }));
        } else {
            // If the feature doesn't belong to the current user, clone it
            const clonedFeature: Feature = {
                ...feature,
                properties: {
                    ...feature.properties,
                    id: undefined, // Remove the original id
                    pubkey: ndk.activeUser?.pubkey, // Set the current user as the owner
                }
            };
            setEditState(prev => ({
                ...prev,
                featureCollection: {
                    type: 'FeatureCollection',
                    features: [clonedFeature]
                },
                mode: 'edit'
            }));
            toast({
                title: "Info",
                description: "You've cloned this feature. You can now edit and publish it as your own.",
            });
        }
    };

    return (
        <div className="h-full flex flex-col p-4">
            <div className="mb-4">
                <strong>Mode: </strong>
                {editState.mode}
            </div>
            <ScrollArea className="flex-grow">
                {editState.mode === 'view' ? (
                    <FeatureList
                        features={editState.featureCollection.features}
                        onSelectFeature={handleEditFeature}
                    />
                ) : (
                    <FeatureEditList
                        featureCollection={editState.featureCollection}
                        onFeatureCollectionChange={handleFeatureCollectionChange}
                    />
                )}
            </ScrollArea>
            {editState.mode !== 'view' && (
                <Button
                    className="mt-4"
                    onClick={handlePublish}
                    disabled={isPublishing}
                >
                    {isPublishing ? 'Publishing...' : 'Publish Changes'}
                </Button>
            )}
        </div>
    );
};

export default RightSidebar;