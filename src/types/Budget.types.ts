/**
 * A single budget row representing one category and its target value.
 * @category Global Types
 */
export interface IBudgetRow {
    id: number;
    categoryId: number;
    colour: string;
    label: string;
    value: number;
    varLowPc: number;
    varHighPc: number;
}

/**
 * A whole budget from the API service, including budget rows.
 * @category Global Types
 */
export interface IBudget {
    budgetRows: IBudgetRow[];
    cardId: number | null;
    createdOn: string;
    id: number;
    isDefault: boolean;
    longDescription: string;
    name: string;
    shortDescription: string;
    updatedOn: string;
}

/**
 * Data structure used to represent one budget row with comparable aggregated category totals.
 *
 * Used as a standard chart data object throughout the budget page charts.
 * @category Global Types
 */
export interface IBudgetDatum {
    colour: string;
    categoryId: number;
    categoryName: string;
    budget: number;
    spend: number;
    diffFloat: number;
    diffPc: number;
    variance: [number, number];
}
