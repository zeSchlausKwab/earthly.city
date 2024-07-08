'use client';

import { useAtom } from 'jotai';
import { discoveryItemsAtom } from '../lib/store';

const DiscoverySidebar = () => {
    const [discoveryItems] = useAtom(discoveryItemsAtom);

    return (
        <div>
            {discoveryItems.map((item, index) => (
                <div key={index} className="mb-2 p-2 bg-white rounded shadow">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    );
};

export default DiscoverySidebar;