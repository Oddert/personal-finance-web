import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, Typography } from '@mui/material';

import { Edit as EditIcon } from '@mui/icons-material';

import type { IProps } from './EditableText.types';

/**
 * Reusable, flexible text display which allows the user to edit the content via an edit button.
 * @category Components
 * @subcategory Editable Text
 * @component
 * @param props.containerSx Styling overrides to be applied to the outer container.
 * @param props.headingProps Props applied to the main text when not editing.
 * @param props.iconPosition Determines which end of the text to place the edit button. Note that edit buttons are absolutely positioned so will appear above overlapping content.
 * @param props.onChange Optional callback invoked on blur.
 * @param props.placeholder Optional placeholder text.
 * @param props.text The main text content.
 * @param props.verticalCenter If true, a vertical center alignment is used, otherwise flex-start is applied.
 */
const EditableText: FC<IProps> = ({
    containerSx,
    headingProps,
    iconPosition = 'end',
    onChange,
    placeholder,
    text,
    verticalCenter,
}) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    const handleBlur = useCallback(() => {
        setOpen(false);
        onChange(value);
    }, [onChange, value]);

    useEffect(() => {
        setValue(text);
    }, [text]);

    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
                alignItems: verticalCenter ? 'center' : 'flex-start',
                position: 'relative',
                '& .EditableText_open': {
                    transition: '.1s linear',
                    opacity: text.length ? 0 : 1,
                    color: theme.palette.common.white,
                    paddingLeft: 0,
                    paddingRight: 0,
                    minWidth: '40px',
                },
                '& .EditableText__title': {
                    display: 'flex',
                    alignItems: verticalCenter ? 'center' : 'flex-start',
                },
                '&:hover': {
                    '& .EditableText_open': {
                        opacity: 1,
                    },
                },
                ...containerSx,
            })}
        >
            <Button
                className='EditableText_open'
                onClick={() => setOpen(true)}
                sx={{
                    position: 'absolute',
                    left: iconPosition === 'end' ? '-100%' : '100%',
                }}
                title={t('commonButtons.clickToEdit')}
            >
                <EditIcon />
            </Button>
            {open ? (
                <TextField
                    autoFocus
                    onBlur={handleBlur}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
            ) : !text.length && placeholder ? (
                <Typography
                    className='EditableText__title'
                    sx={(theme) => ({
                        color: theme.palette.text.disabled,
                    })}
                    {...headingProps}
                >
                    {placeholder}
                </Typography>
            ) : (
                <Typography className='EditableText__title' {...headingProps}>
                    {text}
                </Typography>
            )}
        </Box>
    );
};

export default EditableText;
