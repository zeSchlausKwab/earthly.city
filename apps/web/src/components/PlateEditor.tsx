'use client';

import { createPlugins, Plate, Value } from '@udecode/plate-common';
import { createDeserializeMdPlugin } from '@udecode/plate-serializer-md';

import { Editor } from './plate-ui/editor';

const plugins = createPlugins([
    createDeserializeMdPlugin(),

], {
    components: {},
});

export function PlateEditor({ initialValue, onChange, value, readOnly }: { initialValue: any, onChange: (value: Value) => void, value: Value, readOnly: boolean }) {
    return (
        <Plate plugins={plugins} readOnly={readOnly} initialValue={initialValue} value={value} onChange={onChange}>
            <Editor placeholder="Type your message here." />
        </Plate>
    );
}