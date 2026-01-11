import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy in vite config handles localhost:5000
    withCredentials: true,
});

export default api;
