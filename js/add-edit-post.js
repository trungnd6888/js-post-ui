import postApi from './api/postApi';
import { initPostForm, toast } from './utils';
import { M_IMAGE_SOURCE } from './constants';

function removeUnuseFields(formValues) {
  const payload = { ...formValues };

  switch (payload.imageSource) {
    case M_IMAGE_SOURCE.UPLOAD:
      delete payload.imageUrl;
      break;
    case M_IMAGE_SOURCE.PICSUM:
      delete payload.image;
      break;
  }

  delete payload.imageSource;
  return payload;
}

function JsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const prop in jsonObject) {
    formData.set(prop, jsonObject[prop]);
  }

  return formData;
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnuseFields(formValues);
    console.log('payload:', payload);

    const formData = JsonToFormData(payload);

    //check add/edit mode
    //S1: based on search params (check id)
    //S2: check id in formValues
    const savePost = formData.get('id')
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    //call API
    //show success message
    toast.success('save post successfully!');
    //redirect to detail page
    // setTimeout(() => {
    //   window.location.assign(`/post-detail.html?id=${savePost.id}`);
    // }, 2000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message}`);
  }
}

//MAIN
(async () => {
  try {
    // get id from URL
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');

    //fetch API or set default values
    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('failed to fetch post details', error);
  }
})();
