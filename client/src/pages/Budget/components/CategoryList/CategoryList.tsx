import { FC, useMemo } from 'react';

import { List, ListItem } from '@mui/material';

import { IProps } from './CategoryList.types';

const CategoryList: FC<IProps> = ({ categoryBreakdown }) => {
    const entries = useMemo(() => Object.entries(categoryBreakdown), [categoryBreakdown]);

    return (
        <List>
            <ListItem>
                {categoryBreakdown.uncategorised.label}: {categoryBreakdown.uncategorised.value.toFixed(2)}
            </ListItem>
            {entries.map(
                ([key, category]) => key === 'uncategorised'
                    ? null
                    : (
                        <ListItem>
                            {category.label}: {category.value.toFixed(2)}
                        </ListItem>
                    )   
            )}
        </List>
    )
};

export default CategoryList;
