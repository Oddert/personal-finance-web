import { FC } from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    List,
    ListItem,
    Paper,
    Typography,
} from '@mui/material'

import type { Matcher as MatcherT } from '../../types/Matcher'

import AddMatcher from './components/AddMatcher'
import Colour from './components/Colour'
import Description from './components/Description'
import Matcher from './components/Matcher'
import Title from './components/Title'
import HamburgerMenu from './components/HamburgerMenu'

import { IProps } from './Category.types';

const Category: FC<IProps> = ({
    category,
    defaultOpenAddNew = false,
    defaultOpenMatcher,
    onAddNewSubmit,
    layout = 'standard',
}) => {
    switch(layout) {
        case 'list':
        case 'compact':
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
                            width: '100%',
                        })}
                    >
                        <Accordion>
                            <AccordionSummary>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gridGap: '0 16px',
                                        }}
                                    >
                                        <Colour category={category} />
                                        <Title category={category} small />
                                    </Box>
                                    <HamburgerMenu category={category} />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex' }}>
                                    <Description category={category} />
                                </Box>
                                <Typography
                                    variant='h4'
                                    align='left'
                                    sx={{ fontSize: '16px', fontWeight: 'bold' }}
                                >
                                    Matchers{category.matchers?.length ? ` (${category.matchers.length})` : ''}
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
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                </ListItem>
            )
        case 'standard':
        default:
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
                        <Box sx={{ display: 'flex' }}>
                            <Description category={category} />
                        </Box>
                        <Accordion>
                            <AccordionSummary>
                                <Typography
                                    variant='h4'
                                    align='left'
                                    sx={{ fontSize: '16px', fontWeight: 'bold' }}
                                >
                                    Matchers{category.matchers?.length ? ` (${category.matchers.length})` : ''}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
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
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                </ListItem>
            )
    }    
}

export default Category
