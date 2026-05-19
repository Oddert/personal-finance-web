import type { FC, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Autocomplete, Box, FormControlLabel, TextField } from '@mui/material';

import type { IProps } from './CardSelection.types';
import type { ICard } from '../../../../types/Card.types';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import {
    getActiveCard,
    getCardResponse,
} from '../../../../redux/selectors/cardSelectors';
import { setActiveCard } from '../../../../redux/slices/cardSlice';

const CardSelection: FC<IProps> = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const cards = useAppSelector(getCardResponse);
    const activeCard = useAppSelector(getActiveCard);

    const handleChange = (_: SyntheticEvent, card: ICard | null) => {
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
                label={t('Transaction.cardSlashAccount')}
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
