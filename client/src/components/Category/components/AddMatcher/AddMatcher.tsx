import { useCallback, useEffect, useState } from 'react'

import {
    Button,
    ListItem,
    Tooltip,
} from '@mui/material'
import { AddCircle as AddIcon } from '@mui/icons-material'

import type { Category } from '../../../../types/Category'
import type { Matcher } from '../../../../types/Matcher'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initCreateSingleMatcher } from '../../../../redux/slices/categorySlice'

import EditMatcher from '../EditMatcher'

interface Props {
    categoryId: Category['id']
    defaultOpen?: boolean
    matcher?: Partial<Matcher>
    onSubmit?: (matcher: Partial<Matcher>) => void
}

const AddMatcher = ({
    categoryId,
    defaultOpen = false,
    matcher,
    onSubmit,
}: Props) => {
    const dispatch = useAppDispatch()

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(defaultOpen)
    }, [defaultOpen])

    const handleSubmit = useCallback((matcher: Partial<Matcher>) => {
        const addMatcher = async () => {
            dispatch(initCreateSingleMatcher({ matcher, categoryId }))
            setOpen(false)
        }
        addMatcher()
        if (onSubmit) {
            onSubmit(matcher)
        }
    }, [dispatch, categoryId, onSubmit])

    if (open) {
        return (
            <ListItem
                sx={{
                    transition: '.2s linear',
                    paddingLeft: 0,
                    paddingRight: 0,
                }}
            >
                <EditMatcher
                    clearOnBlur={false}
                    clearOnCancel={true}
                    clearOnSubmit={true}
                    onCancel={() => setOpen(false)}
                    onSubmit={handleSubmit}
                    matcher={matcher}
                />
            </ListItem>
        )
    }
    return (
        <ListItem
            className='Category_AddMatcher'
            sx={{
                transition: '.2s linear',
                paddingLeft: 0,
                paddingRight: 0,
            }}
        >
            <Tooltip title='Add matcher'>
                <Button
                    color='primary'
                    onClick={() => setOpen(!open)}
                    sx={{
                        textAlign: 'center',
                        width: '100%',
                        borderWidth: '2px',
                        '&:hover': {
                            borderWidth: '2px',
                        },
                    }}
                    variant='outlined'
                >
                    <AddIcon />
                </Button>
            </Tooltip>
        </ListItem>
    )
}

export default AddMatcher
