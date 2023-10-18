import { Fragment, useCallback, useContext, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
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
    Button,
} from '@mui/material'

import { Circle as DotIcon } from '@mui/icons-material'

import {
    defaultColumns,
    toggleSideBar,
    TransactionEditContext,
    updateCategory,
} from '../../../contexts/transactionEditContext'

import { getCategoryOrderedDataById } from '../../../redux/selectors/categorySelectors'

import type { Category } from '../../../types/Category'

const marginTopBottom = '4px'

const Table = () => {
    const [filterUncategorised, setFilterUncategorised] = useState(false)

    const { dispatch, state: { columnMap, transactions } } = useContext(TransactionEditContext)

    const categories = useSelector(getCategoryOrderedDataById)

    const updateAssignedCategory = useCallback((
        idx: number,
        assignedCategory: number
    ) => {
        dispatch(updateCategory(idx, assignedCategory))
    }, [dispatch])

    const columns = useMemo(() => {
        return defaultColumns(categories, updateAssignedCategory).map(header => {
            return ({
                ...header,
                accessorKey: header.accessorKey === 'assignedCategory'
                    ? header.accessorKey
                    : columnMap[header.accessorKey],
            })
        })
    }, [columnMap, categories, updateAssignedCategory])

    const handleClickTitle = useCallback(
        (match: string) => {
            dispatch(toggleSideBar(true, match))
        },
        [dispatch]
    )

    const data = useMemo(() => 
        filterUncategorised
            ? transactions.filter(transaction => !transaction.assignedCategory)
            : transactions,
        [transactions, filterUncategorised]
    )

    const options = useMemo(() => Object.entries(
            categories as { [id: string]: Category }
        ).map(([id, category]) => ({
            id,
            label: category.label,
        })),
        [categories]
    )

    return (
        <Fragment>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={filterUncategorised}
                        onChange={(e) => setFilterUncategorised(e.currentTarget.checked)}
                    />
                }
                label='Filter un-categorised'
            />
            {/* <Typography>{transactions.length - data.length} rows hidden ({transactions.length} total)</Typography> */}
            <Typography>
                {
                    transactions.length === data.length
                        ? `${transactions.length} rows`
                        : `showing ${data.length} of ${transactions.length} rows`
                }
                </Typography>
            <MuiTable
                sx={{
                    width: '100%',
                }}
            >
                <TableHead>
                    <TableRow>
                        {columns.map((column, idx) => (
                            <TableCell key={idx}>
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((transaction, idx) => (
                        <TableRow key={idx}>
                            {columns.map((column, columnIdx) => {
                                if (column.accessorKey === columnMap.description) {
                                    return (
                                        <TableCell key={idx + '_' + columnIdx}>
                                            <Button
                                                onClick={() => handleClickTitle(
                                                    transaction[column.accessorKey] as string,
                                                )}
                                                variant='text'
                                            >
                                                {transaction[column.accessorKey]}
                                            </Button>
                                        </TableCell>
                                    )
                                }
                                if (column.accessorKey === 'assignedCategory') {
                                    const value = categories[transaction.assignedCategory] 
                                        ? {
                                            id: String(categories[transaction.assignedCategory].id),
                                            label: categories[transaction.assignedCategory].label,
                                        }
                                        : null
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
                                                isOptionEqualToValue={(option) => option.id === value?.id}
                                                key={idx + '_' + columnIdx}
                                                onChange={(event, category) => {
                                                    if (!category) {
                                                        return
                                                    }
                                                    updateAssignedCategory(idx, Number(category.id))
                                                }}
                                                options={options}
                                                placeholder='unset'
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label='Category'
                                                        sx={{
                                                            paddingTop: marginTopBottom,
                                                            paddingBottom: marginTopBottom,
                                                        }}
                                                    />
                                                )}
                                                sx={{
                                                    borderWidth:
                                                        transaction.assignedCategory === 'unset'
                                                            ? 4
                                                            : 1,
                                                    width: '100%',
                                                    '& .MuiInputBase-root': {
                                                        padding: '2px',
                                                    }
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
                                        </TableCell>
                                    )
                                }
                                return (
                                    <TableCell key={idx + '_' + columnIdx}>
                                        {transaction[column.accessorKey]}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </Fragment>
    )
}

export default Table
