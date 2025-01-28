import { FC, SyntheticEvent } from 'react';

import { Autocomplete, Box, FormControlLabel, TextField } from '@mui/material';

import { ICard } from '../../../types/Card.types';

import {
    getActiveCard,
    getCardResponse,
} from '../../../redux/selectors/cardSelectors';
import { setActiveCard } from '../../../redux/slices/cardSlice';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../hooks/ReduxHookWrappers';

import { IProps } from './CardSelection.types';

const CardSelection: FC<IProps> = () => {
    const dispatch = useAppDispatch();

    const cards = useAppSelector(getCardResponse);
    const activeCard = useAppSelector(getActiveCard);

    const handleChange = (event: SyntheticEvent, card: ICard | null) => {
        if (card) {
            dispatch(setActiveCard({ card }));
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
            }}
        >
            <FormControlLabel
                control={
                    <Autocomplete
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.cardName}
                        onChange={handleChange}
                        options={cards}
                        renderInput={(props) => <TextField {...props} />}
                        sx={{ minWidth: '20vw' }}
                        value={activeCard}
                    />
                }
                label='Card / Account'
                labelPlacement='top'
                sx={{
                    m: '16px 0',
                    '& .MuiFormControlLabel-label': {
                        alignSelf: 'flex-start',
                    },
                }}
            />
        </Box>
    );
};

export default CardSelection;
