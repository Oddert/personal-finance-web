
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

export const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Given a date in any string format parsable by dayjs.
 *
 * Returns the first day of that month in format YYYY-MM-DD.
 * @param rawDate The date to be flattened.
 * @returns The new date string in standard format.
 */
export const toBeginningMonth = (rawDate: string|Date) => {
    const date = dayjs(rawDate).date(1);
    return date.format(DATE_FORMAT);
}

/**
 * Given a date in any string format parsable by dayjs.
 *
 * Returns the last day of that month in format YYYY-MM-DD.
 * @param rawDate The date to be ceilinged.
 * @returns The new date string in standard format.
 */
export const toEndMonth = (rawDate: string|Date) => {
    const date = dayjs(rawDate).endOf('month')
    return date.format(DATE_FORMAT);
}
