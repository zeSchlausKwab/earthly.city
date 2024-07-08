'use client';

import { createPlugins, Plate } from '@udecode/plate-common';
import { createDeserializeMdPlugin } from '@udecode/plate-serializer-md';

import { Editor } from './plate-ui/editor';

const plugins = createPlugins([
    createDeserializeMdPlugin(),

], {
    components: {},
});

const initialValue = [
    {
        id: 1,
        type: 'p',
        children: [{ text: '' }],
    },
];

export function PlateEditor() {
    return (
        <Plate plugins={plugins} initialValue={initialValue}>
            <Editor placeholder="Type your message here." />
        </Plate>
    );
}