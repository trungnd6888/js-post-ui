import axiosClient from './axiosClient';

const studentApi = {
  getAll(params) {
    const url = '/students';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/students/${id}`;
    return axiosClient.get(url).data;
  },

  add(data) {
    const url = '/students';
    return axiosClient.post(url, data).data;
  },

  update(data) {
    const url = `/students/${data.id}`;
    return axiosClient.patch(url, data).data;
  },

  remove(id) {
    const url = `/students/${id}`;
    return axiosClient.delete(url).data;
  },
};

export default studentApi;
