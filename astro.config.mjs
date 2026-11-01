// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeTypst from './plugins/rehype-typst-scoped.mjs';
import remarkPele from './plugins/remark-pele.mjs';

export default defineConfig({
  site: 'https://airtomatop.github.io',

  devToolbar: {
    enabled: false,
  },

  markdown: {
    shikiConfig: {
    theme: 'rose-pine-dawn',
    },
    processor: unified({
      remarkPlugins: [remarkMath, remarkPele],
      rehypePlugins: [rehypeTypst],
    }),
  },
});