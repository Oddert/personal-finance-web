import { FC } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    List,
    ListItem,
    Paper,
    Typography,
} from '@mui/material';

import type { Matcher as IMatcher } from '../../types/Matcher';

import AddMatcher from './components/AddMatcher';
import Colour from './components/Colour';
import Description from './components/Description';
import Matcher from './components/Matcher';
import Title from './components/Title';
import HamburgerMenu from './components/HamburgerMenu';

import type { IProps } from './Category.types';

/**
 * Displays a single Category with optional edit capability.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.category The Category to display.
 * @param props.defaultOpenAddNew If true, the 'add new matcher' modal will be open by default.
 * @param props.defaultOpenMatcher If supplied along with a positive value for `defaultOpenAddNew`, a set of partial default attributes will be applied to the matcher editor.
 * @param props.onAddNewSubmit Callback function invoked when the matcher add-new form is submitted.
 * @param props.layout The layout mode, affects the display compactness of the Category.
 */
const Category: FC<IProps> = ({
    category,
    defaultOpenAddNew = false,
    defaultOpenMatcher,
    onAddNewSubmit,
    layout = 'standard',
}) => {
    const CategoryList = (
        <List>
            {category.matchers.map((matcher: IMatcher) => (
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
    );

    const MatchersTitle = (
        <Typography
            variant='h4'
            align='left'
            sx={{ fontSize: '16px', fontWeight: 'bold' }}
        >
            Matchers
            {category.matchers?.length ? ` (${category.matchers.length})` : ''}
        </Typography>
    );

    const DescBox = (
        <Box sx={{ display: 'flex' }}>
            <Description category={category} />
        </Box>
    );

    switch (layout) {
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
                        sx={() => ({
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
                                {DescBox}
                                {MatchersTitle}
                                {CategoryList}
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                </ListItem>
            );
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
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Colour category={category} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    borderBottom: `3px solid ${category.colour}`,
                                    padding: '16px 0',
                                }}
                            >
                                <Title category={category} />
                                <HamburgerMenu category={category} />
                            </Box>
                        </Box>
                        {DescBox}
                        <Accordion>
                            <AccordionSummary>{MatchersTitle}</AccordionSummary>
                            <AccordionDetails>{CategoryList}</AccordionDetails>
                        </Accordion>
                    </Paper>
                </ListItem>
            );
    }
};

export default Category;
