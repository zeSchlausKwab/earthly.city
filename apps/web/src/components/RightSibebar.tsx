"use client";

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { editStateAtom, setPropertyAtom, clearEditStateAtom, addFeatureAtom, updateFeatureAtom, removeFeatureAtom, publishFeatureAtom } from '../lib/store/edit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Group } from '@/lib/store/group-discovery';
import { FeatureCollectionWithId } from './DiscoverySidebar';
import { FeatureCollection, Feature } from 'geojson';
import { FeatureList } from './features/view/FeatureList';
import { FeatureEditList } from './features/edit/FeatureEditList';
import { toast } from './ui/use-toast';
import { publishFeature } from '@/lib/nostr/publishFeature';

type Mode = 'view' | 'create' | 'edit' | 'moderate';
type EntityType = 'feature' | 'group';

const RightSidebar: React.FC = () => {
    const [mode, setMode] = useState<Mode>('view');
    const [entityType, setEntityType] = useState<EntityType>('feature');
    const [editState, setEditState] = useAtom(editStateAtom);
    const [, setProperty] = useAtom(setPropertyAtom);
    const [, clearEditState] = useAtom(clearEditStateAtom);
    const [, addFeature] = useAtom(addFeatureAtom);
    const [, updateFeature] = useAtom(updateFeatureAtom);
    const [, removeFeature] = useAtom(removeFeatureAtom);
    const [, publishFeature] = useAtom(publishFeatureAtom);

    const [isPublishing, setIsPublishing] = useState(false);

    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

    useEffect(() => {
        if (editState.featureCollection.features.length > 0 && !selectedFeatureId) {
            setSelectedFeatureId(editState.featureCollection.features[0].properties?.id || null);
        }
    }, [editState, selectedFeatureId]);

    const handlePropertyChange = (featureId: string, key: string, value: string) => {
        setProperty(featureId, key, value);
    };

    const handleFeatureChange = (featureId: string, updatedFeature: Feature) => {
        updateFeature(updatedFeature);
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
            setMode('view');
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
            addFeature(feature);
            setMode('edit');
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
            addFeature(clonedFeature);
            setMode('edit');
            toast({
                title: "Info",
                description: "You've cloned this feature. You can now edit and publish it as your own.",
            });
        }
    };

    const renderFeatureView = () => (
        <FeatureList
            features={editState.featureCollection.features}
            onSelectFeature={(feature) => setSelectedFeatureId(feature.properties?.id || null)}
        />
    );

    const renderGroupView = (group: Group) => (
        <div>
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p>Kind: {group.kind}</p>
            <p>{group.about}</p>
            {/* Add more group details as needed */}
        </div>
    );

    const renderFeatureEdit = () => {
        const feature = editState.featureCollection.features.find(f => f.properties?.id === selectedFeatureId);
        if (!feature) return null;

        return (
            <div className="space-y-4">
                {Object.entries(feature.properties || {}).map(([key, value]) => (
                    <div key={key}>
                        <Label htmlFor={key}>{key}</Label>
                        <Input
                            id={key}
                            value={value as string}
                            onChange={(e) => handlePropertyChange(selectedFeatureId!, key, e.target.value)}
                        />
                    </div>
                ))}
                <Button onClick={() => handlePropertyChange(selectedFeatureId!, `property-${Date.now()}`, '')}>
                    Add Property
                </Button>
            </div>
        );
    };

    const renderGroupEdit = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="group-name">Name</Label>
                <Input id="group-name" value="" onChange={(e) => { }} />
            </div>
            <div>
                <Label htmlFor="group-about">About</Label>
                <Textarea id="group-about" value="" onChange={(e) => { }} />
            </div>
            {/* Add more group fields as needed */}
        </div>
    );

    const renderModeration = () => (
        <div>
            {/* Add moderation tools here */}
            <h3 className="text-lg font-semibold">Moderation Tools</h3>
            {/* Example: */}
            <Button>Approve Post</Button>
            <Button variant="destructive">Remove Post</Button>
        </div>
    );

    return (
        <div className="h-full flex flex-col p-4">
            <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
                <TabsList>
                    <TabsTrigger value="view">View</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
            </Tabs>

            <ScrollArea className="flex-grow mt-4">
                {mode === 'view' && (
                    <FeatureList
                        features={editState.featureCollection.features}
                        onSelectFeature={handleEditFeature}
                    />
                )}
                {mode === 'edit' && (
                    <FeatureEditList
                        features={editState.featureCollection.features}
                        onFeatureChange={handleFeatureChange}
                    />
                )}
            </ScrollArea>

            {mode === 'edit' && (
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