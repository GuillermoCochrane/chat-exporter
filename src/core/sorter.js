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