/**
 * Determines the base URL used to communicate with the server.
 * @returns
 */
export const getServerURL = (): string => {
    // Temporary hard-coded value. Swap with selection logic if / when hosting method established.
    return 'http://localhost:3000/';
};
