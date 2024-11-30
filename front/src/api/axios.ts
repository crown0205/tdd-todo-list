import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_TEST === 'true'
      ? import.meta.env.VITE_API_URL
      : 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default axiosInstance;
