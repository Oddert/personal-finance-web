import { FC, useCallback } from 'react'

import type { Category } from '../../../../types/Category'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

import TitleBase from '../TitleBase/TitleBase'

interface IProps {
    category: Category
    small?: boolean
}

const Title: FC<IProps> = ({ category, small = false }) => {
    const dispatch = useAppDispatch()

    const handleChange = useCallback((value: string) => {
        dispatch(initUpdateSingleCategory({
            category: {
                ...category,
                matchers: category.matchers.map((matcher) => ({
                    ...matcher,
                    case_sensitive: Boolean(matcher.case_sensitive),
                })),
                label: value,
            },
        }))
    }, [category, dispatch])

    return (
        <TitleBase
            colour={category.colour}
            editable
            handleChange={handleChange}
            text={category.label}
            size={small ? 'md' : 'xl'}
            showBorder={false}
        />
    )
}

export default Title