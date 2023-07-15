import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { ColumnDef } from '@tanstack/react-table'

import { Transaction } from '../../../../types/Transaction'

import { RootState } from '../../../../redux/constants/store'
import { getTransactionsResponse } from '../../../../redux/selectors/transactionsSelectors'

import { transactionColumns } from '../../../../utils/transactionUtils'

import TableWrapper from '../../../../components/Table/Table'


const Table = () => {
    const transactions = useSelector<RootState, Transaction[]>(state => getTransactionsResponse(state))

    const columns = useMemo<ColumnDef<Transaction>[]>(() => transactionColumns, [])

    return <TableWrapper<Transaction> data={transactions} columns={columns} />
}

export default Table