import { FC } from 'react';

import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
    CopyAll as FromCopyIcon,
    NoteAdd as CreateFreshIcon,
} from '@mui/icons-material';

import router, {
    ROUTES,
    ROUTES_FACTORY,
} from '../../../../constants/routerConstants';

import type { IProps } from './CreateBudgetMenu.types';

/**
 * Re-usable menu component to display options to create a new budget (from blank or from template).
 * @component
 * @category Pages
 * @subcategory Manage Budgets
 */
const CreateBudgetMenu: FC<IProps> = ({ anchorEl, handleClose }) => {
    const open = Boolean(anchorEl);

    const handleClickNew = () => {
        router.navigate(ROUTES.CREATE_BUDGET);
        handleClose();
    };

    const handleClickTemplate = () => {
        router.navigate(ROUTES_FACTORY.CREATE_BUDGET('undefined'));
        handleClose();
    };

    return (
        <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleClickNew}>
                <ListItemIcon>
                    <FromCopyIcon fontSize='small' />
                </ListItemIcon>
                Create from template
            </MenuItem>
            <MenuItem onClick={handleClickTemplate}>
                <ListItemIcon>
                    <CreateFreshIcon fontSize='small' />
                </ListItemIcon>
                New blank budget
            </MenuItem>
        </Menu>
    );
};

export default CreateBudgetMenu;
