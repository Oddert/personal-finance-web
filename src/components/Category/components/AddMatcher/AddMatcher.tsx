import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ListItem, Tooltip } from '@mui/material';
import { AddCircle as IconAdd } from '@mui/icons-material';

import type { Matcher } from '../../../../types/Matcher.d';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { initCreateSingleMatcher } from '../../../../redux/slices/categorySlice';

import EditMatcher from '../EditMatcher';

import type { IProps } from './AddMatcher.types';

/**
 * Create form to add a new Matcher.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.categoryId The ID of the current Category.
 * @param props.defaultOpen If true, the form will render as open by default when the component renders (as opposed to on user expands).
 * @param props.matcher Default options for the new Matcher.
 * @param props.onSubmit Callback function invoked when the submit succeeds.
 */
const AddMatcher: FC<IProps> = ({
    categoryId,
    defaultOpen = false,
    matcher,
    onSubmit,
}) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log('setting default open: ', { defaultOpen });
        setOpen(defaultOpen);
    }, [defaultOpen]);

    const handleSubmit = useCallback(
        (nextMatcher: Partial<Matcher>) => {
            const addMatcher = async () => {
                dispatch(
                    initCreateSingleMatcher({
                        matcher: nextMatcher,
                        categoryId,
                    }),
                );
                setOpen(false);
            };
            addMatcher();
            if (onSubmit) {
                onSubmit(nextMatcher);
            }
        },
        [dispatch, categoryId, onSubmit],
    );
    console.log({ open });

    if (open) {
        return (
            <ListItem
                sx={{
                    transition: '.2s linear',
                    paddingLeft: 0,
                    paddingRight: 0,
                }}
            >
                <EditMatcher
                    clearOnBlur={false}
                    clearOnCancel={true}
                    clearOnSubmit={true}
                    onCancel={() => setOpen(false)}
                    onSubmit={handleSubmit}
                    matcher={matcher}
                />
            </ListItem>
        );
    }
    return (
        <ListItem
            className='Category_AddMatcher'
            sx={{
                transition: '.2s linear',
                paddingLeft: 0,
                paddingRight: 0,
            }}
        >
            <Tooltip title={t('Category.addMatcher')}>
                <Button
                    color='primary'
                    onClick={() => setOpen(!open)}
                    sx={{
                        textAlign: 'center',
                        width: '100%',
                        borderWidth: '2px',
                        '&:hover': {
                            borderWidth: '2px',
                        },
                    }}
                    variant='outlined'
                >
                    <IconAdd />
                </Button>
            </Tooltip>
        </ListItem>
    );
};

export default AddMatcher;
