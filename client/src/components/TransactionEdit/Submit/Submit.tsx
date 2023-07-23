import { useCallback, useContext, useState } from 'react'

import { Button, CircularProgress } from '@mui/material'

import { TransactionEditContext } from '../../../contexts/transactionEditContext'

import routes from '../../../services/routes'

// TODO: rework to base transactionsWithValidKeys on actual keys not entries
// TODO: investigate category_id not working
// TODO: potentially invert the column map
const Submit = () => {
    const { state: { transactions, columnMap } } = useContext(TransactionEditContext)

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
            transaction => Object.entries(transaction)
                .reduce((acc: { [key: string]: string|number|boolean }, pair) => {
                    const key = invertMapping[pair[0]]
                    const whitelistKeys = ['debit', 'credit', 'ballance']

                    if (!key) {
                        return acc
                    }

                    if (key in whitelistKeys) {
                        acc[key] = Number(pair[1])
                    } else {
                        acc[key] = pair[1]
                    }
                    return acc
                }, {}))

        const request = async () => {
            await routes.createManyTransactions(transactionsWithValidKeys)
            setLoading(false)
        }
        setLoading(true)
        request()
    }, [columnMap, transactions])

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
            {loading ? <CircularProgress /> : 'Submit'}
        </Button>
    )
}

export default Submit
