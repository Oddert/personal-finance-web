import { FC } from 'react';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';

import NavLink from '../NavLink';

import { IProps } from './SubMenu.types';

/**
 * Renders a sub list of grouped nav items.
 * @component
 * @category Components
 * @subcategory Sidebar Options
 * @param props.navItem The nav item schema.
 * @param props.onClose Callback function invoked when the item is clicked (if permanent is false).
 * @param props.onOpen Callback function invoked if the item requests to open the sidebar.
 * @param props.open True if the menu is open.
 * @param props.permanent If true, the onClose function is disabled; the component renders assuming the menu is fixed.
 */
const SubMenu: FC<IProps> = ({ navItem, onClose, onOpen, open, permanent }) => {
    return (
        <Accordion
            defaultExpanded={navItem.defaultExpanded}
            elevation={0}
            onChange={onOpen}
        >
            <Tooltip placement='right' title={navItem.label}>
                <AccordionSummary
                    onClick={onOpen}
                    sx={(theme) => ({
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        m: 1,
                        borderRadius: '4px',
                        width: 'calc(100% - 16px)',
                        '& .MuiAccordionSummary-content': {
                            m: 0,
                        },
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                        '& .MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded':
                            {
                                my: 1,
                                display: 'flex',
                                alignItems: 'center',
                            },
                        '&.Mui-expanded': {
                            minHeight: 32,
                            my: 0,
                        },
                        minHeight: 32,
                    })}
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
                </AccordionSummary>
            </Tooltip>
            <AccordionDetails sx={[{ p: 0 }, open && { pl: '12px' }]}>
                <List sx={{ p: 0, ml: '5px' }}>
                    {navItem.children?.map((childNavItem, childIdx) => (
                        <ListItem
                            key={childIdx}
                            sx={[
                                { my: 1 },
                                open
                                    ? {
                                          '& a': { width: '100%' },
                                      }
                                    : {
                                          mx: 1,
                                          p: 0,
                                          width: 'auto',
                                          justifyContent: 'center',
                                      },
                            ]}
                        >
                            <NavLink
                                isChild
                                onClose={onClose}
                                open={open}
                                navItem={childNavItem}
                                permanent={permanent}
                            />
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    );
};

export default SubMenu;
