import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Button,
    Chip,
    ListItem,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { ArrowForward as RightArrowIcon } from '@mui/icons-material';

import router, { ROUTES_FACTORY } from '../../../../constants/routerConstants';

import APIService from '../../../../services/APIService';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { setActiveCard } from '../../../../redux/slices/cardSlice';
import { getActiveCardId } from '../../../../redux/selectors/cardSelectors';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import type { IProps } from './CardTile.types';

const blurCardNumber = (cardNumber: number | string) => {
    const asString = String(cardNumber);
    if (asString.length < 6) {
        return Array.from({ length: asString.length }, () => '•').join(' ');
    }
    const lastFourDigits = asString.substring(asString.length - 4);
    const remainderLen = asString.length - 4;
    const dots = Array.from({ length: remainderLen }, () => '•').join(' ');
    return `${dots} ${lastFourDigits}`;
};

/**
 * TODO: temp implementation, replace with a regex solution
 * @param sortCode The raw sort code to format.
 * @returns The code with dashes between every digit pair.
 */
const formatSortCode = (sortCode: number | string) => {
    const asString = String(sortCode);
    const arr = asString.split('');
    const nextArr: string[] = [];
    arr.forEach((digit, idx) => {
        nextArr.push(digit);
        if (idx % 2 && !(idx === asString.length - 1)) {
            nextArr.push('-');
        }
    });
    return nextArr.join('');
};

/**
 * Displays a single budget.
 *
 * Contains options to navigate to the edit page.
 * @component
 * @category Pages
 * @subcategory Manage Cards
 */
const BudgetCard: FC<IProps> = ({ card }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const activeCardId = useAppSelector(getActiveCardId);

    const handleClickActivate = () => {
        try {
            const request = async () => {
                await APIService.setCardPreference(card.id);
                dispatch(setActiveCard({ card }));
            };
            request();
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };

    const handleClickEdit = () => {
        router.navigate(ROUTES_FACTORY.EDIT_CARD(card.id));
    };

    return (
        <ListItem sx={{ height: '100%' }}>
            <Paper
                elevation={6}
                sx={(theme) => ({
                    padding: '20px 50px',
                    [theme.breakpoints.up('xs')]: {
                        padding: '20px',
                    },
                    width: '100%',
                    height: '100%',
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: '8px',
                    }}
                >
                    <Tooltip title={card.description}>
                        <Typography variant='h3'>{card.cardName}</Typography>
                    </Tooltip>
                    {activeCardId === card.id ? (
                        <Chip color='success' label={t('literals.Default')} />
                    ) : (
                        <Button onClick={handleClickActivate} variant='text'>
                            {t('commonButtons.Activate')}
                        </Button>
                    )}
                </Box>
                <Typography variant='subtitle1'>
                    {t('Card.sortCodeColon')} {formatSortCode(card.sortCode)}
                </Typography>
                <Typography variant='subtitle1'>
                    {t('Card.cardNUmberColon')}{' '}
                    {blurCardNumber(card.cardNumber)}
                </Typography>
                <Button onClick={handleClickEdit}>
                    <Typography component='span'>
                        {t('commonButtons.viewAndEdit')}
                    </Typography>{' '}
                    <RightArrowIcon />
                </Button>
            </Paper>
        </ListItem>
    );
};

export default BudgetCard;
