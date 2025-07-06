import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { categoryUpdateAction } from '../../../../redux/thunks/categoryThunks';

import EditableText from '../../../EditableText';

import type { IProps } from './Description.types';

/**
 * Editable title component for the Category.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.category The current Category.
 */
const Title: FC<IProps> = ({ category }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

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
            placeholder={t('Category.descriptionPlaceholder')}
            text={category.description}
        />
    );
};

export default Title;
