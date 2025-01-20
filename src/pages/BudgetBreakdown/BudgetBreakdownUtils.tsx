import { Fragment } from 'react';

import { Typography } from '@mui/material';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

/**
 * Creates the date range title component.
 * @param startDate The start date value.
 * @param endDate The end date value.
 */
export const formatReadableDate = (startDate: string, endDate: string) => {
    const d1 = dayjs(startDate);
    const d2 = dayjs(endDate);
    const format = d1.year() !== d2.year() ? 'dddd D MMMM YYYY' : 'dddd D MMMM';
    return (
        <Fragment>
            <Typography
                component='span'
                sx={{ fontWeight: 'bold', fontSize: 'inherit' }}
            >
                {d1.format(format)}
            </Typography>{' '}
            to{' '}
            <Typography
                component='span'
                sx={{ fontWeight: 'bold', fontSize: 'inherit' }}
            >
                {d2.format(format)}
            </Typography>
        </Fragment>
    );
};

/**
 * Simple abstraction to create a month number string.
 * @param numMonths THe month quantity.
 * @returns The formatted string in format `(3 months)`, `(1 month)`.
 */
export const formatNumMonths = (numMonths: number) => {
    return `(${numMonths} ${numMonths > 1 ? 'months' : 'month'})`;
};
