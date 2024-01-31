import { useCallback } from 'react'

import type { Category } from '../../../../types/Category'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

import TitleBase from '../TitleBase/TitleBase'

interface Props {
    category: Category
}

const Title = ({ category }: Props) => {
    const dispatch = useAppDispatch()

    const handleChange = useCallback((value: string) => {
        dispatch(initUpdateSingleCategory({
            category: { ...category, label: value },
        }))
    }, [category, dispatch])

    return (
        <TitleBase
            colour={category.colour}
            editable
            handleChange={handleChange}
            text={category.label}
            size='xl'
        />
    )
}

export default Title