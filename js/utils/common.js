export function setTextContent(element, queryString, text) {
  if (!element) return;

  const queryElement = element.querySelector(queryString);
  if (!queryElement) return;

  queryElement.textContent = text;
}

export function truncateText(text, maxLength) {
  if (!text) return;

  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
