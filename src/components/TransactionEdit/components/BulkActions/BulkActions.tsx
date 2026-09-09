import {
    type FC,
    Fragment,
    type SyntheticEvent,
    useContext,
    useState,
} from 'react';

import {
    CheckBox as IconCheckAll,
    CheckBoxOutlineBlank as IconUnCheckAll,
    Delete as IconDeleteAll,
    RestoreFromTrash as IconUnDeleteAll,
    ArrowDropDown as IconDropDown,
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
                Bulk Actions
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
                    <ListItemText>Check all</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClickUnCheckAll}>
                    <ListItemIcon>
                        <IconUnCheckAll fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Un-check all</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClickDeleteAll}>
                    <ListItemIcon>
                        <IconDeleteAll fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Delete all</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClickUnDeleteAll}>
                    <ListItemIcon>
                        <IconUnDeleteAll fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Un-delete all</ListItemText>
                </MenuItem>
            </Menu>
        </Fragment>
    );
};

export default BulkActions;
