import { Fragment, useCallback, useEffect, useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import { MuiFileInput } from 'mui-file-input'

import { Category } from '../../types/Category'
import { Matcher } from '../../types/Matcher'

import { PERSONAL_FINANCE_CSV_MAPPING } from '../../constants/appConstants'

import { readCsv } from '../../utils/commonUtils'

import {
    transactionEditInitialState,
    TransactionEditContext,
    transactionEditReducer,
    writeHeaders,
    writeTransactions,
    setColumnMap,
} from '../../contexts/transactionEditContext'

import { getCategoryResponse } from '../../redux/selectors/categorySelectors'

import TransactionEdit from '../TransactionEdit/TransactionEdit'

/**
 * Creates a RegExp instance from the Matcher format.
 * @param matcher The Matcher to be converted.
 * @returns 
 */
const createRegexFromMatcher = (matcher: Matcher) => {
    const prefix = matcher.match_type === 'exact' || matcher.match_type === 'start' ? '^' : '.*'
    const suffix = matcher.match_type === 'exact' || matcher.match_type === 'end' ? '$' : '.*'
    const location = matcher.match_type === 'any' ? 'g' : ''
    const capitalisation = matcher.case_sensitive ? '' : 'i'
    const matchString = `${prefix}${matcher.match}${suffix}`
    const options = `${location}${capitalisation}`
    const regexp = new RegExp(matchString, options)
    return regexp
}

/**
 * Attempts to match categories to a list of partially-formatted matchers.
 * @param transactions List of read in CSV rows to be made into Transactions.
 * @param categories List of categories to attempt to match to.
 * @returns The list of transactions with categories matched (if matches are found).
 */
const autoMatchCategories = (
    transactions: { [key: string]: string|number }[],
    categories: Category[],
) => {
    // Reduces the list of categories down to key-value pairs and a raw list of all `match` attributes.
    const regexList = categories.reduce((
        acc: { all: string[], withCategory: [RegExp, Category][] },
        category: Category,
    ) => {
        category?.matchers?.forEach(matcher => {
            const re = createRegexFromMatcher(matcher)
            acc.all.push(matcher.match)
            acc.withCategory.push([re, category])
        })
        return acc
    },
    { all: [], withCategory: [] })

    // The list of all `match` attributes is used to create a rough regex
    // This regex loosely matches any portion of the label in order to decide
    // whether or not to apply the matcher search which is more computationally expensive.
    const superMatcher = new RegExp(regexList.all.join('|'), 'gi')

    return transactions.map((transaction) => {
        const description: string = transaction['Transaction Description'] as string
        superMatcher.lastIndex = 0
        // Test the label against the loose combined regex.
        if (superMatcher.test(description)) {
            // If the matcher is a possible match, compare it against the list of matchers.
            // Note: if multiple matchers are valid only the first is accepted.
            // It is the user's imperative to make sure the matchers make sense and avoid conflict.
            const result = regexList.withCategory.find((pair) => {
                pair[0].lastIndex = 0
                if (pair[0].test(description)) {
                    return true
                }
                return false
            })
            if (result) {
                return {
                    ...transaction,
                    assignedCategory: result[1].id,
                }
            }
        }
        return transaction
    })
}

const Upload = () => {
    const [state, dispatch] = useReducer(
        transactionEditReducer,
        transactionEditInitialState,
    )

    const categories = useSelector(getCategoryResponse)

    const [modalOpen, setModalOpen] = useState(false)

    const handleChange = useCallback((files: File[]|null) => {
        if (files) {
            const transactions: { [key: string]: string|number }[] = []
            let headers: string[] = []

            files.forEach((file, idx) => {
                const reader = new FileReader()
                reader.onload = (evt) => {
                    const readValues = readCsv(evt?.target?.result)
                    if (readValues) {
                        if (!headers.length) {
                            headers = readValues.headers
                        }
                        transactions.push(...readValues.values)
                    }
                    if (idx === files.length - 1) {
                        const withCategories = autoMatchCategories(transactions, categories)
                        dispatch(writeHeaders(headers))
                        dispatch(
                            writeTransactions(withCategories)
                        )
                    }
                }
                reader.readAsText(file)
            })            
            setModalOpen(true)
        }
    }, [categories])

    useEffect(() => {
        const mapping = localStorage.getItem(PERSONAL_FINANCE_CSV_MAPPING)
        if (mapping) {
            dispatch(setColumnMap(JSON.parse(mapping) as { [key: string]: string }))
        } else {
            localStorage.setItem(
                PERSONAL_FINANCE_CSV_MAPPING,
                JSON.stringify(transactionEditInitialState.columnMap),
            )
        }
    }, [])

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
