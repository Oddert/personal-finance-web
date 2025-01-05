export interface IBudgetRow {
    label: string
    value: number
    varLowPc: number
    varHighPc: number
}

export interface IBudget {
    id: number
    name: string
    budget: {
        [key: number]: IBudgetRow
    }
}
