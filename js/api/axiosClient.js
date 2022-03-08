import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https:js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (!error.response) throw new Error('Network error. Please try again later.');

    if (error.response.status === 401) {
      //clear token, logout
      window.location.assign('/login.html');
      return;
    }

    // return Promise.reject(error);
    throw new Error(error);
  }
);

export default axiosClient;
