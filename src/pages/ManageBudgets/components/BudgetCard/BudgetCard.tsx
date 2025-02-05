import { FC } from 'react';

import { Box, Button, Chip, ListItem, Paper, Typography } from '@mui/material';
import { ArrowForward as RightArrowIcon } from '@mui/icons-material';

import router, { ROUTES_FACTORY } from '../../../../constants/routerConstants';

import APIService from '../../../../services/APIService';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { getActiveBudgetId } from '../../../../redux/selectors/budgetSelectors';
import { getActiveLanguageCode } from '../../../../redux/selectors/profileSelectors';
import { setActiveBudget } from '../../../../redux/slices/budgetSlice';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import type { IProps } from './BudgetCard.types';

/**
 * Displays a single budget.
 *
 * Contains options to navigate to the edit page.
 * @component
 * @category Pages
 * @subcategory Manage Budgets
 */
const BudgetCard: FC<IProps> = ({ budget }) => {
    const dispatch = useAppDispatch();

    const activeBudgetId = useAppSelector(getActiveBudgetId);
    const language = useAppSelector(getActiveLanguageCode);

    const handleClickActivate = () => {
        try {
            const request = async () => {
                await APIService.setBudgetPreference(budget.id);
                dispatch(setActiveBudget({ budget }));
            };
            request();
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };

    const handleClickEdit = () => {
        router.navigate(ROUTES_FACTORY.EDIT_BUDGET(budget.id));
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
                    <Typography variant='h3'>{budget.name}</Typography>
                    {activeBudgetId === budget.id ? (
                        <Chip color='success' label='Enabled' />
                    ) : (
                        <Button onClick={handleClickActivate} variant='text'>
                            Activate
                        </Button>
                    )}
                </Box>
                <Typography variant='subtitle1'>
                    {budget.shortDescription}
                </Typography>
                <Typography
                    sx={(theme) => ({ color: theme.palette.text.disabled })}
                    variant='body2'
                >
                    Last updated:{' '}
                    {new Date(budget.updatedOn).toLocaleString(language)}
                </Typography>
                <Button onClick={handleClickEdit}>
                    <Typography component='span'>View and edit</Typography>{' '}
                    <RightArrowIcon />
                </Button>
            </Paper>
        </ListItem>
    );
};

export default BudgetCard;
