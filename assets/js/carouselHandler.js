//* Carousel Handler
import { $, $$ } from './utilities/dom.js';

function groupClassHandler(domGroup, className = "active", add = true, index) {
  const action = add ? 'add' : 'remove';
  domGroup[index].classList[action](className);
};

export function carouselHandler() {
  const $$slides = [...$$('.carousel-slide')];
  const $$dots = [...$$('.dot')];
  const $prevBtn = $('.carousel-btn.prev');
  const $nextBtn = $('.carousel-btn.next');
  const $carousel = $('.carousel');
  
  let current = 0;

  function showSlide(index) {
    // Removemos la clase active del slide actual
    groupClassHandler($$slides, 'active', false, current);
    groupClassHandler($$dots, 'active', false, current);

    // Actualizamos la posición actual
    current = (index + $$slides.length) % $$slides.length;

    // Agregamos la clase active al nuevo slide
    groupClassHandler($$slides, 'active', true, current);
    groupClassHandler($$dots, 'active', true, current);
  }

  // Hanlders de los botones de navegación
  $prevBtn.addEventListener('click', () => showSlide(current - 1));
  $nextBtn.addEventListener('click', () => showSlide(current + 1));
  
  // Hanlders de los dots
  $$dots.forEach(($dot, i) => $dot.addEventListener('click', () => showSlide(i)));

  // Hanlders del auto-play
  let autoPlay = setInterval(() => showSlide(current + 1), 5000);
  $carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  $carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => showSlide(current + 1), 5000);
  });
}