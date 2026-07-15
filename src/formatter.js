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

export function formatDate(timestamp, format = "human", ...args) {
  const formatter = dateFormats[format] ?? dateFormats.human;

  return formatter(timestamp);
}

export function formatQuote(text = "") {
  return text
    .split("\n")
    .map(line => `> ${line}`)
    .join("\n");
}
