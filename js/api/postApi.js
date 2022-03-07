import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url).data;
  },

  add(data) {
    const url = '/posts';
    return axiosClient.post(url, data).data;
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data).data;
  },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url).data;
  },
};

export default postApi;
