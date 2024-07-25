import NDK, { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { FeatureCollection } from '../types';

export interface Collection {
    id: string;
    name: string;
    description: string;
    featureCollections: FeatureCollection[];
}

export const createCollection = async (ndk: NDK, name: string, description: string): Promise<string> => {
    const event = new NDKEvent(ndk);
    event.kind = 30007 as NDKKind;
    event.content = JSON.stringify({ name, description });
    event.tags = [['d', `collection-${Date.now()}`]];

    await event.publish();
    return event.id;
};

export const addFeatureCollectionToCollection = async (ndk: NDK, collectionId: string, featureCollectionId: string): Promise<void> => {
    const event = new NDKEvent(ndk);
    event.kind = 30007 as NDKKind;
    event.tags = [
        ['e', collectionId],
        ['e', featureCollectionId, 'feature']
    ];
    await event.publish();
};

export const getCollection = async (ndk: NDK, collectionId: string): Promise<Collection> => {
    const event = await ndk.fetchEvent({ ids: [collectionId] });
    if (!event) throw new Error('Collection not found');

    const content = JSON.parse(event.content);
    const featureCollections: FeatureCollection[] = [];

    // Fetch all feature collections referenced in this collection
    const relatedEvents = await ndk.fetchEvents({ '#e': [collectionId] });
    for (const relatedEvent of relatedEvents) {
        const featureTag = relatedEvent.tags.find(tag => tag[0] === 'e' && tag[2] === 'feature');
        if (featureTag) {
            const featureEvent = await ndk.fetchEvent({ ids: [featureTag[1]] });
            if (featureEvent) {
                featureCollections.push(JSON.parse(featureEvent.content));
            }
        }
    }

    return {
        id: collectionId,
        name: content.name,
        description: content.description,
        featureCollections
    };
};

export const subscribeToCollections = (ndk: NDK, callback: (collection: Collection) => void) => {
    const filter: NDKFilter = { kinds: [30007 as NDKKind] };
    const subscription = ndk.subscribe(filter, { closeOnEose: false });

    subscription.on('event', (event: NDKEvent) => {
        console.log('Collection event:', event);
        try {
            const content = JSON.parse(event.content);
            const newCollection: Collection = {
                id: event.id,
                name: content.name,
                description: content.description,
                featureCollections: [],  // We'll need to fetch these separately
            };
            callback(newCollection);
        } catch (error) {
            console.error('Error parsing collection event:', error);
        }
    });

    return () => {
        subscription.stop();
    };
};
