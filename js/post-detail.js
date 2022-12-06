import { renderPostDetail, registerLightBox } from './utils';

(() => {
  console.log('I am post-detail.js');
  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });
  renderPostDetail();
})();
