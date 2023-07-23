import { useCallback, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import type { SyntheticEvent } from 'react'

import { Box, Slider, Typography } from '@mui/material'

import { generateMarks, getRangeKeyEncoding } from '../../../../utils/transactionUtils'

import {
    TransactionRange,
    setRangeKeys,
    setRangeValues,
    updateValue
} from '../../../../contexts/transactionRangeContext'
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

    const [localValue, setLocalValue] = useState<[number, number]>([0, 0])

    useEffect(() => {
        const rangeKeysArr: string[] = []
        const rangeValuesArr: { top: number, bottom: number }[] = []

        Object.keys(orderedTransactions).forEach((year) => {
            Object.keys(orderedTransactions[year]).forEach((month) => {
                rangeKeysArr.push(getRangeKeyEncoding(year, month))
                const bottomDate = new Date(`${year}-${Number(month) + 1}-01`)
                const topDate = new Date(`${year}-${Number(month) + 2}-01`)
                topDate.setDate(0)
                rangeValuesArr.push({
                    bottom: bottomDate.getTime(),
                    top: topDate.getTime(),
                })
            })
        })

        const rangeKeys = rangeKeysArr.reduce((
            acc: {
                keyList: TransactionRangeState['rangeKeys'],
                length: number,
            },
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

        console.log(rangeValuesArr)
        const rangeValues = rangeValuesArr.reduce(
            (acc: { [key: number]: { top: number, bottom: number }}, value, idx) => {
                acc[idx] = value
                return acc
            },
            {}
        )
        console.log(rangeValues)

        const customMarks = generateMarks(Object.values(rangeKeys.keyList))

        dispatch(setRangeValues(rangeValues))
        dispatch(setRangeKeys(rangeKeys.keyList, rangeKeys.length, customMarks))
        dispatch(updateValue([0, rangeKeys.length]))
    }, [orderedTransactions, dispatch])

    const handleChange = (
        event: Event | SyntheticEvent<Element, Event>,
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
        
        setLocalValue(newValue as [number, number])
        // dispatch(updateValue(newValue as [number, number]))
    }

    const onChangeCommitted = useCallback(() => {
        dispatch(updateValue(localValue))
    }, [dispatch, localValue])

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    return (
        <Box>
            <Typography gutterBottom>
                Date Range
            </Typography>
            <Slider
                getAriaLabel={() => 'Transaction range'}
                value={localValue}
                onChange={handleChange}
                onChangeCommitted={onChangeCommitted}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext}
                valueLabelFormat={(value) => rangeKeys[value]}
                min={0}
                max={rangeLength}
                step={1}
                marks={marks}
            />
        </Box>
    )
}

export default RangeControls
