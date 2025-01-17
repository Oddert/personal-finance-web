import { FC, useCallback, useContext, useState } from 'react'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Button, CircularProgress } from '@mui/material'

import { TransactionEditContext } from '../../../contexts/transactionEditContext'

import routes from '../../../services/routes'

import { useAppDispatch } from '../../../hooks/ReduxHookWrappers'
import { requestTransactions } from '../../../redux/slices/transactionsSlice'

import type { IProps } from './Submit.types'

dayjs.extend(localizedFormat)

const Submit: FC<IProps> = ({ onClose }) => {
    const appDispatch = useAppDispatch(); 
    const { state: { columnMap, mode, transactions } } = useContext(TransactionEditContext)

    const [loading, setLoading] = useState(false)

    const handleClick = useCallback(() => {

        // Create an 'opposite' of the category map.
        // In future we may completely reverse the way the category map works
        // I.e. have the transactions stored in context with the 'correct' keys and convert to the custom values for display.
        const invertMapping = Object.entries(columnMap)
            .reduce((acc: { [key: string]: string }, pair) => {
                acc[pair[1]] = pair[0]
                return acc
            }, { 'assignedCategory': 'category_id' })

        // Convert the keys from the user's proprietary CSV format to our transaction format.
        const transactionsWithValidKeys = transactions.map(
            (transaction) => Object.entries(transaction)
                .reduce((acc: { [key: string]: string|number|boolean }, pair) => {
                    const key = invertMapping[pair[0]]
                    const whitelistKeys = ['debit', 'credit', 'ballance']

                    if (!key) {
                        return acc
                    }

                    if (whitelistKeys.includes(key)) {
                        if (pair[1] === '-') {
                            acc[key] = 0
                        } else {
                            acc[key] = Number(pair[1])
                        }
                    } else {
                        acc[key] = pair[1]
                    }
                    return acc
                }, {})
            )

        const request = async () => {
            const response = mode === 'upload'
                ? await routes.createManyTransactions(transactionsWithValidKeys)
                : await routes.updateManyTransactions(transactionsWithValidKeys);
            setLoading(false)
            if (response.status === 201) {
                onClose()
                const date = dayjs().set('month', 0).set('date', 1)
                const startDate = date.format('YYYY-MM-DD')
                const endDate = dayjs().format('YYYY-MM-DD')
                appDispatch(requestTransactions({ startDate, endDate }))
            }
        }
        setLoading(true)
        request()
    }, [appDispatch, columnMap, mode,  onClose, transactions])

    return (
        <Button
            color='primary'
            disabled={loading}
            onClick={handleClick}
            variant='contained'
            sx={{
                margin: '12px 0 12px auto',
                display: 'block',
            }}
        >
            {loading ? <CircularProgress /> : mode === 'upload' ? 'Submit' : 'Save'}
        </Button>
    )
}

export default Submit
