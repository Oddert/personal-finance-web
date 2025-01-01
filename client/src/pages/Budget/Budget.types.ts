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
    diffInt: number
    diffPc: number
}
