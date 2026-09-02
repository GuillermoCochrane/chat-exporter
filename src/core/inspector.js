import { formatDate } from "../utilities/formatter.js";

// Mapeos declarativos para evitar if/else repetidos.
const ROLE_COLUMNS = {
  user: "User",
  assistant: "Assistant",
  system: "System",
  tool: "Tool",
};

const CONTENT_TYPE_COLUMNS = {
  text: "Texto",
  code: "Code",
};

// Devuelve una fila con todas las columnas inicializadas en cero.
function createEmptyRow(pageLabel = "") {
  return {
    "Página": pageLabel,
    "Mensajes": 0,
    "User": 0,
    "Assistant": 0,
    "System": 0,
    "Tool": 0,
    "Texto": 0,
    "Code": 0,
    "Otros": 0,
    "parent_id": 0,
    "Inicio": "—",
    "Fin": "—",
  };
}

// Suma los valores numéricos de una fila a un acumulador.
function accumulateTotals(totals, row) {
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === "number") {
      totals[key] += value;
    }
  }
}

// Agrega la fila de totales final usando timestamps originales.
function appendTotalRow(rows, totals, firstTimestamp, lastTimestamp) {
  const totalRow = createEmptyRow("Total");

  // Copiar solo las columnas numéricas, excluyendo "Página".
  for (const [key, value] of Object.entries(totals)) {
    if (key !== "Página" && typeof value === "number") {
      totalRow[key] = value;
    }
  }

  totalRow["Inicio"] =
    firstTimestamp != null ? formatDate(firstTimestamp, "human") : "—";
  totalRow["Fin"] =
    lastTimestamp != null ? formatDate(lastTimestamp, "human") : "—";

  rows.push(totalRow);
}

// Genera el reporte de diagnóstico por página y totales.
export function inspectConversation(conversation) {
  if (!Array.isArray(conversation)) {
    throw new Error("La conversación paginada debe ser un array.");
  }

  const title =
    conversation.find((page) => page.data?.title)?.data?.title ??
    "(Sin título)";

  const rows = [];
  const totals = createEmptyRow();

  let globalFirstTimestamp = null;
  let globalLastTimestamp = null;

  conversation.forEach((page, index) => {
    const messages = Array.isArray(page.data?.messages)
      ? page.data.messages
      : [];

    const row = createEmptyRow(index + 1);

    let firstTimestamp = null;
    let lastTimestamp = null;

    for (const message of messages) {
      row["Mensajes"]++;

      const role = message.author?.role ?? null;
      const roleColumn = ROLE_COLUMNS[role];
      if (roleColumn) row[roleColumn]++;

      const contentType = message.content?.content_type ?? null;
      const typeColumn = CONTENT_TYPE_COLUMNS[contentType] ?? "Otros";
      row[typeColumn]++;

      if (message.metadata?.parent_id) {
        row["parent_id"]++;
      }

      const timestamp = message.create_time;

      if (timestamp != null) {
        if (firstTimestamp === null || timestamp < firstTimestamp) {
          firstTimestamp = timestamp;
        }

        if (lastTimestamp === null || timestamp > lastTimestamp) {
          lastTimestamp = timestamp;
        }

        if (globalFirstTimestamp === null || timestamp < globalFirstTimestamp) {
          globalFirstTimestamp = timestamp;
        }

        if (globalLastTimestamp === null || timestamp > globalLastTimestamp) {
          globalLastTimestamp = timestamp;
        }
      }
    }

    row["Inicio"] =
      firstTimestamp != null ? formatDate(firstTimestamp, "human") : "—";
    row["Fin"] =
      lastTimestamp != null ? formatDate(lastTimestamp, "human") : "—";

    accumulateTotals(totals, row);

    rows.push(row);
  });

  appendTotalRow(rows, totals, globalFirstTimestamp, globalLastTimestamp);

  return { title, rows };
}