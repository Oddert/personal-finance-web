import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, Button, TextField } from '@mui/material'

import { getTransactionsEndDate, getTransactionsStartDate } from '../../../../redux/selectors/transactionsSelectors'
import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'
import { setEndDate, setStartDate } from '../../../../redux/slices/transactionsSlice'

dayjs.extend(localizedFormat)

const RequestControls = () => {
    const dispatch = useAppDispatch()

    const [start, setStart] = useState('2020-01-01')
    const [end, setEnd] = useState('2020-01-01')

    const startDate = useSelector(getTransactionsStartDate)
    const endDate = useSelector(getTransactionsEndDate)

    const handleChangeStart = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setStartDate({ startDate: e.target.value }))
    }, [dispatch])

    const handleChangeEnd = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setEndDate({ endDate: e.target.value }))
    }, [dispatch])

    useEffect(() => {
        const date = dayjs(startDate).format('YYYY-MM-DD')
        if (!(date === 'Invalid Date')) {
            setStart(date)
        }
    }, [startDate])

    useEffect(() => {
        const date = dayjs(endDate).format('YYYY-MM-DD')
        if (!(date === 'Invalid Date')) {
            setEnd(date)
        }
    }, [endDate])

    return (
        <Box>
            <TextField
                name='startDate'
                label='Start Date'
                InputLabelProps={{ shrink: true, required: true }}
                type='date'
                value={start}
                onChange={handleChangeStart}
            />
            <TextField
                name='endDate'
                label='End Date'
                InputLabelProps={{ shrink: true, required: true }}
                type='date'
                value={end}
                onChange={handleChangeEnd}
            />
            <Button>Get transactions</Button>
        </Box>
    )
}

export default RequestControls
