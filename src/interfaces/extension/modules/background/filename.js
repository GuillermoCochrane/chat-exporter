// Utilidades para construir nombres de archivo seguros y descriptivos.

export function sanitizeFilename(name) {
  return name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .slice(0, 80) || "conversation";
}

export function getConversationTitle(conversation) {
  if (!Array.isArray(conversation)) return null;

  for (const page of conversation) {
    const title = page?.data?.title;
    if (typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  return null;
}

export function buildExportFilename(title, provider) {
  const safeTitle = sanitizeFilename(title ?? "conversation");
  const safeProvider = sanitizeFilename(provider ?? "unknown").toLowerCase();

  return `${safeTitle}_${safeProvider}`;
}