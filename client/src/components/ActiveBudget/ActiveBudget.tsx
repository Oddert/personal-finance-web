import { FC } from 'react';
import {
    Autocomplete,
    Box,
    FormLabel,
    TextField,
} from '@mui/material';

import { budget } from '../../pages/BudgetBreakdown/BudgetBreakdown';

import { IProps } from './ActiveBudget.types';

const ActiveBudget: FC<IProps> = ({ monthBudget, setMonthBudget }) => {
    return (
        <Box
            sx={{
                display: 'inline-flex',
                gridGap: '16px',
                alignItems: 'center',
            }}
        >
            <FormLabel>Budget: </FormLabel>
            <Autocomplete
                autoHighlight
                disablePortal
                isOptionEqualToValue={(option) => option.id === monthBudget?.id}
                getOptionLabel={(option) => option.name}
                onChange={(event, nextBudget) => {
                    if (!nextBudget) {
                        return
                    }
                    setMonthBudget(nextBudget)
                }}
                options={budget}
                renderInput={(params) => (
					<TextField
						{...params}
						label=''
						placeholder='unset'
                    />
                )}
                sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                        padding: '2px',
                    }
                }}
                value={monthBudget}
            />
        </Box>
    )
}

export default ActiveBudget
