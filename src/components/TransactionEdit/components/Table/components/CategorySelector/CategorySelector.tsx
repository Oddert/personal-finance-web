import { type FC, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Circle as IconDot } from '@mui/icons-material';
import { Autocomplete, Box, TableCell, TextField } from '@mui/material';

import type { IProps } from './CategorySelector.types';

import {
    TransactionEditContext,
    updateCategory,
} from '../../../../../../contexts/transactionEditContext';
import { getCategoryOrderedDataById } from '../../../../../../redux/selectors/categorySelectors';

const marginTopBottom = '4px';

const CategorySelector: FC<IProps> = ({ transaction }) => {
    const { dispatch } = useContext(TransactionEditContext);

    const categories = useSelector(getCategoryOrderedDataById);

    const value = useMemo(() => {
        return transaction.assignedCategory
            ? transaction.assignedCategory in categories
                ? {
                      id: categories[transaction.assignedCategory].id,
                      label: categories[transaction.assignedCategory].label,
                  }
                : null
            : null;
    }, [categories, transaction]);

    const options = useMemo(
        () =>
            Object.entries(categories).map(([id, category]) => ({
                id,
                label: category.label,
            })),
        [categories],
    );

    return (
        <TableCell>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Autocomplete
                    autoHighlight
                    disablePortal
                    isOptionEqualToValue={(option) => option.id === value?.id}
                    onChange={(_, category) => {
                        if (!category) {
                            return;
                        }
                        dispatch(
                            updateCategory(
                                transaction.tecTempId as string,
                                category.id,
                            ),
                        );
                    }}
                    options={options}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder='unset'
                            sx={{
                                paddingTop: marginTopBottom,
                                paddingBottom: marginTopBottom,
                            }}
                        />
                    )}
                    sx={{
                        borderWidth:
                            transaction.assignedCategory === 'unset' ? 4 : 1,
                        width: '100%',
                        '& .MuiInputBase-root': {
                            padding: '2px',
                        },
                    }}
                    value={value}
                />
                {value ? null : (
                    <IconDot
                        fontSize='small'
                        sx={(theme) => ({
                            color: theme.palette.warning.light,
                            width: '16px',
                            height: '16px',
                            marginLeft: '6px',
                        })}
                    />
                )}
            </Box>
        </TableCell>
    );
};

export default CategorySelector;
