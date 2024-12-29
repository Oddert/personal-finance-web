import { useCallback } from 'react'

import type { Category } from '../../../../types/Category'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

import EditableText from '../../../EditableText'

interface Props {
    category: Category
}

const Title = ({ category }: Props) => {
    const dispatch = useAppDispatch()

    const handleChange = useCallback((value: string) => {
        dispatch(initUpdateSingleCategory({
            category: { ...category, description: value },
        }))
    }, [category, dispatch])

    return (
        <EditableText
            containerSx={{
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}
            headingProps={{
                variant: 'subtitle1',
                align: 'right',
                sx: {
                    margin: '16px 0',
                },
            }}
            onChange={handleChange}
            placeholder='Click to add a description.'
            text={category.description}
        />
    )
}

export default Title