import { useSelector } from 'react-redux'

import { Container, List, Typography } from '@mui/material'

import { Category as CategoryT } from '../../types/Category'

import { getCategoryResponse } from '../../redux/selectors/categorySelectors'

import Category from './components/Category/Category'

const Categories = () => {
    const categories = useSelector(getCategoryResponse)
    return (
        <Container
            sx={{
                transition: '.2s linear',
            }}
        >
            <Typography variant='h2' sx={{ margin: '32px 0' }}>
                Categories
            </Typography>
            <List
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                    gridGap: '30px',
                }}
            >
                {categories.map((category: CategoryT) => (
                    <Category category={category} key={category.id} />
                ))}
            </List>
        </Container>
    )
}

export default Categories
