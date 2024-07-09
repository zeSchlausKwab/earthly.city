'use client';

import { featureDiscoveryStore } from '@/lib/store/feature-discovery';
import { ndkStore } from '@/lib/store/ndk';
import { groupDiscoveryStore } from '@/lib/store/group-discovery';
import { useEffect } from 'react';

async function initializeStores() {
    ndkStore.initialize().catch(console.error);
    await featureDiscoveryStore.subscribeToFeatures();
    await groupDiscoveryStore.subscribeToGroups();
}

const Header = () => {
    useEffect(() => {
        initializeStores();
    }, []);
    return (
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">Earthly Land</h1>
        </header>
    );
};

export default Header;
