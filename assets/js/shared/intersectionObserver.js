//* Highlighted links Handler
import { $, $$ } from '../utilities/dom.js';

export function intersectionObserver() {
  const $$sections = [...$$('article section[id]')]; // capturamos todos los section con id
  const $$navLinks = [...$$('.sidebar a[href^="#"]')]; // capturamos todos los links con href que comienzan con #

  // creamos un observer de intersection
  const observer = new IntersectionObserver(entries => {
    
    // Iteramos por cada entrada del observer
    for (const entry of entries) {

      if (!entry.isIntersecting) continue; // Si no está intersectando la zona de detección, pasamos a la siguiente

      for (const $link of $$navLinks) {
        $link.classList.remove('active'); // quitamos la clase active de todos los links
      }

      const $active = $('.sidebar a[href="#' + entry.target.id + '"]'); // capturamos el link que coincide con el id del elemento

      $active?.classList.add('active');  // le ponemos la clase active al link correspondiente
    }  

  }, 
  { rootMargin: '-20% 0px -80% 0px' } // Define la zona de detección dentro del viewport
); 

  for (const $section of $$sections) {
    observer.observe($section); // Observamos cada sección para detectar cuándo entra en la zona activa
  }
}