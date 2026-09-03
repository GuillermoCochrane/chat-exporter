// Ordena mensajes crudos por fecha de creación.
// Se conserva para casos donde sea necesario ordenar por timestamp.
export function sortMessages(messages, isAscending = true) {
  return [...messages].sort((a, b) => {
    const timeA = a.createTime ?? 0;
    const timeB = b.createTime ?? 0;

    return isAscending ? timeA - timeB : timeB - timeA;
  });
}

// Corrige el orden de mensajes usando la relación parent_id.
// No invierte el array ni ordena por timestamps.
// Solo reubica hijos que aparecen antes que sus padres.
export function sortMessagesSafe(messages) {
  const sorted = [...messages];

  const byId = new Map(sorted.map((message) => [message.id, message]));

  let changed = true;

  while (changed) {
    changed = false;

    for (let i = 0; i < sorted.length; i++) {
      const message = sorted[i];

      if (!message.parent) continue;

      const parent = byId.get(message.parent);

      if (!parent) continue;

      const parentIndex = sorted.indexOf(parent);

      if (i < parentIndex) {
        const [child] = sorted.splice(i, 1);
        sorted.splice(parentIndex, 0, child);
        changed = true;
        break;
      }
    }
  }

  return sorted;
}