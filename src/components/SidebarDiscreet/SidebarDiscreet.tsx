import { FC } from 'react';
import { Link } from 'react-router-dom';

import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    styled,
} from '@mui/material';

import { navigation } from '../../constants/routerConstants';

import type { IProps } from './SidebarDiscreet.types';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

/**
 * Main navigation component, displays the page options.
 *
 * Is fully hidden when closed and opens above main content as a drawer.
 * @category Components
 * @subcategory SidebarDiscreet
 * @component
 * @param props.onClose Callback function invoked when the component requests to close.
 * @param props.open If true, the drawer is open.
 */
const SidebarDiscreet: FC<IProps> = ({ onClose = () => {}, open = false }) => {
    const theme = useTheme();
    return (
        <Drawer onClose={onClose} open={open} variant='persistent'>
            <DrawerHeader>
                <IconButton onClick={onClose}>
                    {theme.direction === 'rtl'}
                </IconButton>
            </DrawerHeader>
            <List>
                {navigation.map(({ label, Icon, location }, index) => (
                    <ListItem
                        disablePadding
                        key={index}
                        sx={{ display: 'block' }}
                    >
                        <Link to={location}>
                            <ListItemButton
                                onClick={onClose}
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
                                    <Icon />
                                </ListItemIcon>
                                {open && <ListItemText primary={label} />}
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default SidebarDiscreet;
