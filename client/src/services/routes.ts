import request from '../common/request';

import type { Category } from '../types/Category';
import type { Matcher } from '../types/Matcher';

const routes = {
    getAllTransactions: async (startDate?: string, endDate?: string) => {
        const from = startDate ? `?from=${startDate}` : ''
        const to = endDate ? `&to=${endDate}` : ''
        return await request.get(`/transaction${from}${to}`)
    },
    createManyTransactions: async (transactions: any) => {
        return await request.post(`/transaction/create-many`, { transactions })
    },
    updateManyTransactions: async (transactions: any) => {
        return await request.put(`/transaction/update-many`, { transactions })
    },
    getAllCategories: async () => {
        return await request.get(`/category`)
    },
    getAllCategoriesWithMatchers: async () => {
        return await request.get(`/category?includeMatchers=true`)
    },
    createCategory: async (category: Partial<Category>) => {
        return await request.post(`/category`, category)
    },
    updateCategory: async (category: Partial<Category>) => {
        return await request.put(`/category/${category.id}`, category)
    },
    deleteSingleCategory: async (categoryId: Category['id']) => {
        return await request.delete(`/category/${categoryId}`)
    },
    addSingleMatcher: async (matcher: Partial<Matcher>, categoryId: Category['id']) => {
        return await request.post(`/matcher/`, { ...matcher, categoryId })
    },
    updateSingleMatcher: async (matcher: Partial<Matcher>, matcherId: Matcher['id']) => {
        return await request.put(`/matcher/${matcherId}`, matcher)
    },
    deleteSingleMatcher: async (id: number|string) => {
        return await request.delete(`/matcher/${id}`)
    },
}

export default routes
