import React, { useEffect } from 'react';
import { useCollectionDiscovery } from '@/lib/store/collectionDiscovery';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

const DiscoveredCollections: React.FC = () => {
    const { discoveredCollections, startSubscription, stopSubscription } = useCollectionDiscovery();

    useEffect(() => {
        startSubscription();
        return () => stopSubscription();
    }, [startSubscription, stopSubscription]);

    const handleViewCollection = (collectionId: string) => {
        // Implement view logic (e.g., update selected collection in right sidebar)
    };

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-4">
                <h2 className="font-bold mb-4">Discovered Collections</h2>
                {discoveredCollections.map((collection) => (
                    <Card key={collection.id} className="mb-2">
                        <CardHeader>
                            <CardTitle>{collection.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{collection.description}</p>
                            <Button onClick={() => handleViewCollection(collection.id)}>View</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default DiscoveredCollections;