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

import { IBudget } from '../../../../types/Budget.types';

import { getBudgetResponse } from '../../../../redux/selectors/budgetSelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import type { IProps } from './CreateBudgetMenu.types';

/**
 * Re-usable menu component to display options to create a new budget (from blank or from template).
 * @component
 * @category Pages
 * @subcategory Manage Budgets
 */
const CreateBudgetMenu: FC<IProps> = ({ anchorEl, handleClose }) => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState<IBudget | null>(null);
    const [error, setError] = useState(false);

    const budgets = useAppSelector(getBudgetResponse);

    const handleClickNew = () => {
        router.navigate(ROUTES.CREATE_BUDGET);
        handleClose();
    };

    const handleClickTemplate = () => {
        if (!dialogValue?.id) {
            setError(true);
        } else {
            router.navigate(
                ROUTES_FACTORY.CREATE_BUDGET(String(dialogValue.id)),
            );
            handleClose();
        }
    };

    const handleChangeDialog = (
        e: SyntheticEvent,
        nextValue: IBudget | null,
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
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            onClose={handleClose}
            open={open}
        >
            <MenuItem onClick={handleClickNew}>
                <ListItemIcon>
                    <CreateFreshIcon fontSize='small' />
                </ListItemIcon>
                {t('buttons.newBlankBudget')}
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
                    {t('modalTitles.createBudgetFromTemplateTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('modalMessages.createBudgetFromTemplateTitle')}
                    </DialogContentText>
                    <Autocomplete
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option) => option.id}
                        onChange={handleChangeDialog}
                        options={budgets}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('Budget.templateBudgetLabel')}
                            />
                        )}
                        value={dialogValue}
                    />
                    {error && (
                        <Typography color='error'>
                            {t('Budget.pleaseSelectABudget')}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCancel}>
                        {t('buttons.Cancel')}
                    </Button>
                    <Button onClick={handleClickTemplate} variant='contained'>
                        {t('buttons.createNewBudget')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Menu>
    );
};

export default CreateBudgetMenu;
