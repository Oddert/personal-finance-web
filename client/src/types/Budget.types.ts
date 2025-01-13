export interface IBudgetRow {
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
	createdOn: string
	updatedOn: string
    budget: {
        [key: number]: IBudgetRow
    }
}
