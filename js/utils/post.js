import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import postApi from '../api/postApi';
import { setTextContent, truncateText } from './common';

//home
export function createPostElement(post) {
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
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  //TODO: add event
  const editButton = liElement.querySelector('[data-id="edit"]');
  initEditButton(editButton, post.id);

  const divElement = liElement.firstElementChild;
  initPostDetail(divElement, editButton, post.id);

  return liElement;
}

export function initEditButton(editButton, postId) {
  if (!editButton) return;

  editButton.addEventListener('click', (e) => {
    window.location.assign(`/add-edit-post.html?id=${postId}`);
  });
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  for (const post of postList) {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  }
}

export function initPostDetail(divElement, editButton, postId) {
  if (!divElement || !editButton) return;

  divElement.addEventListener('click', (e) => {
    //if event is triggered from editButton or its child --> ignore
    if (editButton === e.target || editButton.contains(e.target)) return;

    window.location.assign(`/post-detail.html?id=${postId}`);
  });
}

//Post-Detail
export async function renderPostDetail() {
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');
    if (!postId) return;

    const data = await postApi.getById(postId);

    //render post detail
    setTextContent(document, '#postDetailTitle', data.title);
    setTextContent(document, '#postDetailAuthor', data.author);
    setTextContent(document, '#postDetailDescription', data.description);

    dayjs.extend(LocalizedFormat);
    setTextContent(
      document,
      '#postDetailTimeSpan',
      dayjs(data.createdAt).format(' - DD/MM/YYYY HH:mm')
    );

    const postHeroImage = document.getElementById('postHeroImage');
    if (!postHeroImage) return;

    const imageUrlStyle = Boolean(data.imageUrl)
      ? data.imageUrl
      : 'https://via.placeholder.com/1368x400?text=thumbnail';
    postHeroImage.style.backgroundImage = `url('${imageUrlStyle}')`;

    //attach event
    const goToEditPageLink = document.getElementById('goToEditPageLink');
    if (!goToEditPageLink) return;

    goToEditPageLink.innerHTML = '<i class="fas fa-edit"></i>Edit post';
    initEditLink(goToEditPageLink, postId);
  } catch (error) {
    console.log('show error fetch', error);
  }
}

export function initEditLink(linkElement, postId) {
  linkElement.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.assign(`/add-edit-post.html?id=${postId}`);
  });
}
