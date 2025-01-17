/**
 * Wrapper for standardised API response.
 * @category Global Types
 */
export declare interface ResponseData<Payload> {
    status: number
    message?: string
    error?: string
    payload?: Payload
}
