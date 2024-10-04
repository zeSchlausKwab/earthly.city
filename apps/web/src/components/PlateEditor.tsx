'use client'

import { Editor } from '@/components/plate-ui/editor'
import { Plate, usePlateEditor } from '@udecode/plate-common/react'
// import { Value } from '@udecode/slate'

export function PlateEditor({
  initialValue,
  onChange,
  value,
  readOnly,
}: {
  initialValue: any
  onChange: (value: Value) => void
  value: Value
  readOnly: boolean
}) {
  // let editor = useRef(null)

  const editor = usePlateEditor({
    id: 'plate-editor',
    plugins: [],
    value: [
      {
        id: '1',
        type: 'p',
        children: [{ text: '' }],
      },
    ],
  })
  const handleChangeAndDeserialize = (value: Value) => {
    // const contentMd = serializeMd(editor, { nodes: value })

    const editorValue = editor.api

    console.log('editorValue', editorValue)
    onChange(value)
  }

  return (
    <Plate
      editor={editor}
      readOnly={readOnly}
      initialValue={initialValue}
      value={value}
      onChange={handleChangeAndDeserialize}
    >
      <Editor placeholder="Type your message here." />
    </Plate>
  )
}
