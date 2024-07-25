import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ndkAtom } from '@/lib/store';
import { createCollection } from '@/lib/api/collection';
import { useFeatureCollection } from '@/lib/store/featureCollection';

interface CollectionFormProps {
    onSubmit: (collectionId: string) => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ onSubmit }) => {
    const { stopEditing } = useFeatureCollection();
    const [ndk] = useAtom(ndkAtom);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ndk) {
            const collectionId = await createCollection(ndk, name, description);
            onSubmit(collectionId);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Collection Name"
                    required
                />
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                />
                <Button type="submit">Create Collection</Button>
            </form>
            <Button onClick={stopEditing} variant="outline" className="mt-4">
                Cancel
            </Button>
        </div>
    );
};

export default CollectionForm;
