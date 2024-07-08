'use client';

import { featureDiscoveryStore } from "../lib/store/feature-discovery";
import { FeatureCollection } from 'geojson';
import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeatureCollectionWithId extends FeatureCollection {
    id: string;
}

const FeatureCard: React.FC<{ feature: FeatureCollectionWithId }> = ({ feature }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Feature ID: {feature.id.slice(0, 8)}...</h3>
            <p className="text-sm mb-1">Type: {feature.type}</p>
            <p className="text-sm mb-1">Features: {feature.features.length}</p>
            <p className="text-sm mb-1">
                Geometry Types: {Array.from(new Set(feature.features.map(f => f.geometry.type))).join(', ')}
            </p>
            {feature.bbox && (
                <p className="text-sm">Bounding Box: [{feature.bbox.join(', ')}]</p>
            )}
        </div>
    );
};

const DiscoverySidebar = () => {
    const [features, setFeatures] = useState<FeatureCollectionWithId[]>([]);

    useEffect(() => {
        const updateFeatures = () => {
            const allFeatures = featureDiscoveryStore.getAllFeatures();
            setFeatures(allFeatures.map((fc, index) => ({ ...fc, id: fc.id || `feature-${index}` })));
        };

        const store = featureDiscoveryStore.getStore();
        const listenerId = store.addTableListener('features', updateFeatures);
        updateFeatures();

        return () => {
            store.delListener(listenerId);
        };
    }, []);

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Discovery</h2>
                {features.length === 0 ? (
                    <p>No features available.</p>
                ) : (
                    features.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))
                )}
            </div>
        </ScrollArea>
    );
};

export default DiscoverySidebar;