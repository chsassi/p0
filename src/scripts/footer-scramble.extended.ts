/**
 * Footer text scramble animation
 * Source: src/layouts/FooterLayout.astro
 *
 * This is the EXTENDED (readable) version.
 * Edit this file and run the build to update the compact version.
 */

const footerText = document.querySelector('.footer-text');
const fullText = footerText?.getAttribute('data-text') || '';
let hasAnimated = false;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated && footerText) {
        hasAnimated = true;
        const chars =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*-+=<>?/\\|[]{}';
        let iter = 0;
        footerText.textContent = fullText;
        const interval = setInterval(() => {
          footerText.textContent = fullText
            .split('')
            .map((_, i) =>
              i < iter
                ? fullText[i]
                : chars[Math.floor(Math.random() * chars.length)]
            )
            .join('');
          if (iter >= fullText.length) {
            clearInterval(interval);
            footerText.textContent = fullText;
          }
          iter += 1 / 3;
        }, 15);
      }
    });
  },
  { threshold: 0.5 }
);

if (footerText) observer.observe(footerText);
