import { useContext, useMemo, type FC } from 'react';

import type { IProps } from './CardSelector.types';
import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../../../redux/selectors/cardSelectors';
import { Autocomplete, TableCell, TextField } from '@mui/material';
import { changeCard, TransactionEditContext } from '../../../../../../contexts/transactionEditContext';

const marginTopBottom = '4px';

const CardSelector: FC<IProps> = ({ transaction }) => {
    const { dispatch } = useContext(TransactionEditContext);

    const cards = useAppSelector(getCardResponse);

    const value = useMemo(() => {
        return cards.find(card => card.id === transaction.card) 
    }, [cards]);

    return (
        <TableCell>
            <Autocomplete
                autoHighlight
                disablePortal
                getOptionLabel={option => option.cardName}
                isOptionEqualToValue={(option) => option.id === value?.id}
                onChange={(_, card) => {
                    if (!card) {
                        return;
                    }
                    dispatch(
                        changeCard(
                            transaction.tecTempId as string,
                            card.id,
                        ),
                    );
                }}
                options={cards}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='unset'
                        sx={{
                            paddingTop: marginTopBottom,
                            paddingBottom: marginTopBottom,
                        }}
                    />
                )}
                sx={{
                    borderWidth:
                        transaction.assignedCategory === 'unset' ? 4 : 1,
                    width: '100%',
                    '& .MuiInputBase-root': {
                        padding: '2px',
                    },
                }}
                value={value}
            />
        </TableCell>
    );
};

export default CardSelector;
