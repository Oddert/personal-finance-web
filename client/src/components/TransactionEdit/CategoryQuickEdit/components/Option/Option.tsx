import { useCallback, useContext, useState } from 'react'
import { Button } from '@mui/material'

import type { Category as CategoryT } from '../../../../../types/Category'

import { TransactionEditContext, toggleSideBar } from '../../../../../contexts/transactionEditContext'

import Category from '../../../../Category/Category'

import ColourBase from '../../../../Category/components/ColourBase'
import TitleBase from '../../../../Category/components/TitleBase'

interface Props {
    category: CategoryT
}

const Option = ({ category }: Props) => {
    const { dispatch, state: { match } } = useContext(TransactionEditContext)

    const [open, setOpen] = useState(false)

    const handleClose = useCallback(() =>
        dispatch(toggleSideBar(false)),
        [dispatch]
    )

    if (open) {
        return (
            <Category
                category={category}
                defaultOpenAddNew
                defaultOpenMatcher={{ match }}
                onAddNewSubmit={handleClose}
            />
        )
    }
    return (
        <Button
            onClick={() => setOpen(true)}
            sx={(theme) => ({
                padding: '10px 30px',
                [theme.breakpoints.down('xs')]: {
                    padding: '15px',
                },
                minWidth: '300px',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                color: theme.palette.common.white,
            })}
        >
            <ColourBase
                asButton={false}
                colour={category.colour}
                size='sm'
            />
            <TitleBase
                colour={category.colour}
                editable={false}
                text={category.label}
            />
        </Button>
    )
}

export default Option