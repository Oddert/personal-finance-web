import { useCallback, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
    defaultColumns,
    TransactionEditContext,
    updateCategory,
} from '../../../contexts/transactionEditContext'

import { getCategoryResponse } from '../../../redux/selectors/categorySelectors'

import TableLowerOrderComponent from '../../Table/'

const Table = () => {
    const { dispatch, state: { columnMap, transactions } } = useContext(TransactionEditContext)

    const categories = useSelector(getCategoryResponse)

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

    return (
        <TableLowerOrderComponent
            data={transactions}
            columns={columns}
            compact={true}
        />
    )
}

export default Table
