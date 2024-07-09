// lib/nostr/publishFeature.ts
import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { FeatureCollection } from 'geojson';
import { ndkStore } from '../store/ndk';

export async function publishFeature(featureCollection: FeatureCollection) {
    const ndk = ndkStore.getNDK();

    if (!ndk) {
        throw new Error('NDK not initialized');
    }

    // Ensure we have a signer
    if (!ndk.signer) {
        throw new Error('No signer available');
    }

    const pubkey = await ndk.activeUser?.pubkey

    if (!pubkey) {
        throw new Error('No pubkey available');
    }

    const event = new NDKEvent(ndk, {
        kind: 37515 as NDKKind,
        created_at: Math.floor(Date.now() / 1000),
        pubkey: pubkey,
        content: JSON.stringify(featureCollection),
        tags: [
            ['d', featureCollection.features[0].properties?.id || ''],
            ['g', 'geohash_here'], // You'll need to implement geohash generation
            // Add any other necessary tags
        ],
    });

    try {
        await event.publish();
        console.log('Feature published successfully');
        return event;
    } catch (error) {
        console.error('Error publishing feature:', error);
        throw error;
    }
}