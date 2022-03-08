export function setTextContent(element, queryString, text) {
  if (!element) return;

  const queryElement = element.querySelector(queryString);
  if (!queryElement) return;

  queryElement.textContent = text;
}
