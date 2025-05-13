import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Box, Button, Container, ListItem, Typography } from '@mui/material';
import { Add as IconPlus } from '@mui/icons-material';

import type { ICategory } from '../../types/Category.d';
import type { TDynamicCardLayoutModes } from '../../types/Common.types';

import { getCategoryResponse } from '../../redux/selectors/categorySelectors';

import Category from '../../components/Category';
import CategoryAdd from '../../components/CategoryAdd';
import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

/**
 * Page to display all Categories.
 * @category Pages
 * @subcategory Categories
 * @component
 */
const Categories = () => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [layout, setLayout] = useState<TDynamicCardLayoutModes>('standard');

    const categories = useSelector(getCategoryResponse);

    const handleDialogClose = useCallback(() => setDialogOpen(false), []);
    const handleDialogOpen = useCallback(() => setDialogOpen(true), []);
    return (
        <Container
            sx={(theme) => ({
                transition: '.2s linear',
                [theme.breakpoints.down('sm')]: {
                    padding: '4px',
                },
            })}
        >
            <Typography variant='h2' sx={{ margin: '32px 0' }}>
                {t('pageTitles.manageCategories')}
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
                    <IconPlus /> {t('buttons.addCategory')}
                </Button>
            </Box>
            <DynamicCardList layout={layout}>
                {categories.map((category: ICategory) => (
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
                        title={t('Category.addCategoryShortDesc')}
                        variant='outlined'
                    >
                        <IconPlus fontSize='large' />
                    </Button>
                </ListItem>
            </DynamicCardList>
            <CategoryAdd handleClose={handleDialogClose} open={dialogOpen} />
        </Container>
    );
};

export default Categories;
