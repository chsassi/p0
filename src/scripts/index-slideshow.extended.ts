/**
 * Slideshow and scroll indicator logic
 * Source: src/pages/index.astro
 *
 * This is the EXTENDED (readable) version.
 * Edit this file and run the build to update the compact version.
 */

function createSlideshow(
  container: string,
  slide: string,
  indicator: string,
  next: string,
  prev: string,
  interval = 5000,
  bgBlur?: string
) {
  let idx = 0;
  const el = document.querySelector(container);
  const slides = Array.from(el?.querySelectorAll(slide) || []);
  const indicators = Array.from(el?.querySelectorAll(indicator) || []);
  const nextBtn = el?.querySelector(next),
    prevBtn = el?.querySelector(prev);
  const blur = bgBlur ? document.querySelector(bgBlur) : null;
  if (!slides.length) return;

  const update = (i: number) => {
    slides.forEach((s, j) => s.classList.toggle('is-active', j === i));
    indicators.forEach((ind, j) => ind.classList.toggle('is-active', j === i));
    if (blur) {
      const bg = slides[i].getAttribute('data-image');
      if (bg) (blur as HTMLElement).style.backgroundImage = `url(${bg})`;
    }
    idx = i;
  };
  const go = (dir: number) =>
    update((idx + dir + slides.length) % slides.length);

  nextBtn?.addEventListener('click', () => go(1));
  prevBtn?.addEventListener('click', () => go(-1));
  indicators.forEach((ind, i) =>
    ind.addEventListener('click', () => update(i))
  );

  let timer = setInterval(() => go(1), interval);
  el?.addEventListener('mouseenter', () => clearInterval(timer));
  el?.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => go(1), interval);
  });
  update(0);
}

createSlideshow(
  '.hero-slideshow',
  '.hero-slide',
  '.hero-slideshow-indicators .hero-indicator',
  '.hero-nav-btn.next',
  '.hero-nav-btn.prev',
  6000
);
createSlideshow(
  '.artists-slideshow',
  '.artist-slide',
  '.artists-slideshow-indicators .artist-indicator',
  '.artist-slide-nav-btn.next',
  '.artist-slide-nav-btn.prev',
  5000,
  '.artist-bg-blur'
);
createSlideshow(
  '.releases-slideshow',
  '.release-slide',
  '.slideshow-indicators .indicator',
  '.slide-nav-btn.next',
  '.slide-nav-btn.prev',
  5000,
  '.release-bg-blur'
);

const scrollIndicator = document.querySelector('.scroll-indicator');
const sections = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'artists', name: 'Artists' },
  { id: 'releases', name: 'Releases' },
  { id: 'contacts', name: 'Contacts' },
];

function onScroll() {
  const scrollY = window.scrollY,
    winH = window.innerHeight,
    isScrolled = scrollY > winH / 2;
  scrollIndicator?.classList.toggle('is-scrolled', isScrolled);
  scrollIndicator?.setAttribute(
    'aria-label',
    isScrolled ? 'Scroll to top' : 'Scroll down'
  );

  let active = sections[0];
  sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.top < winH / 2 && r.bottom > 0) active = s;
    }
  });
  const headerText = document.querySelector('.header-current-page');
  if (headerText) headerText.textContent = active.name;
}

scrollIndicator?.addEventListener('click', () => {
  if (window.scrollY > window.innerHeight / 2)
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
