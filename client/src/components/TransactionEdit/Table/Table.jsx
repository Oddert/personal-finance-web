import { useContext, useMemo } from 'react'

import { defaultColumns, TransactionEditContext } from '../../../contexts/transactionEditContext'

import TableLowerOrderComponent from '../../Table/'

const Table = () => {
    const { state: { columnMap, transactions } } = useContext(TransactionEditContext)

    const columns = useMemo(() => {
        return defaultColumns.map(header => {
            return ({
                header: header.header,
                accessorKey: columnMap[header.accessorKey],
            })
        })
    }, [columnMap])

    return (
        <TableLowerOrderComponent
            data={transactions}
            columns={columns}
        />
    )
}

export default Table
