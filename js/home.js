import postApi from './api/postApi';
import { M_FILTER_NAME, M_LIMIT, M_PAGE } from './constants';
import { initPagination, initSearch, renderPagination, renderPostList } from './utils';

export async function handleFilterChange(filterName, filterValue) {
  try {
    //get params then set params
    const url = new URL(window.location);
    url.searchParams.set('_page', M_PAGE);
    url.searchParams.set('_limit', M_LIMIT);

    filterName && filterValue
      ? url.searchParams.set(filterName, filterValue)
      : url.searchParams.delete(filterName);

    window.history.pushState({}, '', url);

    //reset ulElement
    const ulElement = document.getElementById('postsList');
    if (!ulElement) return;
    ulElement.textContent = '';

    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);

    renderPostList('postsList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

//MAIN
(async () => {
  try {
    const url = new URL(window.location);

    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', M_PAGE);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', M_LIMIT);

    history.pushState({}, '', url);
    console.log('I am home.js');

    const queryParams = url.searchParams;

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange(M_FILTER_NAME, value),
    });

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postsList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
    //show modal, toast error
  }
})();
