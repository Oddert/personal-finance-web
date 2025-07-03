import { FC, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemIcon,
    Menu,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import {
    CopyAll as FromCopyIcon,
    NoteAdd as CreateFreshIcon,
} from '@mui/icons-material';

import router, {
    ROUTES,
    ROUTES_FACTORY,
} from '../../../../constants/routerConstants';

import { IScenario } from '../../../../types/Scenario.types';

import { getScenarios } from '../../../../redux/selectors/scenarioSelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import type { IProps } from './CreateScenarioMenu.types';

/**
 * Re-usable menu component to display options to create a new scenario (from blank or from template).
 * @component
 * @category Pages
 * @subcategory Manage Scenario
 * @param props.anchorEl The element to anchor the modal to. If null the modal will be closed.
 * @param props.handleClose Callback function to close the modal.
 */
const CreateScenarioMenu: FC<IProps> = ({ anchorEl, handleClose }) => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState<IScenario | null>(null);
    const [error, setError] = useState(false);

    const scenarios = useAppSelector(getScenarios);

    const handleClickNew = () => {
        router.navigate(ROUTES.CREATE_SCENARIO);
        handleClose();
    };

    const handleClickTemplate = () => {
        if (!dialogValue?.id) {
            setError(true);
        } else {
            router.navigate(
                ROUTES_FACTORY.CREATE_SCENARIO(String(dialogValue.id)),
            );
            handleClose();
        }
    };

    const handleChangeDialog = (
        e: SyntheticEvent,
        nextValue: IScenario | null,
    ) => {
        setDialogValue(nextValue);
        setError(false);
    };

    const handleClickCancel = () => {
        setDialogOpen(false);
    };

    const open = Boolean(anchorEl);

    return (
        <Menu
            anchorEl={anchorEl}
            id='basic-menu'
            onClose={handleClose}
            open={open}
        >
            <MenuItem onClick={handleClickNew}>
                <ListItemIcon>
                    <CreateFreshIcon fontSize='small' />
                </ListItemIcon>
                {t('buttons.newBlankScenario')}
            </MenuItem>
            <MenuItem onClick={() => setDialogOpen(true)}>
                <ListItemIcon>
                    <FromCopyIcon fontSize='small' />
                </ListItemIcon>
                {t('buttons.createFromTemplate')}
            </MenuItem>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                sx={{
                    '& .MuiPaper-root': {
                        p: 3,
                    },
                }}
            >
                <DialogTitle>
                    {t('modalTitles.createScenarioFromTemplateTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('modalMessages.createScenarioFromTemplate')}
                    </DialogContentText>
                    <Autocomplete
                        getOptionLabel={(option) => option.title}
                        getOptionKey={(option) => option.id}
                        onChange={handleChangeDialog}
                        options={scenarios}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('Scenario.templateScenarioLabel')}
                            />
                        )}
                        value={dialogValue}
                    />
                    {error && (
                        <Typography color='error'>
                            {t('Scenario.pleaseSelectAScenario')}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCancel}>
                        {t('buttons.Cancel')}
                    </Button>
                    <Button onClick={handleClickTemplate} variant='contained'>
                        {t('buttons.createNewScenario')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Menu>
    );
};

export default CreateScenarioMenu;
