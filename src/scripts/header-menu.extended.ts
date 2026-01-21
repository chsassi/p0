/**
 * Header scroll visibility and dropdown menu
 * Source: src/layouts/HeaderLayout.astro
 *
 * This is the EXTENDED (readable) version.
 * Edit this file and run the build to update the compact version.
 */

const header = document.querySelector('.header');
const menuBtn = document.querySelector('.menu-button');
const dropdown = document.querySelector('.menu-dropdown');

// Show header immediately on subpages (no hero section)
const isHomePage = document.querySelector('.hero-slideshow') !== null;

if (!isHomePage && header) {
  header.classList.add('is-visible');
}

window.addEventListener(
  'scroll',
  () => {
    if (isHomePage) {
      header?.classList.toggle('is-visible', window.scrollY > 100);
    }
  },
  { passive: true }
);

if (menuBtn && dropdown) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  dropdown.addEventListener('mouseenter', () => {
    dropdown.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
  });
  dropdown.addEventListener('mouseleave', () => {
    dropdown.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', () => {
    dropdown.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
}
