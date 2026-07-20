// Registro de formatos disponibles para fechas.
// Cada formato transforma un timestamp Unix a una representación textual.
const dateFormats = {
  unix(timestamp) {
    return timestamp;
  },

  iso(timestamp) {
    return new Date(timestamp * 1000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
  },

  human(timestamp) {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(timestamp * 1000));
  },

  locale(timestamp, locale = "es-AR") {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeStyle: "long",
    }).format(new Date(timestamp * 1000));
  },
};

// Formatea un timestamp utilizando el formato indicado.
// Si el formato no existe, utiliza "human".
export function formatDate(timestamp, format = "human", ...args) {
  const formatter = dateFormats[format] ?? dateFormats.human;
  return formatter(timestamp, ...args);
}

// Convierte un texto en un bloque de cita Markdown.
// Conserva la estructura línea por línea.
export function formatQuote(text = "") {
  return text
    .split("\n")
    .map(line => `> ${line}`)
    .join("\n");
}

// Formatea el rol de un mensaje.
export function formatRole(role) {
  return role === "user"
    ? "Usuario"
    : "Asistente";
}