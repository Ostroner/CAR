import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL =  'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong. Please try again.';

    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
