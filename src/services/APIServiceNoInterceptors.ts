import { blankRequest } from '../common/request';

import type { IBudget } from '../types/Budget.types';
import type { ICard } from '../types/Card.types';
import type { ICategory } from '../types/Category.d';
import type { IMatcher } from '../types/Matcher.d';
import type { IStandardResponse } from '../types/Request.d';
import { IScenario } from '../types/Scenario.types';
import type { ITransaction } from '../types/Transaction.d';

/**
 * Service for interacting with the application API.
 *
 * Routes do not include a re-authentication catch on failed requests.
 *
 * Re-authentication must be handled by callee logic to ensure smooth user experience. If in doubt, use {@link APIService}.
 * @category Services
 * @subcategory API Service
 */
const APIServiceNoInterceptors = Object.freeze({
    // Transactions
    /**
     * Creates multiple Transactions at once.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param transactions The list of partial Transactions to create.
     * @returns The list of created Transactions.
     */
    createManyTransactions: async (transactions: Partial<ITransaction>[]) => {
        const response = await blankRequest.post<
            IStandardResponse<{
                createdTransactions: ITransaction[];
            }>
        >(`/transaction/create-many`, {
            transactions,
        });
        return response;
    },
    /**
     * Updates multiple Transactions at once.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param transactions The list of Transactions to update.
     * @returns The list of updated Transactions.
     */
    updateManyTransactions: async (transactions: Partial<ITransaction>[]) => {
        const response = await blankRequest.put<
            IStandardResponse<{
                updatedTransactions: ITransaction[];
            }>
        >(`/transaction/update-many`, {
            transactions,
        });
        return response;
    },

    // Categories
    /**
     * Creates a single Category.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param category The partial Category to create.
     * @returns The created Category.
     */
    createCategory: async (category: Partial<ICategory>) => {
        const response = await blankRequest.post<
            IStandardResponse<{ category: ICategory }>
        >(`/category`, category);
        return response;
    },
    /**
     * Deletes a single Category.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param categoryId The Category ID to delete.
     * @returns The Category ID confirming the delete.
     */
    deleteSingleCategory: async (categoryId: ICategory['id']) => {
        const response = await blankRequest.delete<
            IStandardResponse<{ deleted: number }>
        >(`/category/${categoryId}`);
        return response;
    },
    /**
     * Updates a single Category.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param category The Category to create.
     * @returns The updated Category.
     */
    updateCategory: async (category: Partial<ICategory>) => {
        const response = await blankRequest.put<
            IStandardResponse<{ category: ICategory }>
        >(`/category/${category.id}`, category);
        return response;
    },

    // Matchers
    /**
     * Creates a single Matcher.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param matcher The partial Matcher to create.
     * @param categoryId The ID of the Category to assign the matcher to.
     * @returns The created Matcher.
     */
    createSingleMatcher: async (
        matcher: Partial<IMatcher>,
        categoryId: ICategory['id'],
    ) => {
        const response = await blankRequest.post<
            IStandardResponse<{ matcher: IMatcher }>
        >(`/matcher/`, { ...matcher, categoryId });
        return response;
    },
    /**
     * Deletes a single Matcher.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param matcherId The ID of the Matcher to delete.
     * @returns The ID of the Matcher, confirming the delete.
     */
    deleteSingleMatcher: async (matcherId: string) => {
        const response = await blankRequest.delete<
            IStandardResponse<{ deleted: number }>
        >(`/matcher/${matcherId}`);
        return response;
    },
    /**
     * Updates a single Matcher.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param matcher The partial Matcher to create.
     * @param matcherId The ID of the Matcher to update.
     * @returns The updated Matcher.
     */
    updateSingleMatcher: async (
        matcher: Partial<IMatcher>,
        matcherId: IMatcher['id'],
    ) => {
        const response = await blankRequest.put<
            IStandardResponse<{ matcher: IMatcher }>
        >(`/matcher/${matcherId}`, matcher);
        return response;
    },

    // Budgets
    /**
     * Creates a single Budget.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param budget The partial Budget to create.
     * @returns The created Budget.
     */
    createSingleBudget: async (budget: IBudget) => {
        const response = await blankRequest.post<
            IStandardResponse<{ budget: IBudget }>
        >(`/budget`, budget);
        return response;
    },
    /**
     * Deletes a single Budget.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param budgetId The partial Budget to delete.
     * @returns The ID of the budget, confirming the delete.
     */
    deleteSingleBudget: async (budgetId: string) => {
        const response = await blankRequest.delete<IStandardResponse<null>>(
            `/budget/${budgetId}`,
        );
        return response;
    },
    /**
     * Updates a single Budget.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param budget The Budget to update.
     * @param budgetId The ID of the Budget.
     * @returns The updated Budget.
     */
    updateSingleBudget: async (budget: IBudget, budgetId: string) => {
        const response = await blankRequest.put<
            IStandardResponse<{ budget: IBudget }>
        >(`/budget/${budgetId}`, budget);
        return response;
    },

    // Cards
    /**
     * Creates a single Card.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param card The partial Card to create.
     * @returns The created Card.
     */
    createSingleCard: async (card: ICard) => {
        const response = await blankRequest.post<
            IStandardResponse<{ card: ICard }>
        >(`/card`, card);
        return response;
    },
    /**
     * Deletes a single Card.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param cardId The partial Card to delete.
     * @returns The ID of the card, confirming the delete.
     */
    deleteSingleCard: async (cardId: string) => {
        const response = await blankRequest.delete<IStandardResponse<null>>(
            `/card/${cardId}`,
        );
        return response;
    },
    /**
     * Updates a single Card.
     *
     * Does not include a re-authentication catch on failed requests.
     * @param card The Card to update.
     * @param cardId The ID of the Card.
     * @returns The updated Card.
     */
    updateSingleCard: async (card: ICard, cardId: string) => {
        const response = await blankRequest.put<
            IStandardResponse<{ card: ICard }>
        >(`/card/${cardId}`, card);
        return response;
    },

    // Scenario
    /**
     * Creates a new scenario.
     *
     * Does not include a re-authentication catch on failed requests.
     * @returns The updated scenario.
     */
    createSingleScenario: async (scenario: IScenario) => {
        const response = await blankRequest.post<
            IStandardResponse<{ scenario: IScenario }>
        >('/scenario', scenario);
        return response;
    },
    /**
     * Deletes a scenario.
     *
     * Does not include a re-authentication catch on failed requests.
     */
    deleteSingleScenario: async (scenarioId: string) => {
        const response = await blankRequest.delete<IStandardResponse<{}>>(
            `/scenario/${scenarioId}`,
        );
        return response;
    },
    /**
     * Updates a scenario.
     *
     * Does not include a re-authentication catch on failed requests.
     * @returns The updated scenario.
     */
    updateSingleScenario: async (scenarioId: string, scenario: IScenario) => {
        const response = await blankRequest.put<
            IStandardResponse<{ scenario: IScenario }>
        >(`/scenario/${scenarioId}`, scenario);
        return response;
    },
});

export default APIServiceNoInterceptors;
