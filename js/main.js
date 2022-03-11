import postApi from './api/postApi';
import { setTextContent, truncateText } from './utils';
import { M_FILTER_NAME, M_PAGE, M_LIMIT } from './constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash.debounce';

//Post
function createPostElement(post) {
  if (!post) return null;

  const postTemplate = document.querySelector('template#postItemTemplate');
  if (!postTemplate) return null;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return null;
  liElement.dataset.id = post.id;

  //update liElement
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);

  //update timeSpan by 'dayjs'
  dayjs.extend(relativeTime);
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs().to(dayjs(post.updatedAt))}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/468x60?text=thumbnail';
    });
  }
  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  for (const post of postList) {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  }
}

//Pagination
function initPagination() {
  const ulPagination = document.getElementById('pagination');
  if (!ulPagination) return;

  //PrevLink
  const debouncePrevLink = debounce(handlePrevClick, 500);
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (!prevLink) return;

  prevLink.addEventListener('click', (event) => {
    event.preventDefault();
    debouncePrevLink();
  });

  //NextLink
  const debounceNextLink = debounce(handleNextClick, 500);
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (!prevLink) return;

  nextLink.addEventListener('click', (event) => {
    event.preventDefault();
    debounceNextLink();
  });
}

async function handlePrevClick() {
  const queryParams = new URLSearchParams(window.location.search);
  if (!queryParams.get('_page')) queryParams.set('_page', M_PAGE);

  const url = new URL(window.location);
  if (parseInt(queryParams.get('_page')) > 1)
    url.searchParams.set('_page', parseInt(queryParams.get('_page')) - 1);
  else url.searchParams.set('_page', M_PAGE);
  window.history.pushState({}, '', url);

  //reset ulElement
  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;
  ulElement.textContent = '';
  console.log(queryParams.toString());

  const { data, pagination } = await postApi.getAll(url.searchParams);
  renderPostList(data);
  renderPagination(pagination);
}

async function handleNextClick() {
  const queryParams = new URLSearchParams(window.location.search);
  if (!queryParams.get('_page')) queryParams.set('_page', M_PAGE);

  const url = new URL(window.location);
  url.searchParams.set('_page', parseInt(queryParams.get('_page')) + 1);
  window.history.pushState({}, '', url);

  //reset ulElement
  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;
  ulElement.textContent = '';

  const { data, pagination } = await postApi.getAll(url.searchParams);
  renderPostList(data);
  renderPagination(pagination);
}

async function initURL() {
  const url = new URL(window.location);
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', M_PAGE);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', M_LIMIT);
  window.history.pushState({}, '', url);
}

function renderPagination(pagination) {
  const ulPagination = document.getElementById('pagination');
  if (!ulPagination) return;

  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

//filterChange - search
async function handleFilterChange(filterName, filterValue) {
  try {
    //get params then set params
    const url = new URL(window.location);
    url.searchParams.set('_page', M_PAGE);
    url.searchParams.set('_limit', M_LIMIT);

    filterValue && filterValue
      ? url.searchParams.set(filterName, filterValue)
      : url.searchParams.delete(filterName);

    history.pushState({}, '', url);

    //reset ulElement
    const ulElement = document.getElementById('postsList');
    if (!ulElement) return;
    ulElement.textContent = '';

    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);

    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  //debounce
  const debounceSearch = debounce(() => handleFilterChange(M_FILTER_NAME, searchInput.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}

function renderSearch(filterValue) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = filterValue;
}

(async () => {
  try {
    initPagination();
    initURL();
    initSearch();

    const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams);

    renderPostList(data);
    renderPagination(pagination);
    if (queryParams.get(M_FILTER_NAME)) renderSearch(queryParams.get(M_FILTER_NAME));
  } catch (error) {
    console.log('get all failed', error);
    //show modal, toast error
  }
})();
