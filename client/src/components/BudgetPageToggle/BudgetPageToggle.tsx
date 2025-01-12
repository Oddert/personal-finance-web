import { FC, useMemo } from 'react';

import { Box, Button } from '@mui/material';

import { IProps } from './BudgetPageToggle.types';
import { ROUTES } from '../../constants/routerConstants';

const BudgetPageToggle: FC<IProps> = ({ endDate, mode, startDate }) => {
    const href = useMemo(() => 
        `${
            mode === 'breakdown'
                ? ROUTES.BUDGET_OVERVIEW
                : ROUTES.BUDGET_BREAKDOWN
        }?startDate=${startDate}&endDate=${endDate}`,
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
                {mode === 'breakdown' ? 'View budget overview' : 'View budget breakdown'}
            </Button>
        </Box>
    );
}

export default BudgetPageToggle;
