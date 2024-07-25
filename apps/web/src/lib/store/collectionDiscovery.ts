import { useAtom } from 'jotai';
import { useRef, useCallback, useEffect } from 'react';
import { Collection, subscribeToCollections } from '../api/collection';
import { handleError } from '../utils/errorHandler';
import { discoveredCollectionsAtom, ndkAtom } from '../store'

export const useCollectionDiscovery = () => {
    const [discoveredCollections, setDiscoveredCollections] = useAtom(discoveredCollectionsAtom);
    const [ndk] = useAtom(ndkAtom);
    const subscriptionRef = useRef<(() => void) | null>(null);

    const startSubscription = useCallback(() => {
        if (!ndk || subscriptionRef.current) return;

        try {
            subscriptionRef.current = subscribeToCollections(ndk, (newCollection: Collection) => {
                setDiscoveredCollections((prev) => {
                    if (!prev.some(c => c.id === newCollection.id)) {
                        return [...prev, newCollection];
                    }
                    return prev;
                });
            });
        } catch (error) {
            handleError(error);
        }
    }, [ndk, setDiscoveredCollections]);

    const stopSubscription = useCallback(() => {
        if (subscriptionRef.current) {
            subscriptionRef.current();
            subscriptionRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => stopSubscription();
    }, [stopSubscription]);

    return {
        discoveredCollections,
        startSubscription,
        stopSubscription,
    };
};
