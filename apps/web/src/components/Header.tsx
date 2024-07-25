'use client';

import { useNDK } from '@/lib/store/ndk';
import { useEffect } from 'react';

const Header = () => {
    const { initialize } = useNDK();

    useEffect(() => {
        initialize().catch(console.error);
    }, [initialize]);

    return (
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">Earthly Land</h1>
        </header>
    );
};

export default Header;