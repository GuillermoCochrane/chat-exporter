//* Highlighted links Handler
import { $, $$ } from '../utilities/dom.js';

export function intersectionObserver() {
  const $article = $('article');
  const $$sections = [...$$('article section[id]')]; // capturamos todos los section con id
  const $$navLinks = [...$$('.sidebar a[href^="#"]')]; // capturamos todos los links con href que comienzan con #

  if (!$$sections.length || !$$navLinks.length) return;

  // Activa el link que coincide con el ID y desactiva los demás
  const setActiveLink = (id) => {
    if (!id) return;
    for (const $link of $$navLinks) {
      $link.classList.toggle('active', $link.getAttribute('href') === `#${id}`);
    }
  };

  // Conjunto de secciones actualmente visibles en la zona de lectura
  const visibleSections = new Set();

  const updateActiveSection = () => {
    // 1. Si llegamos al fondo del scroll, priorizar siempre la última sección
    if ($article) {
      const isAtBottom = Math.ceil($article.scrollTop + $article.clientHeight) >= $article.scrollHeight - 15;
      if (isAtBottom) {
        setActiveLink($$sections[$$sections.length - 1].id);
        return;
      }
      // 2. Si estamos arriba de todo, priorizar la primera
      if ($article.scrollTop < 50) {
        setActiveLink($$sections[0].id);
        return;
      }
    }

    // 3. De todas las secciones visibles, activar la primera según el orden real del DOM
    for (const $section of $$sections) {
      if (visibleSections.has($section)) {
        setActiveLink($section.id);
        return;
      }
    }
  };

  // Observer que mantiene actualizado el Set de secciones visibles
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target);
        } else {
          visibleSections.delete(entry.target);
        }
      }
      updateActiveSection();
    },
    {
      root: $article || null,
      rootMargin: '-10% 0px -40% 0px', // Zona de lectura balanceada (50% superior/medio)
      threshold: 0
    }
  );

  for (const $section of $$sections) {
    observer.observe($section);
  }

  // Listener para cambios de scroll rápidos y detección de bordes (top/bottom)
  $article?.addEventListener('scroll', updateActiveSection, { passive: true });

  // Activación inicial si la URL ya contiene un hash (ej: #repository)
  if (window.location.hash) {
    setActiveLink(window.location.hash.slice(1));
  }
}