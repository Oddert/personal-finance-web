import { FC, useCallback, useMemo, useState } from 'react';

import { Box, Button, ListItem, Typography } from '@mui/material';
import {
    Close as DeleteIcon,
    Edit as EditIcon,
    FontDownload as MatchPositiveIcon,
    FontDownloadOutlined as MatchNegativeIcon,
} from '@mui/icons-material';

import {
    categorySlice,
    initDeleteSingleMatcher,
} from '../../../../redux/slices/categorySlice';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import APIService from '../../../../services/APIService';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { Matcher as MatcherT } from '../../../../types/Matcher.d';

import EditMatcher from '../EditMatcher';

import type { IProps } from './Matcher.types';

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
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);

    const handleSubmit = (_matcher: Partial<MatcherT>) => {
        const request = async () => {
            try {
                const response = await APIService.updateSingleMatcher(
                    { ..._matcher },
                    matcher.id,
                );
                if (!response || !response.payload) {
                    throw new Error('No response received from the server.');
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
                setOpen(false);
            } catch (error) {
                console.error(error);
                dispatch(intakeError(error));
            }
        };
        request();
    };

    const handleDelete = useCallback(() => {
        dispatch(
            initDeleteSingleMatcher({ matcherId: matcher.id, categoryId }),
        );
    }, [dispatch, categoryId, matcher.id]);

    const matchTypeTitle = useMemo(() => {
        switch (matcher?.match_type) {
            case 'any':
                return 'Matches this text anywhere in the description';
            case 'exact':
                return 'Only matches this exact string (may not have anything before or after)';
            case 'end':
                return 'Matches only if this text is at the end of a description';
            case 'start':
                return 'Matches only if this text is at the beginning of a description';
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
                title='edit this matcher'
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
                <EditIcon />
            </Button>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                title={
                    matcher.case_sensitive
                        ? 'only matches exact case'
                        : 'ignores case'
                }
            >
                {matcher.case_sensitive ? (
                    <MatchPositiveIcon />
                ) : (
                    <MatchNegativeIcon />
                )}
            </Box>
            <Typography title={matchTypeTitle} variant='body1'>
                {matcher.match_type}
            </Typography>
            <Button
                className='Matcher_delete'
                onClick={handleDelete}
                size='small'
            >
                <DeleteIcon />
            </Button>
        </ListItem>
    );
};

export default Matcher;
