import { FC } from 'react';

import { ListItem } from '@mui/material';

import NavLink from '../NavLink';

import { IProps } from './NavItem.types';
import SubMenu from '../SubMenu';

/**
 * Renders a single list item as one of the sub-types.
 * @component
 * @category Components
 * @subcategory Sidebar Options
 * @param props.index The list item index.
 * @param props.navItem The nav item schema.
 * @param props.onClose Callback function invoked when the item is clicked (if permanent is false).
 * @param props.onOpen Callback function invoked if the item requests to open the sidebar.
 * @param props.open True if the menu is open.
 * @param props.permanent If true, the onClose function is disabled; the component renders assuming the menu is fixed.
 */
const MenuItem: FC<IProps> = ({
    index,
    navItem,
    onClose,
    onOpen,
    open,
    permanent,
}) => {
    return (
        <ListItem disablePadding key={index} sx={{ display: 'block' }}>
            {navItem.children ? (
                <SubMenu
                    navItem={navItem}
                    onClose={onClose}
                    onOpen={onOpen}
                    open={open}
                    permanent={permanent}
                />
            ) : (
                <NavLink
                    key={index}
                    onClose={onClose}
                    open={open}
                    navItem={navItem}
                    permanent={permanent}
                />
            )}
        </ListItem>
    );
};

export default MenuItem;
