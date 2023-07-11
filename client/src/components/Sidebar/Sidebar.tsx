import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

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
} from '@mui/material'

import { navigation } from '../../constants/routerConstants'

interface Props {
    handleDrawerClose: (args: any) => void
    open: boolean
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}))

const Sidebar: React.FC<Props> = ({ handleDrawerClose, open }) => {
    const theme = useTheme()
    return (
        <Drawer
            onClose={handleDrawerClose}
            open={open}
            variant='persistent'
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl'}
                </IconButton>
            </DrawerHeader>
            <List>
                {navigation.map(({ label, Icon, location }, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <Link to={location}  >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={handleDrawerClose}
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
                                {open && (
                                    <ListItemText primary={label} />
                                )}
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}

Sidebar.propTypes = {
    handleDrawerClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}

Sidebar.defaultProps = {
    handleDrawerClose: () => {},
    open: false,
}

export default Sidebar
