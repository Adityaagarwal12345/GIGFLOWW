import axios from 'axios';

const api = axios.create({
    baseURL:
        import.meta.env.MODE === 'development'
            ? '/api'
            : 'https://gigfloww-10.onrender.com/api',
    withCredentials: true,
});

export default api;
