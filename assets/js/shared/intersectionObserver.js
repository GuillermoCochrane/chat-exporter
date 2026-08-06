//* Highlighted links Handler

export function intersectionObserver() {
  const sections = [...document.querySelectorAll('article section[id]')];
  const navLinks = [...document.querySelectorAll('.sidebar a[href^="#"]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-20% 0px -80% 0px' });
  sections.forEach(section => observer.observe(section));
}