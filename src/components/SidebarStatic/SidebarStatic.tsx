import { FC } from 'react';
import { Link } from 'react-router-dom';

import {
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
} from '@mui/material';
import {
    ChevronLeft as IconChevronLeft,
    ChevronRight as IconChevronRight,
} from '@mui/icons-material';

import { navigation } from '../../constants/routerConstants';

import type { IProps } from './SidebarStatic.types';
import { Drawer, DrawerHeader } from './SidebarStatic.styles';

const tempPermanentOpen = false;

/**
 * Main navigation component, displays the page options.
 *
 * When closed it displays as a list of icons, when open it moves the header content aside and displays full lists.
 * @category Components
 * @subcategory SidebarStatic
 * @component
 * @param props.onClose Callback function invoked when the component requests to close.
 * @param props.open If true, the drawer is open.
 */
const SidebarStatic: FC<IProps> = ({
    onClose = () => {},
    onToggle = () => {},
    open = false,
}) => {
    const theme = useTheme();
    return (
        <Drawer onClose={onClose} open={open} variant='permanent'>
            <DrawerHeader>
                {tempPermanentOpen ? null : (
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={onToggle}
                        edge='start'
                        sx={{
                            marginRight: 5,
                        }}
                    >
                        {theme.direction === 'rtl' ? (
                            <IconChevronRight />
                        ) : (
                            <IconChevronLeft />
                        )}
                    </IconButton>
                )}
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
                                onClick={
                                    tempPermanentOpen ? undefined : onClose
                                }
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

export default SidebarStatic;
