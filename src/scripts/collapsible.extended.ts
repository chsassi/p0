/**
 * Collapsible/Accordion functionality
 * Handles expand/collapse with accordion behavior (one open at a time)
 *
 * This is the EXTENDED (readable) version.
 * Edit this file and run the build to update the compact version.
 */

const collapsibles = document.querySelectorAll('[data-collapsible]');

function closeOthers(current: Element) {
  // Find the parent group container
  const group = current.closest('[data-collapsible-group]');

  if (group) {
    // Close all other collapsibles in the same group
    const siblings = group.querySelectorAll('[data-collapsible]');
    siblings.forEach((sibling) => {
      if (sibling !== current && sibling.classList.contains('is-open')) {
        sibling.classList.remove('is-open');
        const trigger = sibling.querySelector('[data-collapsible-trigger]');
        trigger?.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function toggle(collapsible: Element) {
  const trigger = collapsible.querySelector('[data-collapsible-trigger]');
  const isOpen = collapsible.classList.contains('is-open');

  if (!isOpen) {
    // Close others before opening this one
    closeOthers(collapsible);
  }

  collapsible.classList.toggle('is-open');
  trigger?.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}

collapsibles.forEach((collapsible) => {
  const trigger = collapsible.querySelector('[data-collapsible-trigger]');

  trigger?.addEventListener('click', (e) => {
    e.preventDefault();
    toggle(collapsible);
  });

  // Keyboard support
  trigger?.addEventListener('keydown', (e) => {
    const event = e as KeyboardEvent;
    if (event.key === 'Enter' || event.key === ' ') {
      e.preventDefault();
      toggle(collapsible);
    }
  });
});
