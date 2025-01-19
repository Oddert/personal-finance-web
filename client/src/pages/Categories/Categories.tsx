import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import {
    Box,
    Button,
    Container,
    ListItem,
    Typography,
} from '@mui/material'
import { Add as PlusIcon } from '@mui/icons-material'

import { Category as CategoryT } from '../../types/Category'
import { IDynamicCardLayoutModes } from '../../types/Common.types'

import { getCategoryResponse } from '../../redux/selectors/categorySelectors'

import Category from '../../components/Category'
import CategoryAdd from '../../components/CategoryAdd'
import DynamicCardList from '../../components/DynamicCardList'
import LayoutControls from '../../components/LayoutControls'

const Categories = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [layout, setLayout] = useState<IDynamicCardLayoutModes>('standard')

    const categories = useSelector(getCategoryResponse)

    const handleDialogClose = useCallback(() => setDialogOpen(false), [])
    const handleDialogOpen = useCallback(() => setDialogOpen(true), [])
    return (
        <Container
            sx={(theme) => ({
                transition: '.2s linear',
                [theme.breakpoints.down('sm')]: {
                    padding: '4px',
                }
            })}
        >
            <Typography variant='h2' sx={{ margin: '32px 0' }}>
                Categories
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 8px',
                }}
            >
                <LayoutControls layout={layout} setLayout={setLayout} />
                <Button onClick={handleDialogOpen} variant='contained'>
                    <PlusIcon /> Add Category
                </Button>
            </Box>
            <DynamicCardList layout={layout}>
                {categories.map((category: CategoryT) => (
                    <Category
                        category={category}
                        key={category.id}
                        layout={layout}
                    />
                ))}
                <ListItem>
                    <Button
                        onClick={handleDialogOpen}
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
						title='Add a new category'
                        variant='outlined'
                    >
                        <PlusIcon fontSize='large' />
                    </Button>
                </ListItem>
			</DynamicCardList>
            <CategoryAdd
                handleClose={handleDialogClose}
                open={dialogOpen}
            />
        </Container>
    )
}

export default Categories
