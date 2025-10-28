import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  integrations: [
    compress({
      html: {
        comments: false,
      },
      css: true,  // opzionale: comprime anche i CSS
      js: true,   // opzionale: comprime anche i JS
      img: false, // lascia stare le immagini (più sicuro se non vuoi alterarle)
    }),
  ],
});