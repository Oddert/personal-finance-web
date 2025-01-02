import { Typography } from '@mui/material';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Fragment } from 'react';

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

/**
 * Creates the date range title component.
 * @param startDate The start date value.
 * @param endDate The end date value.
 */
export const formatReadableDate = (startDate: string, endDate: string) => {
    const d1 = dayjs(startDate)
    const d2 = dayjs(endDate)
    const format = d1.year() !== d2.year() ? 'dddd D MMMM YYYY' : 'dddd D MMMM';
    return (
        <Fragment>
            <Typography component='span' sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                {d1.format(format)}
            </Typography>
            {' '}to{' '}
            <Typography component='span' sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                {d2.format(format)}
            </Typography>
        </Fragment>
    )
}

/**
 * Simple abstraction to create a month number string.
 * @param numMonths THe month quantity.
 * @returns The formatted string in format `(3 months)`, `(1 month)`.
 */
export const formatNumMonths = (numMonths: number) => {
    return `(${numMonths} ${numMonths > 1 ? 'months' : 'month'})`
}

/**
 * Flattens a number to 2 decimal points.
 *
 * Uses the `toFixed` utility so be careful of precision issues.
 * @param value The raw number value.
 * @returns The number to 2 decimal points.
 */
export const normaliseNum = (value: number) => Number(value.toFixed(2));
