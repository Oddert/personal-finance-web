import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Box, Drawer } from '@mui/material'

import { getCategoryResponse } from '../../../redux/selectors/categorySelectors'

import Option  from './components/Option/'
import { TransactionEditContext, toggleSideBar } from '../../../contexts/transactionEditContext'

const CategoryQuickEdit = () => {
    const { dispatch, state: { sideBarOpen } } = useContext(TransactionEditContext)

    const categories = useSelector(getCategoryResponse)

    const toggleDrawer = (toOpen?: boolean, str?: string) => {
        const callback = (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                (
                    (event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift'
                )
            ) {
                return
            }

            dispatch(toggleSideBar(toOpen === undefined ? !sideBarOpen : toOpen))
        }
        return callback
    }

    return (
        <Drawer
            open={sideBarOpen}
            onClose={toggleDrawer(false, 'Drawer.onClose')}
            elevation={10}
            sx={(theme) => ({
                minWidth: '10vw',
                maxWidth: '50vw',
                zIndex: theme.zIndex.appBar * 2,
            })}
            ModalProps={{ onBackdropClick: toggleDrawer(false, 'Drawer.ModalProps.onBackdropClick') }}
        >
            <Box
                role='presentation'
                onKeyDown={toggleDrawer(false, 'Box.onKeyDown')}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >
                {categories.map(category => (
                    <Option category={category} key={category.id} />
                ))}
            </Box>
        </Drawer>
    )
}

export default CategoryQuickEdit
