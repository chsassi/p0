import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  integrations: [
    compress({
      html: {
        comments: false,
      },
      css: true,
      js: true,
      img: false,
    }),
  ],
});