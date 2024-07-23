"use client"

import { atom, useAtom } from 'jotai';
import NDK, { NDKEvent, NDKFilter, NDKKind, NDKSubscription } from '@nostr-dev-kit/ndk';
import { FeatureCollection } from 'geojson';
import { ndkStore } from './ndk';
import { nip19 } from 'nostr-tools'

interface DiscoveredFeature {
    id: string;
    naddr: string;
    pubkey: string;
    createdAt: number;
    featureCollection: FeatureCollection;
    name?: string;
    description?: string;
}

const discoveredFeaturesAtom = atom<DiscoveredFeature[]>([]);

export const useFeatureDiscovery = () => {
    const [discoveredFeatures, setDiscoveredFeatures] = useAtom(discoveredFeaturesAtom);

    const subscribeToFeatures = () => {
        const ndk = ndkStore.getNDK();
        const filter: NDKFilter = { kinds: [37515 as NDKKind] };

        const subscription = ndk.subscribe(filter, { closeOnEose: false });

        subscription.on('event', (event: NDKEvent) => {
            try {
                const content = JSON.parse(event.content);
                if (content.type === 'FeatureCollection') {
                    const newFeature: DiscoveredFeature = {
                        id: event.id,
                        pubkey: event.pubkey,
                        naddr: nip19.naddrEncode({
                            identifier: event.tagValue('d'),
                            pubkey: event.pubkey,
                            kind: 37515,
                        }),
                        createdAt: event.created_at ?? 0, // Use 0 or another appropriate default
                        featureCollection: content,
                        name: event.tagValue('name'),
                        description: event.tagValue('description'),
                    };

                    console.log('Discovered feature:', newFeature);

                    setDiscoveredFeatures((prev) => [...prev, newFeature]);
                }
            } catch (error) {
                console.error('Error parsing feature event:', error);
            }
        });

        return () => {
            subscription.stop();
        };
    };

    return {
        discoveredFeatures,
        subscribeToFeatures,
    };
};