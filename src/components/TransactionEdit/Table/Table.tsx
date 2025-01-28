import { Fragment, useCallback, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Autocomplete,
    Checkbox,
    FormControlLabel,
    TextField,
    Table as MuiTable,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import { Circle as DotIcon } from '@mui/icons-material';

import {
    defaultColumns,
    toggleSideBar,
    TransactionEditContext,
    updateCategory,
} from '../../../contexts/transactionEditContext';

import { getCategoryOrderedDataById } from '../../../redux/selectors/categorySelectors';

import type { Category } from '../../../types/Category.d';
import TransactionDescription from '../TransactionDescription';

const marginTopBottom = '4px';

/**
 * Displays the transactions and edit options as a table.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 */
const Table = () => {
    const [filterUncategorised, setFilterUncategorised] = useState(false);

    const {
        dispatch,
        state: { columnMap, transactions },
    } = useContext(TransactionEditContext);

    const categories = useSelector(getCategoryOrderedDataById);

    const updateAssignedCategory = useCallback(
        (idx: number, assignedCategory: number) => {
            dispatch(updateCategory(idx, assignedCategory));
        },
        [dispatch],
    );

    const columns = useMemo(() => {
        return defaultColumns(categories, updateAssignedCategory).map(
            (header) => {
                return {
                    ...header,
                    accessorKey:
                        header.accessorKey === 'assignedCategory'
                            ? header.accessorKey
                            : columnMap[header.accessorKey],
                };
            },
        );
    }, [columnMap, categories, updateAssignedCategory]);

    const handleClickTitle = useCallback(
        (match: string) => {
            dispatch(toggleSideBar(true, match));
        },
        [dispatch],
    );

    const data = useMemo(
        () =>
            filterUncategorised
                ? transactions.filter(
                      (transaction) => !transaction.assignedCategory,
                  )
                : transactions,
        [transactions, filterUncategorised],
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
        <Fragment>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={filterUncategorised}
                        onChange={(e) =>
                            setFilterUncategorised(e.currentTarget.checked)
                        }
                    />
                }
                label='Filter un-categorised'
            />
            <Typography>
                {transactions.length === data.length
                    ? `${transactions.length} rows`
                    : `showing ${data.length} of ${transactions.length} rows`}
            </Typography>
            <MuiTable
                sx={{
                    width: '100%',
                }}
            >
                <TableHead
                    sx={{
                        position: 'sticky',
                        top: 0,
                    }}
                >
                    <TableRow>
                        {columns.map((column, idx) => (
                            <TableCell key={idx}>{column.header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((transaction, idx) => (
                        <TableRow
                            key={idx}
                            sx={{
                                '& .transaction_description_edit': {
                                    opacity: 0,
                                    transition: '.1s linear',
                                },
                                '&:hover .transaction_description_edit': {
                                    opacity: 1,
                                },
                            }}
                        >
                            {columns.map((column, columnIdx) => {
                                if (
                                    column.accessorKey === columnMap.description
                                ) {
                                    return (
                                        <TransactionDescription
                                            handleClickTitle={handleClickTitle}
                                            idx={idx}
                                            key={idx + '_' + columnIdx}
                                            title={
                                                transaction[
                                                    column.accessorKey
                                                ] as string
                                            }
                                        />
                                    );
                                }
                                if (column.accessorKey === 'assignedCategory') {
                                    const value = transaction.assignedCategory
                                        ? categories[
                                              transaction.assignedCategory
                                          ]
                                            ? {
                                                  id: String(
                                                      categories[
                                                          transaction
                                                              .assignedCategory
                                                      ].id,
                                                  ),
                                                  label: categories[
                                                      transaction
                                                          .assignedCategory
                                                  ].label,
                                              }
                                            : null
                                        : null;
                                    return (
                                        <TableCell
                                            key={idx + '_' + columnIdx}
                                            sx={{
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Autocomplete
                                                autoHighlight
                                                disablePortal
                                                isOptionEqualToValue={(
                                                    option,
                                                ) => option.id === value?.id}
                                                key={idx + '_' + columnIdx}
                                                onChange={(event, category) => {
                                                    if (!category) {
                                                        return;
                                                    }
                                                    updateAssignedCategory(
                                                        idx,
                                                        Number(category.id),
                                                    );
                                                }}
                                                options={options}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label='Category'
                                                        placeholder='unset'
                                                        sx={{
                                                            paddingTop:
                                                                marginTopBottom,
                                                            paddingBottom:
                                                                marginTopBottom,
                                                        }}
                                                    />
                                                )}
                                                sx={{
                                                    borderWidth:
                                                        transaction.assignedCategory ===
                                                        'unset'
                                                            ? 4
                                                            : 1,
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
                                                        color: theme.palette
                                                            .warning.light,
                                                        width: '16px',
                                                        height: '16px',
                                                        marginLeft: '6px',
                                                    })}
                                                />
                                            )}
                                        </TableCell>
                                    );
                                }
                                return (
                                    <TableCell key={idx + '_' + columnIdx}>
                                        {transaction[column.accessorKey]}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </Fragment>
    );
};

export default Table;
