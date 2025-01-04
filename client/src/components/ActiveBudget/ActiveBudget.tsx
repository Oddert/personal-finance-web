import { FC } from 'react';
import {
    Autocomplete,
    Box,
    FormLabel,
    TextField,
} from '@mui/material';

import { budget } from '../../pages/Budget/Budget';

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
                placeholder='unset'
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label='Category'
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
