import React from 'react';
import { useFeatureDiscovery } from '@/lib/store/featureDiscovery';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

const DiscoveredFeatures: React.FC = () => {
    const { discoveredFeatures } = useFeatureDiscovery();

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-4">
                <h2 className="font-bold mb-4">Discovered Features</h2>
                {discoveredFeatures.map((feature) => (
                    <Card key={feature.naddr} className="mb-2 text-xs">
                        <CardHeader>
                            <CardTitle className='text-emerald-700 text-md'>{feature.name || 'Unnamed Feature'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-gray-500">d:{feature.description}</span>
                            <p>Created by: {feature.pubkey}</p>
                            <p>Naddr: {feature.naddr}</p>
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