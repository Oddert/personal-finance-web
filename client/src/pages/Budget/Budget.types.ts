export interface ICategoryBDValue {
    value: number
    label: string
    colour: string
}

export interface ICategoryBreakdown {
    [key: number|string]: ICategoryBDValue
}

export interface IBudgetDatum {
    categoryName: string
    budget: number
    spend: number
    diffFloat: number
    diffPc: number
    variance: [number, number]
}

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
