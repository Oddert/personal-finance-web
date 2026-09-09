import {
    type FC,
    Fragment,
    type SyntheticEvent,
    useContext,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
    ArrowDropDown as IconDropDown,
    CheckBox as IconCheckAll,
    CheckBoxOutlineBlank as IconUnCheckAll,
    Delete as IconDeleteAll,
    RestoreFromTrash as IconUnDeleteAll,
} from '@mui/icons-material';
import {
    Button,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';

import type { IProps } from './BulkActions.types';

import {
    TransactionEditContext,
    checkAll,
    deleteAll,
    unDeleteAll,
    uncheckAll,
} from '../../../../contexts/transactionEditContext';

import ChangeCard from './components/ChangeCard';
import ChangeCurrency from './components/ChangeCurrency';

const BulkActions: FC<IProps> = () => {
    const { t } = useTranslation();

    const { dispatch } = useContext(TransactionEditContext);

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleClick = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickCheckAll = () => {
        dispatch(checkAll());
        handleClose();
    };
    const handleClickUnCheckAll = () => {
        dispatch(uncheckAll());
        handleClose();
    };
    const handleClickDeleteAll = () => {
        dispatch(deleteAll());
        handleClose();
    };
    const handleClickUnDeleteAll = () => {
        dispatch(unDeleteAll());
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <Fragment>
            <Button
                aria-controls={open ? 'bulk-actions-menu' : undefined}
                aria-expanded={open}
                aria-haspopup='true'
                endIcon={<IconDropDown />}
                id='bulk-actions-button'
                onClick={handleClick}
                variant='outlined'
            >
                {t('Transaction.bulkActions')}
            </Button>
            <Menu
                anchorEl={anchorEl}
                aria-labelledby='bulk-actions-button'
                id='bulk-actions-menu'
                onClose={handleClose}
                open={open}
            >
                <ChangeCard onClose={handleClose} />
                <ChangeCurrency onClose={handleClose} />
                <MenuItem onClick={handleClickCheckAll}>
                    <ListItemIcon>
                        <IconCheckAll fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>{t('buttons.checkAll')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClickUnCheckAll}>
                    <ListItemIcon>
                        <IconUnCheckAll fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>{t('buttons.uncheckAll')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClickDeleteAll}>
                    <ListItemIcon>
                        <IconDeleteAll fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>{t('buttons.deleteAll')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClickUnDeleteAll}>
                    <ListItemIcon>
                        <IconUnDeleteAll fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>{t('buttons.unDeleteAll')}</ListItemText>
                </MenuItem>
            </Menu>
        </Fragment>
    );
};

export default BulkActions;
