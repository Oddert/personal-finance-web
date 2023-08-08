import { useCallback } from 'react'

import type { Category } from '../../../../types/Category'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

import EditableText from '../EditableText/'

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
        <EditableText
            headingProps={{
                sx: {
                    borderBottom: `2px solid ${category.colour}`,
                    alignSelf: 'stretch',
                },
                variant: 'h3',
            }}
            onChange={handleChange}
            text={category.label}
        />
    )
}

export default Title