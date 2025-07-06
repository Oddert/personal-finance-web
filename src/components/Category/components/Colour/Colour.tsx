import { FC, useCallback, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { categoryUpdateAction } from '../../../../redux/thunks/categoryThunks';

import ColourEdit from '../../../ColourEdit';

import type { IProps } from './Colour.types';

/**
 * Editable colour component for the Category.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.category The current Category.
 */
const Colour: FC<IProps> = ({ category }) => {
    const dispatch = useAppDispatch();

    const [colour, setColour] = useState<string>('#bec3c7');

    const handleSubmit = useCallback(
        (editedColour: string) => {
            dispatch(
                categoryUpdateAction(
                    {
                        ...category,
                        matchers:
                            category?.matchers?.map((matcher) => ({
                                ...matcher,
                                case_sensitive: Boolean(matcher.case_sensitive),
                            })) || [],
                        colour: editedColour,
                    },
                    true,
                ),
            );
        },
        [category, dispatch],
    );

    useEffect(() => {
        setColour(category.colour);
    }, [category]);

    return (
        <ColourEdit
            colour={colour}
            onSubmit={handleSubmit}
            popoverId={'choose-category-colour'}
        />
    );
};

export default Colour;
