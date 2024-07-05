import axios from 'axios';
import { getToken } from '../auth/tokenManager';

const BASE_URL = "http://localhost:8080"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
});

apiClient.interceptors.request.use(
  function(config) {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${getToken()}`;
    }
    return config;
  },
);
