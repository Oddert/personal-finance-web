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

import { IProps } from './NavItem.types';

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
                                // '& .MuiAccordionSummary-content': {
                                //     m: 0,
                                // },
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                                '& .MuiAccordionSummary-content': {
                                    my: 0,
                                },
                                '&.Mui-expanded': {
                                    minHeight: 48,
                                    my: 0,
                                },
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
                        <List sx={{ p: 0 }}>
                            {navItem.children.map((childNavItem, childIdx) => (
                                <ListItem
                                    key={childIdx}
                                    sx={
                                        open
                                            ? { my: 0 }
                                            : {
                                                  m: 0,
                                                  p: 0,
                                                  justifyContent: 'center',
                                              }
                                    }
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
