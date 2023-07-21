import { useCallback, useContext } from 'react'

import { Button } from '@mui/material'

import { TransactionEditContext } from '../../../contexts/transactionEditContext'

import routes from '../../../services/routes'

// TODO: rework to base transactionsWithValidKeys on actual keys not entries
// TODO: investigate category_id not working
// TODO: potentially invert the column map
const Submit = () => {
    const { state: { transactions, columnMap } } = useContext(TransactionEditContext)

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
                .reduce((acc: { [key: string]: string|number }, pair) => {
                    const key = invertMapping[pair[0]]
                    if (!key) {
                        return acc
                    }

                    if (key === 'debit' || key === 'credit' || key === 'ballance') {
                        acc[key] = Number(pair[1])
                    } else {
                        acc[key] = pair[1]
                    }
                    return acc
                }, {}))

        const request = async () => {
            const response = await routes.createManyTransactions(transactionsWithValidKeys)
            console.log(response)
        }
        request()
    }, [columnMap, transactions])

    return (
        <Button
            color='primary'
            onClick={handleClick}
            variant='contained'
        >
            Submit
        </Button>
    )
}

export default Submit
