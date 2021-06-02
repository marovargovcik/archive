import axios from 'axios';

import { useAuth } from '../hooks/stores/useAuth';

let isRefreshing = false;
const queue = [];

const processQueue = (token, error) => {
  for (const promise of queue) {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  }
};

axios.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  async (error) => {
    if (
      !error.response ||
      error.response.status !== 401 ||
      error.config.url.startsWith('/auth') ||
      error.config._retry ||
      error.config._queued
    ) {
      return Promise.reject(error);
    }

    const { config } = error;

    if (isRefreshing) {
      error.config._queued = true;

      try {
        const token = await new Promise((resolve, reject) => {
          return queue.push({ reject, resolve });
        });
        config.headers.Authorization = `Bearer ${token}`;

        return axios(config);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    isRefreshing = true;
    config._retry = true;

    const authStore = useAuth.getState();
    const refreshToken = authStore.refreshToken;

    try {
      const response = await axios.post('/auth/token', {
        refreshToken,
      });
      const { accessToken } = response.data.payload;
      authStore.setAccessToken(accessToken);
      config.headers.Authorization = `Bearer ${accessToken}`;
      processQueue(accessToken, undefined);
      return axios(config);
    } catch (error) {
      authStore.reset();
      processQueue(undefined, error);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

axios.interceptors.request.use((config) => {
  // skipping request with config._queued or config._retry to not overwrite
  // bearer token as it was set in response interceptor
  if (config.url.startsWith('/auth') || config._queued || config._retry) {
    return config;
  }
  const authStore = useAuth.getState();
  const accessToken = authStore.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
