(() => {
  const viewer = document.querySelector('.ml-viewer');
  const image = viewer.querySelector('img');
  const title = document.querySelector('#viewer-title');
  let trigger;
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      const source = button.querySelector('img');
      title.textContent = source.alt;
      image.alt = source.alt;
      image.src = button.dataset.image;
      image.width = Number(button.dataset.width);
      image.height = Number(button.dataset.height);
      // Keep at least two original pixels for every CSS pixel, including zoom.
      image.style.width = `${Math.min(1120, Math.floor(Number(button.dataset.width) / 2))}px`;
      viewer.showModal();
      viewer.querySelector('.ml-viewer-scroll').scrollTo(0, 0);
    });
  });
  viewer.querySelector('.ml-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => trigger?.focus());
})();

// Educational explanation of source component states, with illustrative data.
// Source attribution: sources/semester8/LICENSE.
(() => {
  const card = document.querySelector('.ml-sample-card');
  if (!card) return;
  const add = card.querySelector('.ml-sample-add');
  const reset = card.querySelector('.ml-sample-reset');
  const ring = card.querySelector('[role="progressbar"]');
  let samples = 1;
  const render = () => {
    const complete = samples === 3;
    ring.setAttribute('aria-valuenow', String(samples));
    card.querySelector('.ml-progress-track').setAttribute('stroke-dashoffset', String(2 * Math.PI * 45 * (1 - samples / 3)));
    card.querySelector('.ml-sample-count').textContent = `${samples} / 3`;
    card.querySelector('.ml-sample-badge').textContent = complete ? '✓ Complete' : 'Collecting';
    card.querySelector('.ml-sample-description').textContent = complete
      ? '3 samples collected. The gesture has reached its target.'
      : `${samples} sample${samples === 1 ? '' : 's'} collected. ${3 - samples} more to reach the target.`;
    card.classList.toggle('is-complete', complete);
    add.disabled = complete;
  };
  add.hidden = false;
  reset.hidden = false;
  add.addEventListener('click', () => { samples = Math.min(3, samples + 1); render(); });
  reset.addEventListener('click', () => { samples = 1; render(); });
})();
