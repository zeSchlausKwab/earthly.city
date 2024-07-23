import { ndkStore } from '@/lib/store/ndk';
import { FeatureCollection } from 'geojson';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export const publishFeatureCollectionEvent = async (featureCollection: FeatureCollection): Promise<NDKEvent | null> => {
    const ndk = ndkStore.getNDK();

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

export const updateFeatureCollectionEvent = async (featureCollection: FeatureCollection): Promise<NDKEvent | null> => {
    const ndk = ndkStore.getNDK();
    const newEvent = new NDKEvent(ndk)

    newEvent.kind = 37515;
    newEvent.content = JSON.stringify(featureCollection);
    newEvent.tags = [
        ['d', featureCollection.id || 'default'],
        ['name', featureCollection.name || 'Unnamed Collection'],
        ['description', featureCollection.description || ''],
    ];

    try {
        await newEvent.publish();
        return newEvent;
    } catch (error) {
        console.error('Error updating feature collection event:', error);
        return null;
    }
};