import { FC } from 'react';
import { Link } from 'react-router-dom';

import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

import { IProps } from './NavItem.types';

/**
 * Renders a single text variant list item.
 * @component
 * @category Components
 * @subcategory Sidebar Options
 * @param props.index The list item index.
 * @param props.navItem The nav item schema.
 * @param props.onClose Callback function invoked when the item is clicked (if permanent is false).
 * @param props.open True if the menu is open.
 * @param props.permanent If true, the onClose function is disabled; the component renders assuming the menu is fixed.
 */
const MenuItem: FC<IProps> = ({ index, navItem, onClose, open, permanent }) => {
    return (
        <ListItem disablePadding key={index} sx={{ display: 'block' }}>
            <Link to={location}>
                <ListItemButton
                    onClick={permanent ? undefined : onClose}
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        <navItem.Icon />
                    </ListItemIcon>
                    {open || permanent ? (
                        <ListItemText primary={navItem.label} />
                    ) : null}
                </ListItemButton>
            </Link>
        </ListItem>
    );
};

export default MenuItem;
