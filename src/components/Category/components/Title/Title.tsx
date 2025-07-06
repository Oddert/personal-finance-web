import { FC, useCallback } from 'react';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { categoryUpdateAction } from '../../../../redux/thunks/categoryThunks';

import TitleBase from '../TitleBase/TitleBase';

import type { IProps } from './Title.types';

/**
 * Abstraction for {@link TitleBase} to provide callback props.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.category The selected category.
 * @param props.small If true, a more compact size will be used.
 */
const Title: FC<IProps> = ({ category, small = false }) => {
    const dispatch = useAppDispatch();

    const handleChange = useCallback(
        (value: string) => {
            dispatch(
                categoryUpdateAction(
                    {
                        ...category,
                        matchers:
                            category?.matchers?.map((matcher) => ({
                                ...matcher,
                                case_sensitive: Boolean(matcher.case_sensitive),
                            })) || [],
                        label: value,
                    },
                    true,
                ),
            );
        },
        [category, dispatch],
    );

    return (
        <TitleBase
            colour={category.colour}
            editable
            handleChange={handleChange}
            text={category.label}
            size={small ? 'md' : 'xl'}
            showBorder={false}
        />
    );
};

export default Title;
