import request from '../common/request';

import type { IBudget } from '../types/Budget.types';
import type { Category } from '../types/Category';
import type { Matcher } from '../types/Matcher';
import { IStandardResponse } from '../types/Request';
import type { Transaction } from '../types/Transaction';

/**
 * Primary interface for interacting with the API.
 *
 * Contains a list of functions for calling endpoints.
 * @category Services
 * @subcategory API Service
 */
const APIService = Object.freeze({
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
     * Gets a list of all Transactions between two dates.
     * @param startDate The start of the transaction query range.
     * @param endDate The end of the transaction query range.
     * @returns Transactions within the date range.
     */
    getAllTransactions: async (startDate?: string, endDate?: string) => {
        const from = startDate ? `?from=${startDate}` : '';
        const to = endDate ? `&to=${endDate}` : '';
        const response: IStandardResponse<{ transactions: Transaction[] }> =
            await request.get(`/transaction${from}${to}`);
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
     * Returns all budgets for a user.
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
});

export default APIService;
