// Responsable de interceptar las APIs utilizadas por ChatGPT.

const originalFetch = window.fetch;

// Estado interno de la extensión.
window.__AI_CHAT_EXPORTER__ ??= {};
window.__AI_CHAT_EXPORTER__.conversation ??= [];

// ---------------------------------------------------------------------------
// Utilidades de scroll y espera
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  return candidates[0] ?? document.scrollingElement ?? document.documentElement;
}

function waitForNewPage(timeoutMs = 45000) {
  return new Promise((resolve) => {
    const handler = (event) => {
      window.removeEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
      clearTimeout(timer);
      resolve(event.detail);
    };

    const timer = setTimeout(() => {
      window.removeEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
      resolve(null);
    }, timeoutMs);

    window.addEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
  });
}

async function collectViaScroll() {
  const container = findScrollableContainer();
  const state = window.__AI_CHAT_EXPORTER__;

  let lastPage =
    state.conversation.length > 0
      ? state.conversation[state.conversation.length - 1].data
      : null;

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

  return state.conversation;
}

// ---------------------------------------------------------------------------
// Interceptor pasivo de fetch
// ---------------------------------------------------------------------------

window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  if (response.url.includes("/backend-api/conversations/")) {
    const clone = response.clone();

    try {
      const json = await clone.json();

      window.__AI_CHAT_EXPORTER__.conversation.push({
        url: response.url,
        data: json,
      });

      window.dispatchEvent(
        new CustomEvent("AI_CHAT_EXPORTER_PAGE_CAPTURED", {
          detail: { url: response.url, data: json },
        })
      );

      window.postMessage(
        {
          source: "AI_CHAT_EXPORTER",
          type: "CONVERSATION",
          conversation: window.__AI_CHAT_EXPORTER__.conversation,
        },
        "*"
      );
    } catch {
      // No se pudo capturar la conversación; se ignora.
    }
  }

  return response;
};

// ---------------------------------------------------------------------------
// Atiende solicitudes provenientes del content script.
// ---------------------------------------------------------------------------

window.addEventListener("message", async (event) => {
  if (event.source !== window) return;

  if (
    event.data?.source !== "AI_CHAT_EXPORTER" ||
    event.data?.type !== "GET_CONVERSATION"
  ) {
    return;
  }

  try {
    const pages = await collectViaScroll();

    window.postMessage(
      {
        source: "AI_CHAT_EXPORTER",
        type: "CONVERSATION_COMPLETE",
        conversation: pages,
      },
      "*"
    );
  } catch {
    window.postMessage(
      {
        source: "AI_CHAT_EXPORTER",
        type: "CONVERSATION_COMPLETE",
        conversation: window.__AI_CHAT_EXPORTER__.conversation ?? [],
      },
      "*"
    );
  }
});