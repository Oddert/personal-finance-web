import { FC, useCallback } from 'react'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

import EditableText from '../../../EditableText'

import type { IProps } from './Description.types'

const Title: FC<IProps> = ({ category }) => {
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