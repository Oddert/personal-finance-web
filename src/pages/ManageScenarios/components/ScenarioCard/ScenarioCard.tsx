import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, ListItem, Paper, Typography } from '@mui/material';
import { ArrowForward as IconRightArrow } from '@mui/icons-material';

import router, { ROUTES_FACTORY } from '../../../../constants/routerConstants';

// import APIService from '../../../../services/APIService';

import {
    // useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { getActiveLanguageCode } from '../../../../redux/selectors/profileSelectors';

import type { IProps } from './ScenarioCard.types';

/**
 * Displays a single scenario.
 *
 * Contains options to navigate to the edit page.
 * @component
 * @category Pages
 * @subcategory Manage Scenarios
 */
const ScenarioCard: FC<IProps> = ({ scenario }) => {
    const { t } = useTranslation();

    // const dispatch = useAppDispatch();

    const language = useAppSelector(getActiveLanguageCode);

    // const handleClickActivate = () => {
    //     try {
    //         const request = async () => {
    //             await APIService.setBudgetPreference(scenario.id);
    //             dispatch(setActiveBudget({ scenario }));
    //         };
    //         request();
    //     } catch (error) {
    //         console.error(error);
    //         dispatch(intakeError(error));
    //     }
    // };

    const handleClickEdit = () => {
        router.navigate(ROUTES_FACTORY.EDIT_SCENARIO(scenario.id));
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
                    <Typography variant='h3'>{scenario.title}</Typography>
                    {/* {activeBudgetId === scenario.id ? (
                        <Chip color='success' label={t('literals.Enabled')} />
                    ) : (
                        <Button onClick={() => {}} variant='text'>
                            {t('buttons.Activate')}
                        </Button>
                    )} */}
                </Box>
                <Typography variant='subtitle1'>
                    {scenario.description}
                </Typography>
                <Typography
                    sx={(theme) => ({ color: theme.palette.text.disabled })}
                    variant='body2'
                >
                    {t('Last updated:')}{' '}
                    {new Date(scenario.updatedOn).toLocaleString(language)}
                </Typography>
                <Button onClick={handleClickEdit}>
                    <Typography component='span'>
                        {t('buttons.viewAndEdit')}
                    </Typography>{' '}
                    <IconRightArrow />
                </Button>
            </Paper>
        </ListItem>
    );
};

export default ScenarioCard;
