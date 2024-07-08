'use client';

import { useAtom } from 'jotai';
import { editingFeatureAtom, focusedCollectionsAtom } from '../lib/store';

const FocusedSidebar = () => {
    const [focusedCollections] = useAtom(focusedCollectionsAtom);
    const [editingFeature, setEditingFeature] = useAtom(editingFeatureAtom);

    const handleSave = () => {
        console.log('Saving feature:', editingFeature);
        setEditingFeature(null);
    };

    return (
        <div>
            {editingFeature && (
                <div className="mb-4 p-2 bg-white rounded shadow">
                    <h3 className="font-semibold">Editing Feature</h3>
                    <textarea
                        value={JSON.stringify(editingFeature, null, 2)}
                        onChange={(e) => setEditingFeature(JSON.parse(e.target.value))}
                        className="w-full p-2 border rounded mt-2"
                    />
                    <button
                        onClick={handleSave}
                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            )}

            {focusedCollections.map((collection, index) => (
                <div key={index} className="mb-2 p-2 bg-white rounded shadow">
                    <h3 className="font-semibold">{collection.title}</h3>
                    <p>{collection.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FocusedSidebar;