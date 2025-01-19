import { FC, useCallback, useEffect, useState } from 'react'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

import ColourEdit from '../../../ColourEdit'

import type { IProps } from './Colour.types'

/**
 * Editable colour component for the Category.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.category The current Category.
 */
const Colour: FC<IProps> = ({ category }) => {
    const dispatch = useAppDispatch()

    const [colour, setColour] = useState<string>('#bec3c7')

    const handleSubmit = useCallback((editedColour: string) => {
        dispatch(initUpdateSingleCategory({
            category: {
                ...category,
                matchers: category.matchers.map((matcher) => ({
                    ...matcher,
                    case_sensitive: Boolean(matcher.case_sensitive)
                })),
                colour: editedColour,
            },
        }))
    }, [category, dispatch])
        
    useEffect(() => {
        setColour(category.colour)
    }, [category])

    return (
        <ColourEdit
            colour={colour}
            onSubmit={handleSubmit}
            popoverId={'choose-category-colour'}
        />
    )
}

export default Colour
