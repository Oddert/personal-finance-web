import { FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
} from '@mui/material';
import { Edit as IconEdit } from '@mui/icons-material';

import { IProps } from './EditImageIcon.types';

const EditImageIcon: FC<IProps> = ({ label, onConfirmChange, size, url }) => {
    const { t } = useTranslation();

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
                        title={t('Card.editBackgroundImageTitle')}
                        variant='outlined'
                    >
                        <IconEdit className='edit_icon' />
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
                <DialogTitle>{t('Card.enterUrlOfNewImage')}</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={(e) => setUpdatedUrl(e.target.value)}
                        sx={{ minWidth: '30vw' }}
                        value={updatedUrl}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCancel}>
                        {t('buttons.Cancel')}
                    </Button>
                    <Button onClick={handleClickSubmit} variant='contained'>
                        {t('buttons.Submit')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default EditImageIcon;
