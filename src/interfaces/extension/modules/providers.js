//? Detección de proveedores
const PROVIDERS = {
  "chatgpt.com": "ChatGPT",
  "deepseek.com": "DeepSeek",
  "gemini.google.com": "Gemini",
};

export function detectProvider(hostname = window.location.hostname) {
  for (const domain in PROVIDERS) {
    if (hostname.includes(domain)) {
      return PROVIDERS[domain];
    }
  }

  return "Unknown";
}