import { FC, Fragment, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
} from '@mui/material';
import { MoreVert as IconDots } from '@mui/icons-material';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';
import { initDeleteSingleCategory } from '../../../../redux/slices/categorySlice';

import type { IProps } from './HamburgerMenu.types';

/**
 * Additional Category actions including delete.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.category The Category to display.
 */
const HamburgerMenu: FC<IProps> = ({ category }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleDeleteOptionClick = () => {
        handleClose();
        setDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => setDeleteModalOpen(false);

    const handleDelete = () => {
        handleClose();
        setDeleteModalOpen(false);
        dispatch(initDeleteSingleCategory({ categoryId: category.id }));
    };

    const open = Boolean(anchorEl);
    return (
        <Fragment>
            <Button
                id='hamburger-menu'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{
                    margin: '0 0 0 8px',
                    padding: 0,
                    minWidth: 'unset',
                }}
                title={t('literals.options')}
            >
                <IconDots
                    sx={(theme) => ({
                        transition: '.1s linear',
                        color: theme.palette.common.white,
                        paddingLeft: 0,
                        paddingRight: 0,
                        minWidth: '40px',
                    })}
                />
            </Button>
            <Menu
                id='hamburger-menu'
                anchorEl={anchorEl}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                onClose={handleClose}
                open={open}
            >
                <MenuItem onClick={handleDeleteOptionClick}>
                    {t('buttons.Delete')}
                </MenuItem>
            </Menu>
            <Dialog
                open={deleteModalOpen}
                onClose={handleDeleteModalClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle
                    id='alert-dialog-title'
                    sx={{
                        minWidth: '50vw',
                    }}
                >
                    {t('modalMessages.sureYouWantToDeleteCategory', {
                        categoryName: category.label,
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {t('modalMessages.cannotBeUndone')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={handleDelete}>
                        {t('buttons.deleteCategory')}
                    </Button>
                    <Button
                        autoFocus
                        onClick={handleDeleteModalClose}
                        variant='contained'
                    >
                        {t('buttons.Cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default HamburgerMenu;
