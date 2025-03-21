import { ROUTES_FACTORY } from '../constants/routerConstants';

/**
 * Creates a URL path to the login page with the current path and query parameters encoded as the return address.
 * @example
 * createLoginAddrWithReturn() === '/login?redirect=/budget?startDate=2025-03-21&endDate=2025-04-01'
 * @returns The path.
 */
export const createLoginAddrWithReturn = () => {
    return ROUTES_FACTORY.LOGIN(
        `${window.location.pathname}${window.location.search}`,
    );
};
