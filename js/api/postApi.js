import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/posts';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  addFormData(data) {
    const url = '/with-thumbnail/posts';
    const config = {
      header: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosClient.post(url, data, config);
  },

  updateFormData(data) {
    const url = `/with-thumbnail/posts/${data.get('id')}`;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosClient.patch(url, data, config);
  },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
