import { FC, Fragment, useEffect, useState } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { IProps } from './EditImageIcon.types';

const EditImageIcon: FC<IProps> = ({ label, onConfirmChange, size, url }) => {
    const [open, setOpen] = useState(false);
    const [updatedUrl, setUpdatedUrl] = useState<string | null>(null);

    const handleClickCancel = () => {
        setOpen(false);
        setUpdatedUrl(url);
    };

    const handleClickSubmit = () => {
        onConfirmChange(updatedUrl);
        setOpen(false);
    };

    useEffect(() => {
        setUpdatedUrl(url);
    }, [url]);

    return (
        <Fragment>
            <FormControlLabel
                control={
                    <Button
                        onClick={() => setOpen(true)}
                        sx={{
                            aspectRatio: size === 'sm' ? '1/1' : '4/1',
                            height: '50px',
                            ...(url
                                ? {
                                      backgroundImage: `url("${url}")`,
                                      backgroundSize: 'cover',
                                  }
                                : {}),
                            '& .edit_icon': {
                                opacity: url ? 0 : 1,
                                transition: '.1s linear',
                            },
                            '&:hover': {
                                '& .edit_icon': { opacity: 1 },
                            },
                        }}
                        title='edit background image'
                        variant='outlined'
                    >
                        <EditIcon className='edit_icon' />
                    </Button>
                }
                label={label}
                labelPlacement='top'
                sx={{
                    '& .MuiFormControlLabel-label': {
                        alignSelf: 'flex-start',
                        mb: '8px',
                    },
                }}
            />
            <Dialog onClose={handleClickCancel} open={open}>
                <DialogTitle>Enter URL of new image:</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={(e) => setUpdatedUrl(e.target.value)}
                        sx={{ minWidth: '30vw' }}
                        value={updatedUrl}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCancel}>Cancel</Button>
                    <Button onClick={handleClickSubmit} variant='contained'>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default EditImageIcon;
