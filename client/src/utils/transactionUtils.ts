import { Transaction } from '../types/Transaction'

export const orderTransactions = (transactions: Transaction[]) => {
    const orderedByDate: { [year: string]: { [month: number]: Transaction[] } } = {}
    const orderedByCategory: { [category: number|string]: Transaction[] } = { default: [] }

    transactions.forEach(transaction => {
        const date = new Date(transaction.date)
        const year = date.getFullYear()
        const month = date.getMonth()
        const category = transaction.category_id || 'default'

        if (!(year in orderedByDate)) {
            orderedByDate[year] = {}
        }
        if (!(month in orderedByDate[year])) {
            orderedByDate[year][month] = []
        }
        if (!(category in orderedByCategory)) {
            orderedByCategory[category] = []
        }

        orderedByDate[year][month].push(transaction)
        orderedByCategory[category].push(transaction)
    })
    return {
        byCategory: orderedByCategory,
        byDate: orderedByDate,
    }
}