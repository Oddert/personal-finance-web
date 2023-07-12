import request from "../common/request";

const routes = {
    getAllTransactions: async (startDate?: string, endDate?: string) => {
        const from = startDate ? `?from=${startDate}` : ''
        const to = endDate ? `&to=${endDate}` : ''
        return await request.get(`/transaction${from}${to}`)
    }
}

export default routes
