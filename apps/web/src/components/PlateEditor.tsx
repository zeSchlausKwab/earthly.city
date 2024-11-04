'use client'

import { Value } from '@udecode/plate-common'
import { TPlateEditor, usePlateEditor } from '@udecode/plate-common/react'
import { useCallback } from 'react'
import { Textarea } from './ui/textarea'

interface PlateEditorProps {
  onChange: (value: string) => void
  readOnly: boolean
  initialValue?: string
}

export function PlateEditor({ onChange, readOnly, initialValue = '' }: PlateEditorProps) {
  const editor = usePlateEditor({
    id: 'plate-editor',
    plugins: [],
    value: initialValue,
  })

  const handleChange = useCallback(
    ({ value }: { editor: TPlateEditor; value: Value }) => {
      console.log('New value', value)

      // const stringValue = JSON.stringify(newValue)
      onChange(value[0].text as string)
    },
    [onChange]
  )

  return (
    <Textarea
      value={initialValue}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    />
    // <Plate editor={editor} onChange={handleChange} readOnly={readOnly}>
    //   <Editor placeholder="Type your message here." />
    // </Plate>
  )
}
