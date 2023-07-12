export interface ResponseData<Payload> {
    status: number
    message?: string
    error?: string
    payload?: Payload
}
