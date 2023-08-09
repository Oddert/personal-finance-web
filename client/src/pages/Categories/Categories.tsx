import { useSelector } from 'react-redux'

import { Container, List, Typography } from '@mui/material'

import { Category as CategoryT } from '../../types/Category'

import { getCategoryResponse } from '../../redux/selectors/categorySelectors'

import Category from './components/Category/Category'

const Categories = () => {
    const categories = useSelector(getCategoryResponse)
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
            </List>
        </Container>
    )
}

export default Categories
