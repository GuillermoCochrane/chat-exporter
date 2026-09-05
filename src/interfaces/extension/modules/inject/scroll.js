import { PAGE_CAPTURED } from "../constants.js";
import { getConversation, getLastPage } from "./state.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Responsable de desplazar la interfaz de ChatGPT para forzar
// la carga de todas las páginas de la conversación y recolectarlas.

function findScrollableContainer() {
  const all = [...document.querySelectorAll("*")];
  const candidates = all
    .filter((el) => {
      const style = getComputedStyle(el);
      return (
        el.scrollHeight > el.clientHeight &&
        (style.overflowY === "auto" || style.overflowY === "scroll")
      );
    })
    .sort((a, b) => b.scrollHeight - a.scrollHeight);

  return (
    candidates[0] ??
    document.scrollingElement ??
    document.documentElement
  );
}

function waitForNewPage(timeoutMs = 45000) {
  return new Promise((resolve) => {
    const handler = (event) => {
      window.removeEventListener(PAGE_CAPTURED, handler);
      clearTimeout(timer);
      resolve(event.detail);
    };

    const timer = setTimeout(() => {
      window.removeEventListener(PAGE_CAPTURED, handler);
      resolve(null);
    }, timeoutMs);

    window.addEventListener(PAGE_CAPTURED, handler);
  });
}

// Vuelve al fondo de la conversación.
// Se usa scroll instantáneo porque durante la recuperación
// la altura del contenido puede seguir cambiando.
async function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
  // Dar tiempo al navegador para aplicar el cambio de layout.
  await sleep(100);
  // Volver a calcular scrollHeight por si el contenido
  // terminó de renderizarse después del primer scroll.
  container.scrollTop = container.scrollHeight;
}

// Recolecta todas las páginas de la conversación y, al finalizar,
// devuelve al usuario al último mensaje de la conversación.
export async function collectViaScroll() {
  const container = findScrollableContainer();

  let lastPage = getLastPage();
  let consecutiveTimeouts = 0;

  while (lastPage?.page_info?.has_previous_page) {
    container.scrollTop = 0;

    const newPage = await waitForNewPage();

    if (!newPage) {
      consecutiveTimeouts++;

      if (consecutiveTimeouts >= 3) {
        break;
      }

      container.scrollTop = 200;
      await sleep(500);
      container.scrollTop = 0;

      continue;
    }

    consecutiveTimeouts = 0;
    lastPage = newPage.data;

    await sleep(1500);
    container.scrollTop = 0;
    await sleep(300);
  }

  await scrollToBottom(container);

  return getConversation();
}