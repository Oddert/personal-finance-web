import { FC, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Autocomplete, Box, TableCell, TextField } from '@mui/material';
import { Circle as DotIcon } from '@mui/icons-material';

import { Category } from '../../../../../../types/Category.d';

import { getCategoryOrderedDataById } from '../../../../../../redux/selectors/categorySelectors';

import {
    TransactionEditContext,
    updateCategory,
} from '../../../../../../contexts/transactionEditContext';

import { IProps } from './CategorySelector.types';

const marginTopBottom = '4px';

const CategorySelector: FC<IProps> = ({ transaction }) => {
    const { dispatch } = useContext(TransactionEditContext);

    const categories = useSelector(getCategoryOrderedDataById);

    const value = useMemo(
        () =>
            transaction.assignedCategory
                ? categories[transaction.assignedCategory]
                    ? {
                          id: String(
                              categories[transaction.assignedCategory].id,
                          ),
                          label: categories[transaction.assignedCategory].label,
                      }
                    : null
                : null,
        [],
    );

    const options = useMemo(
        () =>
            Object.entries(categories as { [id: string]: Category }).map(
                ([id, category]) => ({
                    id,
                    label: category.label,
                }),
            ),
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
                    onChange={(event, category) => {
                        if (!category) {
                            return;
                        }
                        dispatch(
                            updateCategory(
                                transaction.tecTempId as string,
                                Number(category.id),
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
                    <DotIcon
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
