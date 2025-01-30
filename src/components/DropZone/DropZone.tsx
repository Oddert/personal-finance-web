import { FC, useCallback } from 'react';
import { useDropzone, DropEvent, FileRejection } from 'react-dropzone';

import { Box, Typography } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

import { IProps } from './DropZone.types';

const DropZone: FC<IProps> = ({ onSuccess }) => {
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
                <Typography>Drop the files here...</Typography>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <UploadIcon />{' '}
                    <Typography>
                        Click to upload or drag and drop CSV files here
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default DropZone;
