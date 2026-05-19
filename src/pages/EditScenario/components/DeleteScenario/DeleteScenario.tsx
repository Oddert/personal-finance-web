import { type FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Delete as IconDelete } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import type { IProps } from './DeleteScenario.types';

import router, { ROUTES } from '../../../../constants/routerConstants';
import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';
import { deleteScenario } from '../../../../redux/slices/scenarioSlice';
import { refreshAuthentication } from '../../../../redux/thunks/authThunks';
import { intakeError } from '../../../../redux/thunks/errorThunks';
import APIService from '../../../../services/APIService';

/**
 * Modal component to allow the user to delete an entire scenario.
 * @component
 * @category Pages
 * @subcategory Edit Scenario
 */
const DeleteScenario: FC<IProps> = ({ scenario }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);

    const handleClickDelete = () => {
        const request = async () => {
            await APIService.deleteSingleScenario(scenario.id);
            dispatch(deleteScenario({ scenarioId: scenario.id }));
            router.navigate(ROUTES.MANAGE_SCENARIOS);
        };

        try {
            request();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error1: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error1.status === 401) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    dispatch(refreshAuthentication(request));
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                } catch (error2: any) {
                    dispatch(intakeError(error1));
                }
            } else {
                dispatch(intakeError(error1));
            }
        }
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    color='error'
                    onClick={() => {
                        setOpen(true);
                    }}
                    sx={{
                        mt: '64px',
                        maxWidth: '300px',
                    }}
                    variant='outlined'
                >
                    <IconDelete /> {t('buttons.deleteScenario')}
                </Button>
            </Box>
            <Dialog open={open}>
                <DialogTitle>
                    {t('Budget.sureYouWantToDeleteScenario', {
                        scenarioName: scenario.title,
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('modalMessages.cannotBeUndone')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                        }}
                        variant='contained'
                    >
                        {t('buttons.Cancel')}
                    </Button>
                    <Button color='error' onClick={handleClickDelete}>
                        {t('buttons.deleteScenario')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default DeleteScenario;
