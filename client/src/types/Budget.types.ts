export interface IBudgetRow {
    id: number
    categoryId: number
    label: string
    value: number
    varLowPc: number
    varHighPc: number
}

export interface IBudget {
    id: number
    name: string
    shortDescription: string
    longDescription: string
    isDefault: boolean
	createdOn: string
	updatedOn: string
    budget: {
        [key: number]: IBudgetRow
    }
}
