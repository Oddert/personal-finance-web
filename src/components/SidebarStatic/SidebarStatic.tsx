import { FC } from 'react';

import { IconButton, useTheme } from '@mui/material';
import {
    ChevronLeft as IconChevronLeft,
    ChevronRight as IconChevronRight,
} from '@mui/icons-material';

import SidebarOptions from '../SidebarOptions';

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
    onOpen = () => {},
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
            <SidebarOptions
                onClose={onClose}
                onOpen={onOpen}
                open={open}
                permanent={tempPermanentOpen}
            />
        </Drawer>
    );
};

export default SidebarStatic;
