import axios from 'axios';

import router, { ROUTES } from '../constants/routerConstants';

import { AuthLSService } from '../services/AuthLSService';

import { getServerURL } from '../utils/requestUtils';
import store from '../redux/constants/store';
import { userUnauthenticated } from '../redux/thunks/authThunks';

const baseURL = getServerURL();

/**
 * Re-usable Axios request object.
 *
 * NOTE: Interceptors used will attempt to return `response.data`, not `AxiosResponse<any, any>>` as suggested.
 */
const request = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

request.interceptors.request.use((config) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('[request]', config.url);
    }
    const token = AuthLSService.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.status === 401) {
            store.dispatch(userUnauthenticated());
            router.navigate(ROUTES.LOGIN);
            return error;
        }
        if (error.status < 200 || error.status >= 300) {
            console.error(error);
        }
        return error;
    },
);

export default request;
