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

// Inicializa una fila con todas las columnas en cero.
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

// Actualiza la columna correspondiente al rol del mensaje.
function countRole(row, message) {
  const role = message.author?.role ?? null;
  const column = ROLE_COLUMNS[role];

  if (column) {
    row[column]++;
  }
}

// Actualiza la columna correspondiente al tipo de contenido.
function countContentType(row, message) {
  const contentType = message.content?.content_type ?? null;
  const column = CONTENT_TYPE_COLUMNS[contentType] ?? "Otros";

  row[column]++;
}

// Cuenta si el mensaje posee metadata.parent_id.
function countParentId(row, message) {
  if (message.metadata?.parent_id) {
    row["parent_id"]++;
  }
}

// Actualiza el rango de timestamps para una página y el global.
function updateTimestampRanges(message, pageRange, globalRange) {
  const timestamp = message.create_time;

  if (timestamp == null) return;
  if (pageRange.first === null || timestamp < pageRange.first) pageRange.first = timestamp;
  if (pageRange.last === null || timestamp > pageRange.last) pageRange.last = timestamp;
  if (globalRange.first === null || timestamp < globalRange.first) globalRange.first = timestamp;
  if (globalRange.last === null || timestamp > globalRange.last) globalRange.last = timestamp;
}

// Formatea un timestamp para mostrarlo en la tabla.
function formatTimestamp(timestamp) {
  return timestamp != null ? formatDate(timestamp, "human") : "—";
}

// Llena las columnas de una fila a partir de los mensajes de una página.
function fillPageRow(row, messages, pageRange, globalRange) {
  for (const message of messages) {
    row["Mensajes"]++;

    countRole(row, message);
    countContentType(row, message);
    countParentId(row, message);
    updateTimestampRanges(message, pageRange, globalRange);
  }
}

// Procesa una página y devuelve su fila correspondiente.
function processPage(page, index, totals, globalRange) {
  const messages = Array.isArray(page.data?.messages)
    ? page.data.messages
    : [];

  const row = createEmptyRow(index + 1);
  const pageRange = { first: null, last: null };

  fillPageRow(row, messages, pageRange, globalRange);

  row["Inicio"] = formatTimestamp(pageRange.first);
  row["Fin"] = formatTimestamp(pageRange.last);

  accumulateTotals(totals, row);

  return row;
}

// Suma las columnas numéricas de una fila al acumulador.
function accumulateTotals(totals, row) {
  for (const [key, value] of Object.entries(row)) {
    if (key !== "Página" && typeof value === "number") {
      totals[key] += value;
    }
  }
}

// Agrega la fila final de totales.
function appendTotalRow(rows, totals, globalRange) {
  const totalRow = createEmptyRow("Total");

  accumulateTotals(totalRow, totals);

  totalRow["Inicio"] = formatTimestamp(globalRange.first);
  totalRow["Fin"] = formatTimestamp(globalRange.last);

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

  const globalRange = {
    first: null,
    last: null,
  };

  conversation.forEach((page, index) => {
    rows.push(processPage(page, index, totals, globalRange));
  });

  appendTotalRow(rows, totals, globalRange);

  return { title, rows };
}