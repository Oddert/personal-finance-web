import {
    Box,
    List,
    ListItem,
    Paper,
    Typography,
} from '@mui/material'

import type { Category as CategoryT } from '../../types/Category'
import type { Matcher as MatcherT } from '../../types/Matcher'

import AddMatcher from './components/AddMatcher'
import Colour from './components/Colour'
import Description from './components/Description'
import Matcher from './components/Matcher'
import Title from './components/Title'
import HamburgerMenu from './components/HamburgerMenu'

interface Props {
    category: CategoryT
    defaultOpenAddNew?: boolean
    defaultOpenMatcher?: Partial<MatcherT>
    onAddNewSubmit?: (matcher: Partial<MatcherT>) => any
}

const Category = ({
    category,
    defaultOpenAddNew = false,
    defaultOpenMatcher,
    onAddNewSubmit,
}: Props) => {
    return (
        <ListItem
            sx={(theme) => ({
                [theme.breakpoints.up('xs')]: {
                    padding: '8px',
                },
                ' .Category_AddMatcher': {
                    opacity: '0',
                },
                '&:hover .Category_AddMatcher': {
                    opacity: '1',
                },
            })}
        >
            <Paper
                elevation={6}
                sx={(theme) => ({
                    padding: '20px 50px',
                    [theme.breakpoints.up('xs')]: {
                        padding: '20px',
                    },
                    width: '100%',
                    height: '100%',
                })}
            >
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Colour category={category} />
                    <Box sx={{ display: 'flex', borderBottom: `3px solid ${category.colour}`, padding: '16px 0' }}>
                        <Title category={category} />
                        <HamburgerMenu category={category} />
                    </Box>
                </Box>
                <Description category={category} />
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
                            categoryId={category.id}
                            key={matcher.id}
                            matcher={matcher}
                        />
                    ))}
                    <AddMatcher
                        categoryId={category.id}
                        defaultOpen={defaultOpenAddNew}
                        matcher={defaultOpenMatcher || undefined}
                        onSubmit={onAddNewSubmit}
                    />
                </List>
            </Paper>
        </ListItem>
    )
}

export default Category
