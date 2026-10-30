export default function closeContainer() {
  const containers = document.querySelectorAll('.close');

  if (containers.length === 0) return;

  document.addEventListener('click', (event) => {
    containers.forEach((container) => {
      if (container.classList.contains('is-active')) {
        const categoryEl = container.closest('.categories');
        const isClickInside = container.contains(event.target) || (categoryEl && categoryEl.contains(event.target));

        if (!isClickInside) {
          container.classList.remove('is-active');
        }
      }
    });
  });
}
