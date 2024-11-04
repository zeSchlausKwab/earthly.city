import {
  createPlugins,
  createParagraphPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
} from '@udecode/plate-common';

export const plugins = createPlugins([
  createParagraphPlugin(),
  createBlockquotePlugin(),
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createStrikethroughPlugin(),
]);