// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.misaka-9982.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    processor: unified(),
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
