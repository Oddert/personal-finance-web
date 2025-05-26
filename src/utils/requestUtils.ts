import { AxiosError } from 'axios';

import { IStandardResponse } from '../types/Request.d';

/**
 * Determines the base URL used to communicate with the server.
 * @returns
 */
export const getServerURL = (): string => {
    // Temporary hard-coded value. Swap with selection logic if / when hosting method established.
    return 'http://localhost:3000/';
};

export type TRetryFunc<IApiCaller, IResponse> = (
    caller: IApiCaller,
) => IResponse | AxiosError;

/**
 * Attempts to call an endpoint twice, allowing a brief pause for the refresh logic to refresh the user's auth.
 * @param caller Function to call an API endpoint and return a standard response.
 * @returns The response or error.
 */
export async function retry<IResponse>(
    caller: () => Promise<IStandardResponse<IResponse> | AxiosError>,
): Promise<IStandardResponse<IResponse> | AxiosError> {
    try {
        const response1 = await caller();
        if (!response1.status) {
            console.error(
                '[retry] Response received is not a standard response. Attribute "status" is missing.',
            );
        }
        if (!response1.status || response1.status === 401) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const response2 = await caller();
                return response2;
            } catch (error2: any) {
                return error2;
            }
        }
        return response1;
    } catch (error1: any) {
        if (error1.status === 401) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const response2 = await caller();
                return response2;
            } catch (error2: any) {
                return error2;
            }
        }
        return error1;
    }
}
