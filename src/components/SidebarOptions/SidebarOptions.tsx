import { FC } from 'react';

import { Box, List } from '@mui/material';

import { navigation } from '../../constants/routerConstants';

import NavItem from './components/NavItem';

import { IProps } from './SidebarOptions.types';

/**
 * Renders the list content shared by the navigation drawers.
 * @component
 * @category Components
 * @subcategory Sidebar Options
 * @param props.onClose Callback function invoked when the item is clicked (if permanent is false).
 * @param props.open True if the menu is open.
 * @param props.permanent If true, the component renders assuming the menu is fixed.
 */
const SidebarOptions: FC<IProps> = ({ onClose, open, permanent = false }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
            }}
        >
            <List>
                {navigation.top.map((navItem, index) => (
                    <NavItem
                        index={index}
                        navItem={navItem}
                        onClose={onClose}
                        open={open}
                        permanent={permanent}
                    />
                ))}
            </List>
            <List>
                {navigation.bottom.map((navItem, index) => (
                    <NavItem
                        index={index}
                        navItem={navItem}
                        onClose={onClose}
                        open={open}
                        permanent={permanent}
                    />
                ))}
            </List>
        </Box>
    );
};

export default SidebarOptions;
