import React from 'react'
import { Container, Typography } from '@mui/material'

const Home = () => {
    return (
        <Container
            sx={{
                height: '200vh'
            }}
        >
            <Typography variant='h1'>H1 Title</Typography>
            <Typography variant='h2'>H2 Title</Typography>
            <Typography variant='h3'>H3 Title</Typography>
            <Typography variant='h4'>H4 Title</Typography>
            <Typography variant='h5'>H5 Title</Typography>
            <Typography variant='h6'>H6 Title</Typography>
            <Typography variant='subtitle1'>Subtitle 1</Typography>
            <Typography variant='subtitle2'>Subtitle 2</Typography>
            <Typography variant='body1'>Body 1</Typography>
            <Typography variant='body2'>Body 2</Typography>
        </Container>
    )
}

export default Home
