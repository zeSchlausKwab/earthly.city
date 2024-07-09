import { createStore, Store } from 'tinybase';
import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { ndkStore } from './ndk';
import { featureDiscoveryStore } from './feature-discovery';

export interface Group {
    id: string;
    kind: 30007 | 30008;
    name: string;
    about?: string;
    picture?: string;
    featureIds: string[];
}

class GroupDiscoveryStore {
    private store: Store;
    private readonly CACHE_KEY = 'nostr_groups_cache';

    constructor() {
        this.store = createStore();
        this.store.setTable('groups', {});
        this.loadFromCache();
    }

    private loadFromCache() {
        if (typeof window !== 'undefined') {
            const cachedData = localStorage.getItem(this.CACHE_KEY);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                this.store.setTable('groups', parsedData);
            }
        }
    }

    private saveToCache() {
        if (typeof window !== 'undefined') {
            const data = this.store.getTable('groups');
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        }
    }

    async subscribeToGroups(): Promise<void> {
        const ndk = ndkStore.getNDK();
        const filter: NDKFilter = { kinds: [30007 as NDKKind, 30008 as NDKKind] };
        const sub = ndk.subscribe(filter);

        sub.on('event', (event: NDKEvent) => {
            this.handleGroupEvent(event);
        });
    }

    private async handleGroupEvent(event: NDKEvent) {
        try {
            const content = JSON.parse(event.content);
            console.log('Received group event:', event.id, content);

            const group: Group = {
                id: event.id,
                kind: event.kind as 30007 | 30008,
                name: content.name || 'Unnamed Group',
                about: content.about,
                picture: content.picture,
                featureIds: [],
            };

            // Extract feature IDs from tags
            const featureTags = event.tags.filter(tag => tag[0] === 'a' && tag[1].startsWith('37515:'));
            group.featureIds = featureTags.map(tag => tag[1].split(':')[2]);

            this.store.setRow('groups', event.id, group);
            this.saveToCache();

            // Resolve associated features
            await this.resolveGroupFeatures(group);
        } catch (error) {
            console.error('Error parsing group event:', error);
        }
    }

    private async resolveGroupFeatures(group: Group) {
        const ndk = ndkStore.getNDK();
        for (const featureId of group.featureIds) {
            const filter: NDKFilter = { kinds: [37515], ids: [featureId] };
            const events = await ndk.fetchEvents(filter);
            events.forEach(event => {
                featureDiscoveryStore.handleFeatureEvent(event);
            });
        }
    }

    getStore(): Store {
        return this.store;
    }

    getAllGroups(): Group[] {
        const groups = this.store.getTable('groups');
        return Object.values(groups);
    }

    getGroupFeatures(groupId: string): string[] {
        const group = this.store.getRow('groups', groupId) as Group | undefined;
        return group ? group.featureIds : [];
    }
}

export const groupDiscoveryStore = new GroupDiscoveryStore();