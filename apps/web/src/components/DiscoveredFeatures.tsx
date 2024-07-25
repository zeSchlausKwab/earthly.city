import React from 'react';
import { DiscoveredFeature, useFeatureDiscovery } from '@/lib/store/featureDiscovery';
import { useFeatureCollection } from '@/lib/store/featureCollection';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

const DiscoveredFeatures: React.FC = () => {
    const { discoveredFeatures } = useFeatureDiscovery();
    const { loadFeatureCollection, zoomToFeatureBounds } = useFeatureCollection();

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
                            <CardTitle className='text-emerald-700 text-md'>{feature.name || 'Unnamed Feature'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-gray-500">d:{feature.description}</span>
                            {/* <p>Created by: {feature.pubkey}</p>
                            <p>Naddr: {feature.naddr}</p> */}
                            <p>Created at: {new Date(feature.createdAt * 1000).toLocaleString()}</p>
                            <p>Features: {feature.featureCollection.features.length}</p>
                            <div className="mt-2 flex justify-end space-x-2">
                                <Button size="sm" onClick={() => handleView(feature)}>View</Button>
                                <Button size="sm" onClick={() => handleEdit(feature)}>Edit</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default DiscoveredFeatures;