import { FC, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';

import { IProps } from './NavLink.types';

/**
 * Renders a single nav item link.
 * @component
 * @category Components
 * @subcategory Sidebar Options
 * @param props.isChild If true, the item is a child of a grouping and margins should be disabled.
 * @param props.navItem The nav item schema.
 * @param props.onClose Callback function invoked when the item is clicked (if permanent is false).
 * @param props.open True if the menu is open.
 * @param props.permanent If true, the onClose function is disabled; the component renders assuming the menu is fixed.
 */
const NavLink: FC<IProps> = ({
    isChild,
    navItem,
    onClose,
    open,
    permanent,
}) => {
    const appLocation = useLocation();

    const selected = useMemo(() => {
        const re = new RegExp(navItem.location, 'gi');
        const test = re.test(appLocation.pathname);
        return test;
    }, [navItem, appLocation]);

    const content = (
        <Link to={navItem.location}>
            <ListItemButton
                onClick={permanent ? undefined : onClose}
                sx={[
                    {
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2,
                        m: 1,
                        borderRadius: '4px',
                        minWidth: 40,
                    },
                    selected &&
                        ((theme) => ({
                            color: theme.palette.primary.contrastText,
                            background: theme.palette.primary.main,
                            '&:hover': {
                                background: theme.palette.primary.dark,
                            },
                        })),
                    isChild ? { margin: 0 } : false,
                    open ? false : { p: 0, mx: '8px' },
                ]}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 0,
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
    );

    if (!open) {
        return (
            <Tooltip placement='right' title={navItem.label}>
                {content}
            </Tooltip>
        );
    }
    return content;
};

export default NavLink;
