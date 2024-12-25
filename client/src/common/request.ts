import axios from 'axios'

import { getServerURL } from '../utils/requestUtils'

const baseURL = getServerURL()

const request = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

request.interceptors.request.use((config) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('[request]', config.url);
    }
    return config;
})

request.interceptors.response.use((response) => {
    if (response.status < 200 || response.status >= 300) {
        console.error(response)
    }
    return response.data;
})

export default request
