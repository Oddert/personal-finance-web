import request from '../common/request';
import { IBudget } from '../types/Budget.types';

import type { Category } from '../types/Category';
import type { Matcher } from '../types/Matcher';
import type { Transaction } from '../types/Transaction';

/**
 * Primary interface for interacting with the API.
 *
 * Contains a list of functions for calling endpoints.
 * @category Services
 */
const APIService = Object.freeze({
    // Transactions
    /**
     * Creates multiple Transactions at once.
     * @param transactions The list of partial Transactions to create.
     * @returns The list of created Transactions.
    */
   createManyTransactions: async (transactions: Partial<Transaction>[]) => {
       return await request.post(`/transaction/create-many`, { transactions })
    },
    /**
     * Gets a list of all Transactions between two dates.
     * @param startDate The start of the transaction query range.
     * @param endDate The end of the transaction query range.
     * @returns Transactions within the date range.
     */
    getAllTransactions: async (startDate?: string, endDate?: string) => {
        const from = startDate ? `?from=${startDate}` : ''
        const to = endDate ? `&to=${endDate}` : ''
        return await request.get(`/transaction${from}${to}`)
    },
    /**
     * Updates multiple Transactions at once.
     * @param transactions The list of Transactions to update.
     * @returns The list of updated Transactions.
     */
    updateManyTransactions: async (transactions: Partial<Transaction>[]) => {
        return await request.put(`/transaction/update-many`, { transactions })
    },

    // Categories
    /**
     * Creates a single Category.
     * @param category The partial Category to create.
     * @returns The created Category.
     */
    createCategory: async (category: Partial<Category>) => {
        return await request.post(`/category`, category)
    },
    /**
     * Deletes a single Category.
     * @param categoryId The Category ID to delete.
     * @returns The Category id confirming the delete.
    */
   deleteSingleCategory: async (categoryId: Category['id']) => {
       return await request.delete(`/category/${categoryId}`)
    },
    /**
     * Returns all Categories belonging to a user.
     * @returns The list of Categories.
     */
    getAllCategories: async () => {
        return await request.get(`/category`)
    },
    /**
     * Returns all Categories belonging to a user with the Matchers joined.
     * @returns The list of Categories.
     */
    getAllCategoriesWithMatchers: async () => {
        return await request.get(`/category?includeMatchers=true`)
    },
    /**
     * Updates a single Category.
     * @param category The Category to create.
     * @returns The updated Category.
     */
    updateCategory: async (category: Partial<Category>) => {
        return await request.put(`/category/${category.id}`, category)
    },

    // Matchers
    /**
     * Creates a single Matcher.
     * @param matcher The partial Matcher to create.
     * @param categoryId The ID of the Category to assign the matcher to.
     * @returns The created Matcher.
     */
    addSingleMatcher: async (matcher: Partial<Matcher>, categoryId: Category['id']) => {
        return await request.post(`/matcher/`, { ...matcher, categoryId })
    },
    /**
     * Deletes a single Matcher.
     * @param id The ID of the Matcher to delete.
     * @returns The ID of the Matcher, confirming the delete.
     */
    deleteSingleMatcher: async (id: number|string) => {
        return await request.delete(`/matcher/${id}`)
    },
    /**
     * Updates a single Matcher.
     * @param matcher The partial Matcher to create.
     * @param matcherId The ID of the Matcher to update.
     * @returns The updated Matcher.
     */
    updateSingleMatcher: async (matcher: Partial<Matcher>, matcherId: Matcher['id']) => {
        return await request.put(`/matcher/${matcherId}`, matcher)
    },

    // Budges
    /**
     * Creates a single Budget.
     * @param budget The partial Budget to create.
     * @returns The created Budget.
     */
    createSingleBudget: async (budget: IBudget) => {
        return await request.post(`/budget`, budget)
    },
    /**
     * Deletes a single Budget.
     * @param budgetId The partial Budget to delete.
     * @returns The ID of the budget, confirming the delete.
     */
    deleteSingleBudget: async (budgetId: number) => {
        return await request.delete(`/budget/${budgetId}`)
    },
    /**
     * Returns all budgets for a user.
     * @returns The list of Budgets.
     */
    getAllBudgets: async () => {
        return await request.get('/budget')
    },
    /**
     * Gets a budget by ID.
     *
     * Throws 404 if the budget ID is invalid.
     * @param budgetId The ID of the Budget to request.
     * @returns The Budget.
     */
    getSingleBudget: async (budgetId: number) => {
        return await request.get(`/budget/${budgetId}`)
    },
    /**
     * Updates the user preferences to set a new default (active) Budget.
     * @param budgetId The Budget ID to set as default.
     */
    setBudgetPreference: async (budgetId: number) => {
        return await request.put(`/budget/preferences/${budgetId}`)
    },
    /**
     * Updates a single Budget.
     * @param budget The Budget to update.
     * @param budgetId The ID of the Budget.
     * @returns The updated Budget.
     */
    updateSingleBudget: async (budget: IBudget, budgetId: number) => {
        return await request.put(`/budget/${budgetId}`, budget)
    },
})

export default APIService
