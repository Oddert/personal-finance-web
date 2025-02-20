import { FC } from 'react';
import { Link } from 'react-router-dom';

import {
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    styled,
    Theme,
    CSSObject,
} from '@mui/material';
import {
    ChevronLeft as IconChevronLeft,
    ChevronRight as IconChevronRight,
} from '@mui/icons-material';

import { navigation } from '../../constants/routerConstants';

import type { IProps } from './SidebarStatic.types';

const openWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    width: openWidth,
});

const closedMixin = (theme: Theme): CSSObject => ({
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    boxSizing: 'border-box',
    flexShrink: 0,
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            },
        },
    ],
    width: openWidth,
    whiteSpace: 'nowrap',
}));

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

export default SidebarStatic;
