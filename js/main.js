import postApi from './api/postApi';
import { setTextContent } from './utils';
import dayjs from 'dayjs';

function createPostElement(post) {
  if (!post) return null;

  const postTemplate = document.querySelector('template#postItemTemplate');
  if (!postTemplate) return null;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return null;
  liElement.dataset.id = post.id;

  //update liElement
  // const titleElement = liElement.querySelector('[data-id="title"]');
  // if (!titleElement) return;
  // titleElement.textContent = post.title;

  // const descriptionElement = liElement.querySelector('[data-id="description"]');
  // if (!descriptionElement) return;
  // descriptionElement.textContent = post.description;

  // const authorElement = liElement.querySelector('[data-id="author"]');
  // if (!authorElement) return;
  // authorElement.textContent = post.author;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', post.description);
  setTextContent(liElement, '[data-id="author"]', post.author);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (!thumbnailElement) return;
  thumbnailElement.src = post.imageUrl;

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

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
    //show modal, toast error
  }
})();
