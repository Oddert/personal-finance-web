import {
    Box,
    List,
    ListItem,
    Paper,
    Typography,
} from '@mui/material'

import type { Category as CategoryT } from '../../../../types/Category'
import type { Matcher as MatcherT } from '../../../../types/Matcher'

import AddMatcher from '../AddMatcher/'
import Matcher from '../Matcher/'

interface Props {
    category: CategoryT
}

const boxW = 50

const Category = ({ category }: Props) => {
    return (
        <ListItem
            sx={{
                ' .Category_AddMatcher': {
                    opacity: '0',
                },
                '&:hover .Category_AddMatcher': {
                    opacity: '1',
                },
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: '20px 50px',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Box
                        sx={{
                            width: boxW,
                            height: boxW,
                            backgroundColor: category.colour,
                            borderRadius: '4px',
                        }}
                    />
                    <Typography
                        variant='h3'
                        sx={{ borderBottom: `2px solid ${category.colour}` }}
                    >
                        {category.label}
                    </Typography>
                </Box>
                <Typography
                    variant='subtitle1'
                    align='right'
                    sx={{ margin: '16px 0' }}
                >
                    {category.description}
                </Typography>
                <Typography
                    variant='h4'
                    align='left'
                    sx={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                    Matches
                </Typography>
                <List>
                    {category.matchers.map((matcher: MatcherT) => (
                        <Matcher
                            key={matcher.id}
                            matcher={matcher}
                        />
                    ))}
                    <AddMatcher />
                </List>
            </Paper>
        </ListItem>
    )
}

export default Category
