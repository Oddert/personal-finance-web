import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormLabel } from '@mui/material';

import BudgetSelector from '../BudgetSelector/BudgetSelector';

import type { IProps } from './ActiveBudget.types';

/**
 * Displays a form control for the {@link BudgetSele} with a left-aligned label and some formatting.
 * @category Components
 * @subcategory Active Budget
 * @component
 */
const ActiveBudget: FC<IProps> = () => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                display: 'inline-flex',
                gridGap: '16px',
                alignItems: 'center',
            }}
        >
            <FormLabel
                data-testid='components-ActiveBudget__title'
                sx={{ minWidth: '75px', textAlign: 'left' }}
            >
                {t('literals.Budget')}:
            </FormLabel>
            <BudgetSelector />
        </Box>
    );
};

export default ActiveBudget;
