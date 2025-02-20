import { FC } from 'react';

import { Drawer, IconButton, useTheme, styled } from '@mui/material';

import SidebarOptions from '../SidebarOptions';

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
            <SidebarOptions onClose={onClose} open={open} />
        </Drawer>
    );
};

export default SidebarDiscreet;
