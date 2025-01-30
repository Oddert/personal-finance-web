import { FC } from 'react';
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
    return (
        <Box
            sx={{
                display: 'inline-flex',
                gridGap: '16px',
                alignItems: 'center',
            }}
        >
            <FormLabel sx={{ minWidth: '75px', textAlign: 'left' }}>
                Budget:
            </FormLabel>
            <BudgetSelector />
        </Box>
    );
};

export default ActiveBudget;
