'use client';

import { featureDiscoveryStore } from "../lib/store/feature-discovery";
import { FeatureCollection } from 'geojson';
import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Group, groupDiscoveryStore } from "@/lib/store/group-discovery";
import FeatureCard from "@/FeatureCard";
import GroupCard from "./GroupCard";
import { useAtom } from "jotai";
import { addFeatureAtom, editStateAtom } from "@/lib/store/edit";
import { ndkStore } from "@/lib/store/ndk";
import { toast } from "./ui/use-toast";
import { zoomToFeatureCollectionAtom } from "./map/MapController";


export interface FeatureCollectionWithId extends FeatureCollection {
    id: string;
}

const DiscoverySidebar = () => {
    const [features, setFeatures] = useState<FeatureCollectionWithId[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [, setEditState] = useAtom(editStateAtom);
    const [, addFeature] = useAtom(addFeatureAtom);
    const [, setZoomToFeatureCollection] = useAtom(zoomToFeatureCollectionAtom);

    useEffect(() => {
        const updateFeatures = () => {
            const allFeatures = featureDiscoveryStore.getAllFeatures();
            setFeatures(allFeatures.map((fc, index) => ({ ...fc, id: fc.id || `feature-${index}` })));
        };

        const updateGroups = () => {
            const allGroups = groupDiscoveryStore.getAllGroups();
            setGroups(allGroups);
        };

        const featureStore = featureDiscoveryStore.getStore();
        const groupStore = groupDiscoveryStore.getStore();

        const featureListenerId = featureStore.addTableListener('features', updateFeatures);
        const groupListenerId = groupStore.addTableListener('groups', updateGroups);

        updateFeatures();
        updateGroups();

        return () => {
            featureStore.delListener(featureListenerId);
            groupStore.delListener(groupListenerId);
        };
    }, []);

    const handleEditFeatureCollection = (featureCollection: FeatureCollectionWithId) => {
        const ndk = ndkStore.getNDK();
        const pubkey = ndk.activeUser?.pubkey;

        if (featureCollection.features.every(f => f.properties?.pubkey === pubkey)) {
            setEditState(prevState => ({
                ...prevState,
                featureCollection: featureCollection
            }));
        } else {
            // If any feature doesn't belong to the current user, clone the entire collection
            const clonedFeatureCollection: FeatureCollectionWithId = {
                ...featureCollection,
                id: undefined, // Remove the original id
                features: featureCollection.features.map(feature => ({
                    ...feature,
                    properties: {
                        ...feature.properties,
                        id: undefined, // Remove the original id
                        pubkey: pubkey, // Set the current user as the owner
                    }
                }))
            };
            setEditState(prevState => ({
                ...prevState,
                featureCollection: clonedFeatureCollection
            }));
            toast({
                title: "Info",
                description: "You've cloned this feature collection. You can now edit and publish it as your own.",
            });
        }
    };

    const handleViewOnMap = (featureCollection: FeatureCollectionWithId) => {
        setZoomToFeatureCollection(featureCollection);
    };

    return (
        <Tabs defaultValue="groups" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="groups" className="flex-grow overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                        {groups.length === 0 ? (
                            <p>No groups available.</p>
                        ) : (
                            groups.map((group) => (
                                <GroupCard key={group.id} group={group} />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="features" className="flex-grow overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                        {features.length === 0 ? (
                            <p>No features available.</p>
                        ) : (
                            features.map((featureCollection) => (
                                <FeatureCard
                                    key={featureCollection.id}
                                    featureCollection={featureCollection}
                                    onEdit={handleEditFeatureCollection}
                                    onViewOnMap={handleViewOnMap}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
};

export default DiscoverySidebar;