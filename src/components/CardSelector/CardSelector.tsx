import { type FC, type SyntheticEvent, useCallback } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import type { IProps } from './CardSelector.types';
import type { ICard } from '../../types/Card.types';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';
import {
    getActiveCard,
    getCardResponse,
} from '../../redux/selectors/cardSelectors';
import { setActiveCardWithTransactions } from '../../redux/thunks/cardThunks';

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
        (_event: SyntheticEvent, nextValue: ICard | null) => {
            if (nextValue) {
                dispatch(
                    setActiveCardWithTransactions(
                        nextValue,
                        refreshTransactions,
                    ),
                );
            }
        },
        [dispatch, refreshTransactions],
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
                // eslint-disable-next-line @typescript-eslint/no-misused-spread
                ...(sx ?? {}),
            }}
            value={activeCard}
        />
    );
};

export default CardSelector;
