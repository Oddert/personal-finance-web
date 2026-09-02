/**
 * A single budget row representing one category and its target value.
 * @category Types
 * @subcategory Budget
 */
export interface IBudgetRow {
    /** The category assigned to this measure. */
    categoryId: string;
    /** CSS colour string for some display elements. */
    colour: string;
    /** Unique identifier. */
    id: string;
    /** User-readable category name. */
    label: string;
    /** The expected or target value. */
    value: number;
    /** Maximum percentage lower than the target which should be considered abnormal, notable, or undesirable. */
    varHighPc: number;
    /** Maximum percentage higher than the target which should be considered abnormal, notable, or undesirable. */
    varLowPc: number;
}

/**
 * A whole budget from the API service, including budget rows.
 * @category Types
 * @subcategory Budget
 */
export interface IBudget {
    /** The individual targets defined by a Category which set a target and variance range. */
    budgetRows: IBudgetRow[];
    /** Card / account associated with the Budget. Budget's are single-card only. */
    cardId: string | null;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** Unique identifier. */
    id: string;
    /** True if the budget is selected by default. */
    isDefault: boolean;
    /** Longer description of the Budget shown on some pages. */
    longDescription: string;
    /** Title for the Budget. */
    name: string;
    /** Shorter summary description of the Budget. */
    shortDescription: string;
    /** ISO timestamp of most recent save. */
    updatedOn: string;
}

/**
 * Data structure used to represent one budget row with comparable aggregated category totals.
 *
 * Used as a standard chart data object throughout the budget page charts.
 * @category Types
 * @subcategory Budget
 */
export interface IBudgetDatum {
    /** CSS colour string for some display elements. */
    colour: string;
    /** The ID of the category assigned to this measure. */
    categoryId: string;
    /** The display name of the category assigned to this measure. */
    categoryName: string;
    /** The expected / desired target value. */
    budget: number;
    /** The actual value spent. */
    spend: number;
    /** The difference in spend from the target value as a (float) number. */
    diffFloat: number;
    /** The difference in spend from the target value as a percentage. */
    diffPc: number;
    /** Percentage over / under spend for this Budget. */
    variance: [number, number];
}
