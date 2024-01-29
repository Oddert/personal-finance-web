import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import { Box, Button, Container, List, ListItem, Typography } from '@mui/material'
import { Add as PlusIcon } from '@mui/icons-material'

import { Category as CategoryT } from '../../types/Category'

import { getCategoryResponse } from '../../redux/selectors/categorySelectors'

import Category from '../../components/Category/'
import CategoryAdd from '../../components/CategoryAdd/'

const Categories = () => {
    const [dialogOpen, setDialogOpen] = useState(false)

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
                    justifyContent: 'flex-end',
                    padding: '0 8px',
                }}
            >
                <Button onClick={handleDialogOpen} variant='contained'>
                    Add Category
                </Button>
            </Box>
            <List
                sx={(theme) => ({
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                    gridGap: '30px',
                    [theme.breakpoints.down('sm')]: {
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gridGap: '10px',
                    }
                })}
            >
                {categories.map((category: CategoryT) => (
                    <Category category={category} key={category.id} />
                ))}
                <ListItem>
                    <Button
                        onClick={handleDialogOpen}
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
                        variant='outlined'
                    >
                        <PlusIcon fontSize='large' />
                    </Button>
                </ListItem>
            </List>
            <CategoryAdd
                handleClose={handleDialogClose}
                open={dialogOpen}
            />
        </Container>
    )
}

export default Categories
