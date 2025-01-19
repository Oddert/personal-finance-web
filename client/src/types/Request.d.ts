/**
 * Wrapper for standardised API response.
 * @category Global Types
 */
export declare interface IStandardResponse<Payload> {
    status: number;
    message?: string;
    error?: string;
    payload?: Payload;
}
