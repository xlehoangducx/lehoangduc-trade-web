/**
 * Scroll Reveal Effects for TradeMatrix Landing Page
 * Trình chiếu hiệu ứng đa dạng cho từng phần khi cuộn trang
 */
document.addEventListener('DOMContentLoaded', () => {
  const scrollElements = document.querySelectorAll('.scroll-item');

  if (!('IntersectionObserver' in window)) {
    // Fallback if browser doesn't support IntersectionObserver
    scrollElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger slight delay if multiple elements appear together
        const delay = entry.target.dataset.delay || (index * 60);
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, delay);
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  scrollElements.forEach(el => observer.observe(el));
});
