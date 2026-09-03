// Ordena mensajes crudos por fecha de creación.
// Trabaja sobre el contrato que producen parser y filter,
// antes de que normalizer transforme createTime en timestamp.
export function sortMessages(messages, isAscending = true) {
  return [...messages].sort((a, b) => {
    const timeA = a.createTime ?? 0;
    const timeB = b.createTime ?? 0;

    return isAscending ? timeA - timeB : timeB - timeA;
  });
}
// Corrige el orden de mensajes usando la relación parent_id.
// No ordena por timestamps, porque no son confiables.
// Solo reubica hijos que aparecen antes que sus padres.
export function sortMessagesSafe(messages) {

  const inversed = Array.isArray(messages)
    ? [...messages].reverse()
    : [];
  
  const sorted = [...inversed];

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