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
} from '@mui/material'

import {
    defaultColumns,
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
            <Typography>{transactions.length - data.length} rows hidden</Typography>
            <MuiTable
                sx={{
                    width: '100%',
                }}
            >
                <TableHead>
                    <TableRow>
                        {columns.map((column, idx) => (
                            <TableHead key={idx}>{column.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((transaction, idx) => (
                        <TableRow key={idx}>
                            {columns.map((column, columnIdx) => {
                                if (column.accessorKey === 'assignedCategory') {
                                    const value = categories[transaction.assignedCategory] 
                                        ? {
                                            id: String(categories[transaction.assignedCategory].id),
                                            label: categories[transaction.assignedCategory].label,
                                        }
                                        : null
                                    return (
                                        <TableCell>
                                            <Autocomplete
                                                autoHighlight
                                                disablePortal
                                                isOptionEqualToValue={(option) => option.id === value?.id}
                                                key={columnIdx}
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
                                                        padding: '4px',
                                                    }
                                                }}
                                                value={value}
                                            />
                                        </TableCell>
                                    )
                                }
                                return (
                                    <TableCell key={columnIdx}>
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
