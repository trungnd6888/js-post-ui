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

// export function getValueFromForm(form, elementId) {
//   const element = form.elements.namedItem(elementId);
//   if (!element) return;

//   return element.value;
// }

export function setFieldValue(form, selector, value) {
  if (!form) return;

  const field = form.querySelector(selector);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.style.backgroundImage = `url(${imageUrl})`;
}

export function randomNumber(n) {
  if (n <= 0) return -1;

  const random = Math.random() * n;
  return Math.round(random);
}
