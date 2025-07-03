import { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { Delete as IconDelete } from '@mui/icons-material';

import router, { ROUTES } from '../../../../constants/routerConstants';

import APIService from '../../../../services/APIService';

import { intakeError } from '../../../../redux/thunks/errorThunks';
import { deleteScenario } from '../../../../redux/slices/scenarioSlice';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import type { IProps } from './DeleteScenario.types';

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
        try {
            const request = async () => {
                await APIService.deleteSingleScenario(scenario.id);
                dispatch(deleteScenario({ scenarioId: scenario.id }));
                router.navigate(ROUTES.MANAGE_SCENARIOS);
            };
            request();
        } catch (error) {
            dispatch(intakeError(error));
        }
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    color='error'
                    onClick={() => setOpen(true)}
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
                    <Button onClick={() => setOpen(false)} variant='contained'>
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
