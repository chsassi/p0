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

window.addEventListener(
  'scroll',
  () => header?.classList.toggle('visible', window.scrollY > 100),
  { passive: true }
);

if (menuBtn && dropdown) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  dropdown.addEventListener('mouseenter', () => {
    dropdown.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
  });
  dropdown.addEventListener('mouseleave', () => {
    dropdown.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
}
