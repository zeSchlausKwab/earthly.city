'use client';

import { createPlugins, Plate } from '@udecode/plate-common';
import { createDeserializeMdPlugin } from '@udecode/plate-serializer-md';

import { Editor } from './plate-ui/editor';

const plugins = createPlugins([
    createDeserializeMdPlugin(),

], {
    components: {},
});

export function PlateEditor({ initialValue }: { initialValue: any }) {
    return (
        <Plate plugins={plugins} initialValue={initialValue}>
            <Editor placeholder="Type your message here." />
        </Plate>
    );
}