/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { create as axios } from 'axios';

import store from '../redux/constants/store';
import { refreshAuthentication } from '../redux/thunks/authThunks';
import { AuthLSService } from '../services/AuthLSService';
import { getServerURL } from '../utils/requestUtils';

/**
 * Creates an Axios client with authentication headers and minimal logging.
 * @returns An Axios instance.
 */
export const createBlankRequest = () => {
    const baseURL = getServerURL();

    /**
     * Re-usable Axios request object.
     *
     * NOTE: Interceptors used will attempt to return `response.data`, not `AxiosResponse<any, any>>` as suggested.
     */
    const requestClient = axios({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    requestClient.interceptors.request.use((config) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('[request]', config.url);
        }
        const token = AuthLSService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    return requestClient;
};

/**
 * Standard API request client including automatic re-authentication on failed requests.
 */
const request = createBlankRequest();

request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.status === 401) {
            store.dispatch(refreshAuthentication());
            return error;
        }
        if (error.status < 200 || error.status >= 300) {
            console.error(error);
        }
        return error;
    },
);

export const blankRequest = createBlankRequest();

export default request;
