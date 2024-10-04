'use client'

import { withProps } from '@udecode/cn'
import { createPlugins, Plate, PlateContent, PlateElement, PlateLeaf, Value } from '@udecode/plate-common'
import {
  createHeadingPlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/plate-heading'
import {
  createListPlugin,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
  createTodoListPlugin,
  ELEMENT_TODO_LI,
} from '@udecode/plate-list'
import { createTablePlugin, ELEMENT_TABLE, ELEMENT_TR, ELEMENT_TD, ELEMENT_TH } from '@udecode/plate-table'
import {
  createBoldPlugin,
  MARK_BOLD,
  createItalicPlugin,
  MARK_ITALIC,
  createUnderlinePlugin,
  MARK_UNDERLINE,
  createStrikethroughPlugin,
  MARK_STRIKETHROUGH,
  createCodePlugin,
  MARK_CODE,
  createSubscriptPlugin,
  MARK_SUBSCRIPT,
  createSuperscriptPlugin,
  MARK_SUPERSCRIPT,
} from '@udecode/plate-basic-marks'
import { createDeserializeMdPlugin, serializeMd } from '@udecode/plate-serializer-md'

import { HeadingElement } from '@/components/plate-ui/heading-element'
import { ListElement } from '@/components/plate-ui/list-element'
// import { TableElement } from '@/components/plate-ui/table-element'
// import { TableRowElement } from '@/components/plate-ui/table-row-element'
// import { TableCellElement, TableCellHeaderElement } from '@/components/plate-ui/table-cell-element'
import { TodoListElement } from '@/components/plate-ui/todo-list-element'
import { CodeLeaf } from '@/components/plate-ui/code-leaf'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'

import { Editor } from './plate-ui/editor'
import { useRef } from 'react'

const plugins = createPlugins(
  [
    createHeadingPlugin(),
    createListPlugin(),
    createTablePlugin(),
    createTodoListPlugin(),
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createDeserializeMdPlugin(),
  ],
  {
    components: {
      [ELEMENT_H1]: withProps(HeadingElement, { variant: 'h1' }),
      [ELEMENT_H2]: withProps(HeadingElement, { variant: 'h2' }),
      [ELEMENT_H3]: withProps(HeadingElement, { variant: 'h3' }),
      [ELEMENT_H4]: withProps(HeadingElement, { variant: 'h4' }),
      [ELEMENT_H5]: withProps(HeadingElement, { variant: 'h5' }),
      [ELEMENT_H6]: withProps(HeadingElement, { variant: 'h6' }),
      [ELEMENT_UL]: withProps(ListElement, { variant: 'ul' }),
      [ELEMENT_OL]: withProps(ListElement, { variant: 'ol' }),
      [ELEMENT_LI]: withProps(PlateElement, { as: 'li' }),
      //   [ELEMENT_TABLE]: TableElement,
      //   [ELEMENT_TR]: TableRowElement,
      //   [ELEMENT_TD]: TableCellElement,
      //   [ELEMENT_TH]: TableCellHeaderElement,
      [ELEMENT_TODO_LI]: TodoListElement,
      [MARK_BOLD]: withProps(PlateLeaf, { as: 'strong' }),
      [MARK_CODE]: CodeLeaf,
      [MARK_ITALIC]: withProps(PlateLeaf, { as: 'em' }),
      [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: 's' }),
      [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: 'sub' }),
      [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: 'sup' }),
      [MARK_UNDERLINE]: withProps(PlateLeaf, { as: 'u' }),
    },
  }
)

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
  let editor = useRef(null)

  const handleChangeAndDeserialize = (value: Value) => {
    const contentMd = serializeMd(editor, { nodes: value })
    console.log(contentMd)
    // onChange(contentMd)
  }

  return (
    <Plate
      plugins={plugins}
      readOnly={readOnly}
      initialValue={initialValue}
      editorRef={editor}
      value={value}
      onChange={handleChangeAndDeserialize}
    >
      <FixedToolbar>
        <FixedToolbarButtons />
      </FixedToolbar>

      <Editor />
    </Plate>
  )
}
