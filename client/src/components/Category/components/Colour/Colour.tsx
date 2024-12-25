import { useCallback, useEffect, useState } from 'react'

import type { Category } from '../../../../types/Category'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

import ColourEdit from '../../../ColourEdit'

interface Props {
    category: Category
}

const Colour = ({ category }: Props) => {
    const dispatch = useAppDispatch()

    const [colour, setColour] = useState<string>('#bec3c7')

    const handleSubmit = useCallback((editedColour: string) => {
        dispatch(initUpdateSingleCategory({
            category: { ...category, colour: editedColour },
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
