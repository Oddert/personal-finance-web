import { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux';

import { Box, Slider, Typography } from '@mui/material'

import { generateMarks, getRangeKeyEncoding } from '../../../../utils/transactionUtils'

import { TransactionRange, setRangeKeys, updateValue } from '../../../../contexts/transactionRangeContext'
import type { TransactionRangeState } from '../../../../contexts/transactionRangeContext'

import { getTransactionsOrderedByDate } from '../../../../redux/selectors/transactionsSelectors';

function valuetext(value: number) {
    return `${value}°C`;
}

const RangeControls = () => {
    const {
        dispatch,
        state: { marks, rangeKeys, rangeLength, value },
    } = useContext(TransactionRange)

    const orderedTransactions = useSelector(getTransactionsOrderedByDate)

    useEffect(() => {
        const rangeKeysArr: string[] = []

        Object.keys(orderedTransactions).forEach((year) => {
            Object.keys(orderedTransactions[year]).forEach((month) => {
                rangeKeysArr.push(getRangeKeyEncoding(year, month))
            })
        })

        const rangeKeys = rangeKeysArr.reduce((
            acc: { keyList: TransactionRangeState['rangeKeys'], length: number },
            key,
            idx
        ) => {
                acc.keyList[idx] = key
                acc.length++
                return acc
            },
            {
                keyList: {},
                length: -1,
            },
        )

        const customMarks = generateMarks(Object.values(rangeKeys.keyList))

        dispatch(setRangeKeys(rangeKeys.keyList, rangeKeys.length, customMarks))
        dispatch(updateValue([0, rangeKeys.length]))
    }, [orderedTransactions, dispatch])

    const handleChange = (
        event: Event,
        newValue: number | number[],
        // activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return
        }
        // if (activeThumb === 0) {
        //     const clampedValue: [number, number] = [
        //         Math.min(newValue[0], newValue[1] - 1),
        //         newValue[1],
        //     ]
        //     dispatch(updateValue(clampedValue))
        // } else {
        //     const clampedValue: [number, number] = [
        //         Math.min(newValue[0], newValue[1] - 1),
        //         newValue[1],
        //     ]
        //     dispatch(updateValue(clampedValue))
        // }
        dispatch(updateValue(newValue as [number, number]))
    }

    return (
        <Box>
            <Typography gutterBottom>
                Date Range
            </Typography>
            <Slider
                getAriaLabel={() => 'Transaction range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext}
                valueLabelFormat={(value) => {
                    console.log(value, rangeKeys[value])
                    return rangeKeys[value]
                }}
                min={0}
                max={rangeLength}
                step={1}
                marks={marks}
            />
        </Box>
    )
}

export default RangeControls
