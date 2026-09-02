/**
 * Wrapper for standardised API response.
 * @category Global Types
 */
export interface IStandardResponse<Payload> {
    status: number;
    message?: string;
    error?: string;
    payload?: Payload;
}
