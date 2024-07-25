// src/api/ndk.ts
import NDK, { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { FeatureCollection, DiscoveredFeature } from '../types';

export const subscribeToFeatures = (ndk: NDK, callback: (feature: DiscoveredFeature) => void) => {
    const filter: NDKFilter = { kinds: [37515 as NDKKind] };
    const subscription = ndk.subscribe(filter, { closeOnEose: false });

    subscription.on('event', (event: NDKEvent) => {
        try {
            const content = JSON.parse(event.content);
            if (content.type === 'FeatureCollection') {
                const newFeature: DiscoveredFeature = {
                    id: event.id,
                    pubkey: event.pubkey,
                    naddr: event.naddr,
                    createdAt: event.created_at ?? 0,
                    featureCollection: content,
                    name: event.tagValue('name'),
                    description: event.tagValue('description'),
                };
                callback(newFeature);
            }
        } catch (error) {
            console.error('Error parsing feature event:', error);
        }
    });

    return () => {
        subscription.stop();
    };
};

export const publishFeatureCollection = async (ndk: NDK, featureCollection: FeatureCollection): Promise<NDKEvent | null> => {
    const event = new NDKEvent(ndk);
    event.kind = 37515;
    event.content = JSON.stringify(featureCollection);
    event.tags = [
        ['d', featureCollection.id || 'default'],
        ['name', featureCollection.name || 'Unnamed Collection'],
        ['description', featureCollection.description || ''],
    ];

    try {
        await event.publish();
        return event;
    } catch (error) {
        console.error('Error publishing feature collection event:', error);
        return null;
    }
};

export const updateFeatureCollection = async (ndk: NDK, featureCollection: FeatureCollection): Promise<NDKEvent | null> => {
    return publishFeatureCollection(ndk, featureCollection);
};