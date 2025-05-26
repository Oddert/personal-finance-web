import { CellContext, ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { Box } from '@mui/material';

import type { ITransaction } from '../types/Transaction.d';
import type { ICategory } from '../types/Category.d';
import type { CategoryState } from '../redux/slices/categorySlice';

import useLocalisedNumber from '../hooks/useLocalisedNumber';

import { createReadableNumber } from './commonUtils';

/**
 * Maps over a list of transactions and attempts to assign a Category to `assignedCategory`.
 * @param transactions The incoming transactions.
 * @param orderedCategories List of categories ordered by ID.
 * @returns The transactions with mapped category.
 */
export const mapCategoriesToTransactions = (
    transactions: ITransaction[],
    orderedCategories: CategoryState['orderedData']['byId'],
) => {
    const mappedTransactions = transactions.map((transaction) => {
        if (
            transaction.categoryId &&
            transaction.categoryId in orderedCategories
        ) {
            return {
                ...transaction,
                assignedCategory: orderedCategories[transaction.categoryId],
            };
        }
        return transaction;
    });
    return mappedTransactions;
};

/**
 * Creates ordered data structures for a list of transactions.
 * @param transactions The transactions to sort.
 * @returns The transactions ordered by category and by date (year, month).
 */
export const orderTransactions = (transactions: ITransaction[]) => {
    const orderedByDate: {
        [year: string]: { [month: number]: ITransaction[] };
    } = {};
    const orderedByCategory: { [category: number | string]: ITransaction[] } = {
        default: [],
    };

    transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const category = transaction.categoryId || 'default';

        if (!(year in orderedByDate)) {
            orderedByDate[year] = {};
        }
        if (!(month in orderedByDate[year])) {
            orderedByDate[year][month] = [];
        }
        if (!(category in orderedByCategory)) {
            orderedByCategory[category] = [];
        }

        orderedByDate[year][month].push(transaction);
        orderedByCategory[category].push(transaction);
    });
    return {
        byCategory: orderedByCategory,
        byDate: orderedByDate,
    };
};

/**
 * Reusable column add-in to format currency columns.
 *
 * Displays zero or null values as '-'.
 * @param cell The column cell from react table.
 * @returns A container with the formatted text.
 */
export const addCurrencySymbol = (cell: CellContext<ITransaction, unknown>) => {
    const rawValue = createReadableNumber(cell.renderValue(), 0);
    const value = Number(rawValue);
    const { currencyLocaliser } = useLocalisedNumber();
    return (
        <Box sx={{ textAlign: 'right' }}>
            {isNaN(value) || value === 0 ? '-' : currencyLocaliser(value)}
        </Box>
    );
};

/**
 * Columns for the transaction table on the upload / edit form.
 */
export const transactionColumns = (
    language: string,
    t: TFunction<'translation', undefined>,
): ColumnDef<ITransaction>[] => [
    {
        header: t('literals.Date'),
        accessorKey: 'date',
        cell: (cell) => {
            const value = cell.renderValue();
            if (typeof value === 'number') {
                return new Date(value).toLocaleDateString(language);
            }
            return value;
        },
    },
    {
        header: t('literals.Description'),
        accessorKey: 'description',
    },
    {
        header: t('literals.Out'),
        accessorKey: 'debit',
        cell: addCurrencySymbol,
    },
    {
        header: t('literals.In'),
        accessorKey: 'credit',
        cell: addCurrencySymbol,
    },
    {
        header: t('literals.Ballance'),
        accessorKey: 'ballance',
        cell: addCurrencySymbol,
    },
    {
        header: t('literals.Category'),
        accessorKey: 'assignedCategory',
        cell: (cell) => {
            const value: ICategory | unknown = cell.renderValue();
            if (value && typeof value === 'object' && 'label' in value) {
                return value.label;
            }
            return `- ${t('literals.uncategorised')} -`;
        },
    },
    {
        header: t('Cat Id'),
        accessorKey: 'categoryId',
    },
];

/**
 * Creates a string format for month-year combinations.
 *
 * Using this allows a 'single source of truth' should the format ever need to change.
 * @param year The year code.
 * @param month The month number.
 * @returns The encoded string.
 */
export const getRangeKeyEncoding = (year: string, month: string) => {
    const adjustedMonth = Number(month) + 1;
    const stringMonth =
        adjustedMonth >= 10 ? adjustedMonth : `0${adjustedMonth}`;
    return `${stringMonth}-${year}`;
};

/**
 * Splits a date encoded with {@link getRangeKeyEncoding} into a readable month and year.
 *
 * Returns the month and year pair with the month converted to three character notation (e.g. Jan, Feb, Mar...)
 * @param rangeKey A rangeKey string to be interpreted.
 * @returns The month converted and the year.
 */
const getMonthFromRangeKey = (rangeKey: string): [string, string] => {
    const dateComponents: string[] = rangeKey.split('-');
    const months: { [month: string]: string } = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec',
    };
    return [months[dateComponents[0]], dateComponents[1]];
};

/**
 * Converts a list of range-key-encoded date strings to values for the range selector.
 *
 * The values are index based starting at 0, the labels are three-character month strings except at year boundaries where the year is also included.
 * @param keysArray List of date strings encoded with {@link getRangeKeyEncoding}
 * @returns List of values for the Range component.
 */
export const generateMarks = (
    keysArray: string[],
    t: TFunction<'translation', undefined>,
) => {
    let markStepSize = 1;
    if (keysArray.length > 47) {
        markStepSize = 6;
    } else if (keysArray.length > 23) {
        markStepSize = 3;
    } else if (keysArray.length > 14) {
        markStepSize = 2;
    }

    const marks: { value: number; label: string }[] = [];

    for (let i = 0; i < keysArray.length; i += markStepSize) {
        const [monthLabel, yearLabel] = getMonthFromRangeKey(keysArray[i]);
        marks.push({
            value: i,
            label:
                i === 0 || monthLabel === 'Jan'
                    ? `${t(`monthsShort.${monthLabel}`)} ${yearLabel}`
                    : t(`monthsShort.${monthLabel}`),
        });
    }
    return marks;
};
