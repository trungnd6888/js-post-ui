import { setFieldValue, setBackgroundImage, setTextContent, randomNumber } from './common';
import { M_IMAGE_SOURCE } from '../constants';
import * as yup from 'yup';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  //hidden field
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  //S1: query each input and add to  values object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) values[name] = field.value;
  // });

  //S2: FormData
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-to-words',
        'Please enter at least two words of 3 characters',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup.string(),
    imageUrl: yup.string().when('imageSource', {
      is: M_IMAGE_SOURCE.PICSUM,
      then: (schema) =>
        schema.required('Please random a background image').url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: M_IMAGE_SOURCE.UPLOAD,
      then: (schema) =>
        schema
          .test('required', 'Please upload a background image', (file) => file?.name)
          .test('size-1mb', 'The image is too large (max 1mb)', (file) => {
            const fileSize = file?.size || 0;
            const MAX_SIZE = 10 * 1024 * 1024;
            return fileSize <= MAX_SIZE;
          }),
    }),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    //reset previous errors
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));

    const schema = getPostSchema();

    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        //ignore if feild is already logged
        if (errorLog[name]) continue;

        //set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  //add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving ...';
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const button = document.getElementById('postChangeImage');
  if (!button) return;

  button.addEventListener('click', () => {
    //random Url image
    const number = randomNumber(1000);
    if (number < 0) return;

    const url = `https://picsum.photos/id/${number}/1368/400`;
    //set input image and background image
    setFieldValue(form, '[name="imageUrl"]', url);
    setBackgroundImage(document, '#postHeroImage', url);
  });
}

function renderControlImageSource(form, radio) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  if (!controlList) return;

  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== radio.value;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  if (!radioList) return;

  radioList.forEach((radio) =>
    radio.addEventListener('change', () => {
      renderControlImageSource(form, radio);
    })
  );
}

function initFileUploadImage(form) {
  const file = form.querySelector('[name="image"]');
  if (!file) return;

  file.addEventListener('change', () => {
    const fileObject = file.files[0];
    if (!fileObject) return;

    const urlImage = window.URL.createObjectURL(fileObject);
    setBackgroundImage(document, '#postHeroImage', urlImage);

    validatedFieldValue(form, { imageSource: M_IMAGE_SOURCE.UPLOAD, image: fileObject }, 'image');
  });
}

async function validatedFieldValue(form, formValues, name) {
  try {
    //set previous error feild
    setFieldError(form, name, '');

    //validation
    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  //show error
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  initRandomImage(form);
  initRadioImageSource(form);
  initFileUploadImage(form);

  let submitting = false;
  setFormValues(form, defaultValues);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    //prevent other submission
    if (submitting) return;

    //show loading, disabled button
    showLoading(form);
    submitting = true;

    //get form values
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    console.log(formValues);

    //validation
    //if valid trigger submit callback
    //otherwide, show validatio errors
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}
