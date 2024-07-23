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

    const filter = {
        kinds: [37515],
        '#d': [featureCollection.id || 'default'],
    };

    console.log('Filter:', filter);
    console.log('Feature collection:', featureCollection);

    const existingEvents = await ndk.fetchEvents(filter);

    console.log('Existing events:', existingEvents);

    if (existingEvents.length === 0) {
        return publishFeatureCollectionEvent(featureCollection);
    }

    const existingEvent = existingEvents[0];
    existingEvent.content = JSON.stringify(featureCollection);
    existingEvent.tags = [
        ['d', featureCollection.id || 'default'],
        ['name', featureCollection.name || 'Unnamed Collection'],
        ['description', featureCollection.description || ''],
    ];

    try {
        await existingEvent.publish();
        return existingEvent;
    } catch (error) {
        console.error('Error updating feature collection event:', error);
        return null;
    }
};