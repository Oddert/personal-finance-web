import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, ListItem, Typography } from '@mui/material';
import {
    Close as IconDelete,
    Edit as IconEdit,
    FontDownload as IconMatchPositive,
    FontDownloadOutlined as IconMatchNegative,
} from '@mui/icons-material';

import { categorySlice } from '../../../../redux/slices/categorySlice';
import { intakeError } from '../../../../redux/thunks/errorThunks';
import { matcherDeleteAction } from '../../../../redux/thunks/categoryThunks';

import APIService from '../../../../services/APIService';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { IMatcher } from '../../../../types/Matcher.d';

import EditMatcher from '../EditMatcher';

import type { IProps } from './Matcher.types';
import { refreshAuthentication } from '../../../../redux/thunks/authThunks';

const iconWidth = 50;

/**
 * Displays a single Matcher with optional edit capability.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.matcher The Matcher to display.
 * @param props.categoryId The ID of the category the matcher belongs to.
 */
const Matcher: FC<IProps> = ({ matcher, categoryId }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);

    // TODO: move to an action
    const handleSubmit = (_matcher: Partial<IMatcher>) => {
        const request = async () => {
            const response = await APIService.updateSingleMatcher(
                { ..._matcher },
                matcher.id,
            );
            if (!response || !response.payload) {
                throw new Error(t('modalMessages.noServerResponse'));
            }
            dispatch(
                categorySlice.actions.updateSingleMatcher({
                    categoryId,
                    matcher: {
                        ...response.payload.matcher,
                        case_sensitive: Boolean(
                            response.payload.matcher.case_sensitive,
                        ),
                    },
                }),
            );
        };

        try {
            request();
            setOpen(false);
        } catch (error1: any) {
            if (error1.status === 401) {
                try {
                    dispatch(refreshAuthentication(request));
                } catch (error2: any) {
                    dispatch(intakeError(error1));
                }
            } else {
                dispatch(intakeError(error1));
            }
        }
    };

    const handleDelete = useCallback(() => {
        dispatch(matcherDeleteAction(matcher.id, true));
    }, [dispatch, categoryId, matcher.id]);

    const matchTypeTitle = useMemo(() => {
        switch (matcher?.match_type) {
            case 'any':
                return 'Category.matchMessages.any';
            case 'exact':
                return 'Category.matchMessages.exact';
            case 'end':
                return 'Category.matchMessages.end';
            case 'start':
                return 'Category.matchMessages.start';
            default:
                return '';
        }
    }, [matcher?.match_type]);

    if (open) {
        return (
            <EditMatcher
                matcher={matcher}
                onCancel={() => setOpen(false)}
                onSubmit={handleSubmit}
                clearOnCancel
                clearOnSubmit
            />
        );
    }

    return (
        <ListItem
            sx={(theme) => ({
                textAlign: 'left',
                padding: '2px 0',
                display: 'grid',
                justifyItems: 'center',
                gridTemplateColumns: `1fr repeat(2, ${iconWidth}px) auto`,
                [theme.breakpoints.down('sm')]: {
                    gridTemplateColumns: `1fr repeat(3, auto)`,
                },
                '& .Matcher_delete': {
                    opacity: 0,
                    color: theme.palette.common.white,
                    paddingLeft: 0,
                    paddingRight: 0,
                    minWidth: '40px',
                },
                '&:hover': {
                    '& .Matcher_delete': {
                        opacity: 1,
                    },
                },
            })}
        >
            <Button
                onClick={() => setOpen(true)}
                sx={(theme) => ({
                    justifySelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: theme.palette.common.white,
                    '& .MuiSvgIcon-root': {
                        transition: '.2s linear',
                        opacity: 0,
                    },
                    '&:hover': {
                        '& .MuiSvgIcon-root': {
                            opacity: 1,
                        },
                    },
                })}
                title={t('buttons.editThisMatcher')}
                variant='text'
            >
                <Typography
                    variant='body2'
                    sx={{
                        marginRight: '8px',
                    }}
                >
                    {matcher.match}
                </Typography>
                <IconEdit />
            </Button>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                title={
                    matcher.case_sensitive
                        ? t('Category.onlyMatchesExactCase')
                        : t('Category.ignoresCase')
                }
            >
                {matcher.case_sensitive ? (
                    <IconMatchPositive />
                ) : (
                    <IconMatchNegative />
                )}
            </Box>
            <Typography title={t(matchTypeTitle)} variant='body1'>
                {matcher.match_type}
            </Typography>
            <Button
                className='Matcher_delete'
                onClick={handleDelete}
                title={t('Category.deleteMatcher')}
                size='small'
            >
                <IconDelete />
            </Button>
        </ListItem>
    );
};

export default Matcher;
