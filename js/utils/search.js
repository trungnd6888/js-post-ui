import debounce from 'lodash.debounce';
import { M_FILTER_NAME } from '../constants';
export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  //set default values from query params
  if (defaultParams && defaultParams.get(M_FILTER_NAME)) {
    searchInput.value = defaultParams.get(M_FILTER_NAME);
  }

  //debounce
  const debounceSearch = debounce(() => onChange?.(searchInput.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}
