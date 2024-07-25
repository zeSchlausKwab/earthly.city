import React, { useEffect } from 'react';
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery';
import { useFeatureCollection } from '@/lib/store/featureCollection';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { DiscoveredFeature } from '@/lib/types';
import { useAtom } from 'jotai';
import { ndkAtom } from '@/lib/store';
import UserInfo from './UserInfo';

const DiscoveredFeatures: React.FC = () => {
    const { discoveredFeatures, startSubscription, stopSubscription } = useFeatureDiscovery();
    const { loadFeatureCollection, zoomToFeatureBounds, isEditing } = useFeatureCollection();
    const [ndk] = useAtom(ndkAtom);

    useEffect(() => {
        if (ndk) {
            startSubscription();
            return () => stopSubscription();
        }
    }, [ndk, startSubscription, stopSubscription]);


    const handleEdit = (feature: DiscoveredFeature) => {
        loadFeatureCollection(feature, true);
    };

    const handleView = (feature: DiscoveredFeature) => {
        loadFeatureCollection(feature, false);
        zoomToFeatureBounds(feature);

    };

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-4">
                <h2 className="font-bold mb-4">Discovered Features</h2>
                {discoveredFeatures.map((feature) => (
                    <Card key={feature.id} className="mb-2 text-xs">
                        <CardHeader>
                            <CardTitle className='text-emerald-700 flex justify-between text-md'>
                                <div className='flex flex-col'>
                                    <div>{feature.name || 'Unnamed Feature'}</div>
                                    <UserInfo pubkey={feature.pubkey} />
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="xs" onClick={() => handleView(feature)}>View</Button>
                                    <Button size="xs" onClick={() => handleEdit(feature)}>Edit</Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-gray-500">d:{feature.description}</span>
                            {/* <p>Created by: {feature.pubkey}</p>
                            <p>Naddr: {feature.naddr}</p> */}
                            <p>Created at: {new Date(feature.createdAt * 1000).toLocaleString()}</p>
                            <p>Features: {feature.featureCollection.features.length}</p>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default DiscoveredFeatures;