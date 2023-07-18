import { Fragment, useReducer, useState } from 'react'
import { MuiFileInput } from 'mui-file-input'

import { readCsv } from '../../../../utils/commonUtils'

import {
    transactionEditInitialState,
    TransactionEditContext,
    transactionEditReducer,
    writeHeaders,
    writeTransactions,
} from '../../../../contexts/transactionEditContext'

import TransactionEdit from '../../../../components/TransactionEdit/TransactionEdit'

const Upload = () => {
    const [state, dispatch] = useReducer(
        transactionEditReducer,
        transactionEditInitialState,
    )

    const [modalOpen, setModalOpen] = useState(false)

    // const hardMap: { [key: string]: string } = {
    //     'Transaction Date': 'date',
    //     'Transaction Type': 'transaction_type',
    //     'Transaction Description': 'description',
    //     'Debit Amount': 'debit',
    //     'Credit Amount': 'credit',
    //     'Balance': 'ballance',
    // }

    const handleChange = (files: File[]|null) => {
        if (files) {
            files.forEach(file => {
                const reader = new FileReader()
                reader.onload = (evt) => {
                    const readValues = readCsv(evt?.target?.result)
                    if (readValues) {
                        dispatch(writeHeaders(readValues.headers))
                        dispatch(writeTransactions(readValues.values))
                    }
                }
                reader.readAsText(file)
            })
            setModalOpen(true)
        }
    }

    return (
        <Fragment>
            <MuiFileInput multiple onChange={handleChange} />
            <TransactionEditContext.Provider
                value={{ state, dispatch }}
            >
                <TransactionEdit open={modalOpen} onClose={() => setModalOpen(false)} />
            </TransactionEditContext.Provider>
        </Fragment>
    )
}

export default Upload
