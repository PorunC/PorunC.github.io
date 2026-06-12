// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.misaka-9982.com',
  trailingSlash: 'always',
  integrations: [sitemap(), mdx()],
  markdown: {
    processor: unified(),
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
