import { publishFeatureCollection } from '@earthly-land/common';
import NDK, { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { basicFeatureCollection } from '../fixtures/simple-feature-collection.js';
import { multiGeoFeatureCollectionSEED } from '../fixtures/multi-geo-feature-collection.js';
import { devUser1 } from '../fixtures/users.js';



const RELAY_URL = 'ws://localhost:3334';

const featuresToPublish = [basicFeatureCollection, multiGeoFeatureCollectionSEED.featureCollection]

const ndk = new NDK({
    explicitRelayUrls: [RELAY_URL],
    signer: new NDKPrivateKeySigner(devUser1.sk),
});

export async function seedFeatures() {
    console.log('Connecting to relay...');
    try {
        await ndk.connect();
        console.log('Connected to relay successfully');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Add longer delay after connection
    } catch (error) {
        console.error('Failed to connect to relay:', error);
        process.exit(1);
    }

    for (const featureCollection of featuresToPublish) {
        try {
            const result = await publishFeatureCollection(ndk, featureCollection)
            console.log(`Published feature ${result?.id}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay between publishes
        } catch (error) {
            console.error(`Error publishing feature ${featureCollection.type}:`, error);
        }
    }
}