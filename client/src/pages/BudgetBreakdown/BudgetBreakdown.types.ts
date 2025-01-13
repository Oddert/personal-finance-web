export interface ICategoryBDValue {
    value: number
    label: string
    colour: string
}

export interface ICategoryBreakdown {
    [key: number|string]: ICategoryBDValue
}

export interface IBudgetDatum {
	colour: string
    categoryId: number
    categoryName: string
    budget: number
    spend: number
    diffFloat: number
    diffPc: number
    variance: [number, number]
}
