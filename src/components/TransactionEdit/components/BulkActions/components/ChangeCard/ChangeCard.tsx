import { type FC, Fragment, useContext, useEffect, useState } from 'react';

import { CreditCard as IconCard } from '@mui/icons-material';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    MenuItem,
    TextField,
} from '@mui/material';

import type { IProps } from './ChangeCard.types';
import type { ICard } from '../../../../../../types/Card.types';

import {
    TransactionEditContext,
    changeCardAll,
} from '../../../../../../contexts/transactionEditContext';
import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../../../redux/selectors/cardSelectors';

export const ChangeCard: FC<IProps> = ({ onClose }) => {
    const { dispatch } = useContext(TransactionEditContext);

    const [card, setCard] = useState<null | ICard>(null);
    const [open, setOpen] = useState(false);

    const cards = useAppSelector(getCardResponse);

    const handleClickSubmit = () => {
        onClose();
        if (card) {
            dispatch(changeCardAll(card.id));
        }
    };

    const handleClickClose = () => {
        setOpen(false);
        onClose();
    };

    useEffect(() => {
        if (cards.length) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCard(cards[0]);
        }
    }, [cards]);

    return (
        <Fragment>
            <MenuItem
                onClick={() => {
                    setOpen(true);
                }}
            >
                <ListItemIcon>
                    <IconCard fontSize='small' />
                </ListItemIcon>
                <ListItemText>Change card</ListItemText>
            </MenuItem>
            <Dialog onClose={handleClickClose} open={open}>
                <DialogTitle>Change the card on all transactions</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        getOptionKey={(opt) => opt.id}
                        getOptionLabel={(opt) => opt.cardName}
                        onChange={(_, value) => {
                            setCard(value);
                        }}
                        options={cards}
                        renderInput={(props) => <TextField {...props} />}
                        value={card}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose}>Cancel</Button>
                    <Button
                        disabled={!card}
                        onClick={handleClickSubmit}
                        variant='contained'
                    >
                        Update transactions
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ChangeCard;
