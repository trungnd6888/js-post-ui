import debounce from 'lodash.debounce';
import { M_PAGE } from '../constants';

export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  //set current active page
  //TODO: use defaultParams

  //PrevLink
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (!prevLink) return;

  const prevDebounce = debounce(() => {
    const page = Number.parseInt(ulPagination.dataset.page) || 1;
    if (page >= 2) onChange?.(page - 1);
  }, 500);

  prevLink.addEventListener('click', (e) => {
    e.preventDefault();
    prevDebounce();
  });

  //NextLink
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (!nextLink) return;

  const nextDebounce = debounce(() => {
    const page = Number.parseInt(ulPagination.dataset.page) || M_PAGE;
    const totalPages = ulPagination.dataset.totalPages;
    if (page < totalPages) onChange?.(page + 1);
  }, 500);

  nextLink.addEventListener('click', (e) => {
    e.preventDefault();
    nextDebounce();
  });
}

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  //calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  //save page and totalPages to Ulpagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}
