import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, Typography } from '@mui/material';

import { getCategoryResponse } from '../../../../redux/selectors/categorySelectors';

import {
    TransactionEditContext,
    toggleSideBar,
} from '../../../../contexts/transactionEditContext';

import AddCategory from './components/AddCategory';
import Option from './components/Option';

/**
 * Sidebar popover which displays transactions, allowing the user to quickly add Categories / Matchers.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 */
const CategoryQuickEdit = () => {
    const {
        dispatch,
        state: { sideBarOpen },
    } = useContext(TransactionEditContext);

    const { t } = useTranslation();

    const categories = useSelector(getCategoryResponse);

    const toggleDrawer = (toOpen?: boolean) => {
        const callback = (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            dispatch(
                toggleSideBar(toOpen === undefined ? !sideBarOpen : toOpen),
            );
        };
        return callback;
    };

    return (
        <Drawer
            open={sideBarOpen}
            onClose={toggleDrawer(false)}
            elevation={10}
            slotProps={{
                backdrop: {
                    onClick: toggleDrawer(false),
                },
            }}
            sx={(theme) => ({
                minWidth: '10vw',
                maxWidth: '50vw',
                zIndex: theme.zIndex.appBar * 2,
            })}
        >
            <AddCategory />
            <Box
                role='presentation'
                // onKeyDown={toggleDrawer(false)}
                sx={{
                    display: 'flex',
                    minWidth: '200px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >
                {categories?.length ? (
                    categories.map((category) => (
                        <Option category={category} key={category.id} />
                    ))
                ) : (
                    <Typography
                        sx={{ width: '100%', textAlign: 'center', p: 2 }}
                    >
                        {t('Category.noCategoriesYet')}
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
};

export default CategoryQuickEdit;
