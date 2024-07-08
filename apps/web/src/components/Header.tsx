'use client';

import { featureDiscoveryStore } from '@/lib/store/feature-discovery';
import { ndkStore } from '@/lib/store/ndk';
import { useEffect } from 'react';


const Header = () => {
    useEffect(() => {
        featureDiscoveryStore.subscribeToFeatures();
        ndkStore.connect();
    }, []);
    return (
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">Earthly Land</h1>
        </header>
    );
};

export default Header;
