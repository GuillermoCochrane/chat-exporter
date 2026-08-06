//* Carousel Handler

export function carouselHandler() {
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
}