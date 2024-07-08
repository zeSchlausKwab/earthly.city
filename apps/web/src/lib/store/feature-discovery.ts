import { createStore, Store } from 'tinybase';
import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { FeatureCollection } from 'geojson';
import { ndkStore } from './ndk';

class FeatureDiscoveryStore {
    private store: Store;
    private readonly CACHE_KEY = 'nostr_features_cache';

    constructor() {
        this.store = createStore();
        this.store.setTable('features', {});
        this.loadFromCache();
    }

    private loadFromCache() {
        if (typeof window !== 'undefined') {
            const cachedData = localStorage.getItem(this.CACHE_KEY);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                this.store.setTable('features', parsedData);
            }
        }
    }

    private saveToCache() {
        if (typeof window !== 'undefined') {
            const data = this.store.getTable('features');
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        }
    }

    async subscribeToFeatures(): Promise<void> {
        const ndk = ndkStore.getNDK();
        const filter: NDKFilter = { kinds: [37515 as NDKKind], limit: 100 };
        const sub = ndk.subscribe(filter);

        sub.on('event', (event: NDKEvent) => {
            this.handleFeatureEvent(event);
        });
    }

    private handleFeatureEvent(event: NDKEvent) {
        try {
            const content = JSON.parse(event.content);
            console.log('Received feature event:', event.id, content);
            if (this.isValidFeatureCollection(content)) {
                this.store.setRow('features', event.id, {
                    id: event.id,
                    featureCollection: JSON.stringify(content),
                });
                this.saveToCache();
            } else {
                console.warn('Received event is not a valid FeatureCollection:', event.id);
            }
        } catch (error) {
            console.error('Error parsing feature event:', error);
        }
    }

    private isValidFeatureCollection(obj: any): obj is FeatureCollection {
        return (
            obj &&
            typeof obj === 'object' &&
            obj.type === 'FeatureCollection' &&
            Array.isArray(obj.features) &&
            obj.features.every((feature: any) =>
                feature.type === 'Feature' &&
                feature.geometry &&
                typeof feature.geometry === 'object' &&
                feature.geometry.type &&
                feature.geometry.coordinates
            )
        );
    }

    getStore(): Store {
        return this.store;
    }

    getAllFeatures(): FeatureCollection[] {
        const features = this.store.getTable('features');
        return Object.values(features)
            .map(feature => JSON.parse(feature.featureCollection as string))
            .filter(fc => this.isValidFeatureCollection(fc));
    }
}

export const featureDiscoveryStore = new FeatureDiscoveryStore();