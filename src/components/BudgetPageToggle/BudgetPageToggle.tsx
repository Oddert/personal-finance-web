import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button } from '@mui/material';

import { ROUTES } from '../../constants/routerConstants';

import { DATE_FORMAT } from '../../utils/budgetUtils';

import type { IProps } from './BudgetPageToggle.types';

/**
 * Allows the user to switch between the Budget Overview and Budget Breakdown pages, copying the provided date range.
 *
 * Static button appearing on the bottom-left of the viewport.
 * @category Component
 * @subcategory Budget Page Toggle
 * @component
 * @param props.endDate The end date of the selected view.
 * @param props.mode The current page.
 * @param props.startDate The start date of the selected view.
 */
const BudgetPageToggle: FC<IProps> = ({ endDate, mode, startDate }) => {
    const { t } = useTranslation();

    const href = useMemo(
        () =>
            `${
                mode === 'breakdown'
                    ? ROUTES.BUDGET_OVERVIEW
                    : ROUTES.BUDGET_BREAKDOWN
            }?startDate=${startDate.format(DATE_FORMAT)}&endDate=${endDate.format(DATE_FORMAT)}`,
        [endDate, mode, startDate],
    );

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
            }}
        >
            <Button href={href} variant='contained'>
                {mode === 'breakdown'
                    ? t('View budget overview')
                    : t('View budget breakdown')}
            </Button>
        </Box>
    );
};

export default BudgetPageToggle;
