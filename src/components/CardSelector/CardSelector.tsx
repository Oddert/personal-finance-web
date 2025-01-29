import { FC, SyntheticEvent, useCallback } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import { ICard } from '../../types/Card.types';

import {
    getActiveCard,
    getCardResponse,
} from '../../redux/selectors/cardSelectors';
import { setActiveCardWithTransactions } from '../../redux/thunks/cardThunks';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import { IProps } from './CardSelector.types';

/**
 * Re-usable selector component for the Active Card.
 *
 * Lower order component; only displays an Autoselect, no additional layout or labels.
 * @component
 * @category Components
 * @subcategory Card Selector
 * @param props.refreshTransactions If true, transactions will als be re-requested on change.
 */
const CardSelector: FC<IProps> = ({ refreshTransactions, sx }) => {
    const dispatch = useAppDispatch();

    const cards = useAppSelector(getCardResponse);
    const activeCard = useAppSelector(getActiveCard);

    const handleChangeCard = useCallback(
        (event: SyntheticEvent, nextValue: ICard | null) => {
            if (nextValue) {
                dispatch(
                    setActiveCardWithTransactions(
                        nextValue,
                        refreshTransactions,
                    ),
                );
            }
        },
        [dispatch],
    );

    return (
        <Autocomplete
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.cardName}
            onChange={handleChangeCard}
            options={cards}
            renderInput={(props) => <TextField {...props} />}
            sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                    padding: '2px',
                },
                ...sx,
            }}
            value={activeCard}
        />
    );
};

export default CardSelector;
