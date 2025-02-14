import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone, DropEvent, FileRejection } from 'react-dropzone';

import { Box, Typography } from '@mui/material';
import { Upload as IconUpload } from '@mui/icons-material';

import { IProps } from './DropZone.types';

const DropZone: FC<IProps> = ({ onSuccess }) => {
    const { t } = useTranslation();

    const onDrop = useCallback(
        (
            acceptedFiles: File[],
            fileRejections: FileRejection[],
            event: DropEvent,
        ) => {
            console.log(acceptedFiles, fileRejections, event);
            onSuccess(acceptedFiles);
        },
        [],
    );

    const { getInputProps, getRootProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <Box
            {...getRootProps()}
            sx={(theme) => ({
                minHeight: '100px',
                minWidth: '200px',
                border: `1px solid ${theme.palette.action.selected}`,
                borderRadius: '4px',
                '&:hover': {
                    borderColor: theme.palette.common.white,
                },
                '&:active': {
                    borderWidth: '2px',
                    borderColor: theme.palette.primary.main,
                },
            })}
        >
            <input {...getInputProps()} />{' '}
            {isDragActive ? (
                <Typography>{t('dragDrop.onDrag')}</Typography>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <IconUpload />{' '}
                    <Typography>{t('dragDrop.idleMessage')}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default DropZone;
