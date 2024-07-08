import { createStore, Store } from 'tinybase';
import NDK, {
    NDKEvent, NDKFilter, NDKKind
} from '@nostr-dev-kit/ndk';
import { FeatureCollection } from 'geojson';

interface FeatureEvent {
    id: string;
    featureCollection: FeatureCollection;
}

class NostrStore {
    private store: Store;
    private ndk: NDK;

    constructor() {
        this.store = createStore();
        this.store.setTable('features', {});
        this.ndk = new NDK({
            explicitRelayUrls: ['wss://purplepag.es',
                'wss://relay.nostr.band',
                'wss://nos.lol',
                'wss://bouncer.nostree.me',
                'wss://nostr.land/',
                'wss://purplerelay.com/',]
        });
    }

    async connectAndSubscribe() {
        await this.ndk.connect();

        const filter: NDKFilter = { kinds: [37515 as NDKKind], limit: 10};
        const sub = this.ndk.subscribe(filter);

        sub.on('event', (event: NDKEvent) => {
            this.handleFeatureEvent(event);
        });
    }

    private handleFeatureEvent(event: NDKEvent) {
        try {
            const featureCollection = JSON.parse(event.content) as FeatureCollection;
            this.store.setRow('features', event.id, {
                id: event.id,
                featureCollection: JSON.stringify(featureCollection),
            });
        } catch (error) {
            console.error('Error parsing feature event:', error);
        }
    }

    getStore() {
        return this.store;
    }

    getAllFeatures(): FeatureCollection[] {
        const features = this.store.getTable('features');
        return Object.values(features).map(feature => JSON.parse(feature.featureCollection as string));
    }
}

export const nostrStore = new NostrStore();