import request from '../common/request';

import type { IUser } from '../types/Auth.types';
import type { IBudget } from '../types/Budget.types';
import type { ICard } from '../types/Card.types';
import type { Category } from '../types/Category.d';
import type { Matcher } from '../types/Matcher.d';
import type { IStandardResponse } from '../types/Request.d';
import type { Transaction } from '../types/Transaction.d';

/**
 * Primary interface for interacting with the API.
 *
 * Contains a list of functions for calling endpoints.
 * @category Services
 * @subcategory API Service
 */
const APIService = Object.freeze({
    // Auth
    /**
     * Checks if a username is already taken.
     * @param username The entered username.
     * @returns True if the user already exists, false if the name is available.
     */
    checkUserExists: async (username: string) => {
        const response: IStandardResponse<{
            exists: boolean;
        }> = await request.post(`/auth/user-exists/${username}`);
        return response;
    },
    /**
     * Attempts to login the user.
     * @param username The entered username.
     * @param password The entered password.
     * @returns The access and refresh tokens or a failed login attempt.
     */
    loginUser: async (username: string, password: string) => {
        const response: IStandardResponse<{
            accessToken: string;
            refreshToken: string;
            user: IUser;
        }> = await request.post('/auth/login', { username, password });
        return response;
    },
    /**
     * Gets the full user details for a logged in user.
     * @returns The user details.
     * @param refreshToken The user's last refresh token.
     * @returns The access and refresh tokens or a failed login attempt.
     */
    refreshToken: async (refreshToken: string) => {
        const response: IStandardResponse<{
            accessToken: string;
            refreshToken: string;
            user: IUser;
        }> = await request.post('/auth/refresh-token', { refreshToken });
        return response;
    },
    /**
     * Gets the full user details for a logged in user.
     * @returns The user details.
     */
    userDetails: async () => {
        const response: IStandardResponse<{ user: IUser }> =
            await request.get('/auth/user');
        return response;
    },

    // Transactions
    /**
     * Creates multiple Transactions at once.
     * @param transactions The list of partial Transactions to create.
     * @returns The list of created Transactions.
     */
    createManyTransactions: async (transactions: Partial<Transaction>[]) => {
        const response: IStandardResponse<{
            createdTransactions: Transaction[];
        }> = await request.post(`/transaction/create-many`, { transactions });
        return response;
    },
    /**
     * Gets a list of all Transactions held by the database.
     * @returns Transactions within the date range.
     */
    getAllTransactions: async () => {
        const response: IStandardResponse<{ transactions: Transaction[] }> =
            await request.get(`/transaction`);
        return response;
    },
    /**
     * Gets a list of all Transactions between two dates.
     * @param startDate The start of the transaction query range.
     * @param endDate The end of the transaction query range.
     * @returns Transactions within the date range.
     */
    getAllTransactionsWithinRange: async (
        startDate: number,
        endDate: number,
        activeCardId: number | null,
    ) => {
        const from = `?from=${new Date(startDate).toISOString()}`;
        const to = `&to=${new Date(endDate).toISOString()}`;
        const activeCard = activeCardId ? `&cardId=${activeCardId}` : '';
        const response: IStandardResponse<{ transactions: Transaction[] }> =
            await request.get(`/transaction${from}${to}${activeCard}`);
        return response;
    },
    /**
     * Updates multiple Transactions at once.
     * @param transactions The list of Transactions to update.
     * @returns The list of updated Transactions.
     */
    updateManyTransactions: async (transactions: Partial<Transaction>[]) => {
        const response: IStandardResponse<{
            updatedTransactions: Transaction[];
        }> = await request.put(`/transaction/update-many`, { transactions });
        return response;
    },

    // Categories
    /**
     * Creates a single Category.
     * @param category The partial Category to create.
     * @returns The created Category.
     */
    createCategory: async (category: Partial<Category>) => {
        const response: IStandardResponse<{ category: Category[] }> =
            await request.post(`/category`, category);
        return response;
    },
    /**
     * Deletes a single Category.
     * @param categoryId The Category ID to delete.
     * @returns The Category ID confirming the delete.
     */
    deleteSingleCategory: async (categoryId: Category['id']) => {
        const response: IStandardResponse<{ deleted: number }> =
            await request.delete(`/category/${categoryId}`);
        return response;
    },
    /**
     * Returns all Categories belonging to a user.
     * @returns The list of Categories.
     */
    getAllCategories: async () => {
        const response: IStandardResponse<{ categories: Category[] }> =
            await request.get(`/category`);
        return response;
    },
    /**
     * Returns all Categories belonging to a user with the Matchers joined.
     * @returns The list of Categories.
     */
    getAllCategoriesWithMatchers: async () => {
        const response: IStandardResponse<{ categories: Category[] }> =
            await request.get(`/category?includeMatchers=true`);
        return response;
    },
    /**
     * Updates a single Category.
     * @param category The Category to create.
     * @returns The updated Category.
     */
    updateCategory: async (category: Partial<Category>) => {
        const response: IStandardResponse<{ category: Category }> =
            await request.put(`/category/${category.id}`, category);
        return response;
    },

    // Matchers
    /**
     * Creates a single Matcher.
     * @param matcher The partial Matcher to create.
     * @param categoryId The ID of the Category to assign the matcher to.
     * @returns The created Matcher.
     */
    addSingleMatcher: async (
        matcher: Partial<Matcher>,
        categoryId: Category['id'],
    ) => {
        const response: IStandardResponse<{ matcher: Matcher }> =
            await request.post(`/matcher/`, { ...matcher, categoryId });
        return response;
    },
    /**
     * Deletes a single Matcher.
     * @param matcherId The ID of the Matcher to delete.
     * @returns The ID of the Matcher, confirming the delete.
     */
    deleteSingleMatcher: async (matcherId: number | string) => {
        const response: IStandardResponse<{ deleted: number }> =
            await request.delete(`/matcher/${matcherId}`);
        return response;
    },
    /**
     * Updates a single Matcher.
     * @param matcher The partial Matcher to create.
     * @param matcherId The ID of the Matcher to update.
     * @returns The updated Matcher.
     */
    updateSingleMatcher: async (
        matcher: Partial<Matcher>,
        matcherId: Matcher['id'],
    ) => {
        const response: IStandardResponse<{ matcher: Matcher }> =
            await request.put(`/matcher/${matcherId}`, matcher);
        return response;
    },

    // Budgets
    /**
     * Creates a single Budget.
     * @param budget The partial Budget to create.
     * @returns The created Budget.
     */
    createSingleBudget: async (budget: IBudget) => {
        const response: IStandardResponse<{ budget: IBudget }> =
            await request.post(`/budget`, budget);
        return response;
    },
    /**
     * Deletes a single Budget.
     * @param budgetId The partial Budget to delete.
     * @returns The ID of the budget, confirming the delete.
     */
    deleteSingleBudget: async (budgetId: number) => {
        const response: IStandardResponse<null> = await request.delete(
            `/budget/${budgetId}`,
        );
        return response;
    },
    /**
     * Returns all cards for a user.
     * @returns The list of Budgets.
     */
    getAllBudgets: async () => {
        const response: IStandardResponse<{ budgets: IBudget[] }> =
            await request.get<IBudget>('/budget');
        return response;
    },
    /**
     * Gets a budget by ID.
     *
     * Throws 404 if the budget ID is invalid.
     * @param budgetId The ID of the Budget to request.
     * @returns The Budget.
     */
    getSingleBudget: async (budgetId: number) => {
        const response: IStandardResponse<{ budget: IBudget }> =
            await request.get(`/budget/${budgetId}`);
        return response;
    },
    /**
     * Updates the user preferences to set a new default (active) Budget.
     * @param budgetId The Budget ID to set as default.
     */
    setBudgetPreference: async (budgetId: number) => {
        const response: IStandardResponse<null> = await request.put(
            `/budget/preferences/${budgetId}`,
        );
        return response;
    },
    /**
     * Updates a single Budget.
     * @param budget The Budget to update.
     * @param budgetId The ID of the Budget.
     * @returns The updated Budget.
     */
    updateSingleBudget: async (budget: IBudget, budgetId: number) => {
        const response: IStandardResponse<{ budget: IBudget }> =
            await request.put(`/budget/${budgetId}`, budget);
        return response;
    },

    // Cards
    /**
     * Creates a single Card.
     * @param card The partial Card to create.
     * @returns The created Card.
     */
    createSingleCard: async (card: ICard) => {
        const response: IStandardResponse<{ card: ICard }> = await request.post(
            `/card`,
            card,
        );
        return response;
    },
    /**
     * Deletes a single Card.
     * @param cardId The partial Card to delete.
     * @returns The ID of the card, confirming the delete.
     */
    deleteSingleCard: async (cardId: number) => {
        const response: IStandardResponse<null> = await request.delete(
            `/card/${cardId}`,
        );
        return response;
    },
    /**
     * Returns all cards for a user.
     * @returns The list of Budgets.
     */
    getAllCards: async () => {
        const response: IStandardResponse<{ cards: ICard[] }> =
            await request.get<ICard>('/card');
        return response;
    },
    /**
     * Gets a card by ID.
     *
     * Throws 404 if the card ID is invalid.
     * @param cardId The ID of the Card to request.
     * @returns The Card.
     */
    getSingleCard: async (cardId: number) => {
        const response: IStandardResponse<{ card: ICard }> = await request.get(
            `/card/${cardId}`,
        );
        return response;
    },
    /**
     * Updates the user preferences to set a new default (active) Card.
     * @param cardId The Card ID to set as default.
     */
    setCardPreference: async (cardId: number) => {
        const response: IStandardResponse<null> = await request.put(
            `/card/preferences/${cardId}`,
        );
        return response;
    },
    /**
     * Updates a single Card.
     * @param card The Card to update.
     * @param cardId The ID of the Card.
     * @returns The updated Card.
     */
    updateSingleCard: async (card: ICard, cardId: number) => {
        const response: IStandardResponse<{ card: ICard }> = await request.put(
            `/card/${cardId}`,
            card,
        );
        return response;
    },
});

export default APIService;
