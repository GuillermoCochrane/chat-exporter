(function() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('light'));

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  document.getElementById('hamburger').addEventListener('click', () => sidebar.classList.toggle('open'));
  sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (window.innerWidth <= 980) sidebar.classList.remove('open');
  }));

  // Exclusive accordion
  document.querySelectorAll('.sidebar details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      document.querySelectorAll('.sidebar details').forEach(other => {
        if (other !== details) other.open = false;
      });
    });
  });

  // Carousel
  const slides = [...document.querySelectorAll('.carousel-slide')];
  const dots = [...document.querySelectorAll('.dot')];
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let current = 0;

  function showSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => showSlide(current - 1));
  nextBtn.addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

  let autoPlay = setInterval(() => showSlide(current + 1), 5000);
  document.querySelector('.carousel').addEventListener('mouseenter', () => clearInterval(autoPlay));
  document.querySelector('.carousel').addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => showSlide(current + 1), 5000);
  });

  // Active section tracking (IntersectionObserver) for both sidebars
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
})();