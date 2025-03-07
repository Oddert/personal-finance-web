import { FC } from 'react';

import { Button, CircularProgress } from '@mui/material';
import { CheckCircleOutline as SuccessIcon } from '@mui/icons-material';

import { IProps } from './SubmitButton.types';

const SubmitButton: FC<IProps> = ({
    onSubmit,
    loading,
    submitDisabled,
    success,
    text,
}) => {
    return (
        <Button
            color='primary'
            disabled={submitDisabled}
            onClick={onSubmit}
            sx={{
                mt: '16px',
                minWidth: '350px',
            }}
            variant='contained'
        >
            {text}
            {loading ? <CircularProgress size={20} sx={{ ml: '8px' }} /> : null}
            {success ? (
                <SuccessIcon color='success' sx={{ ml: '8px' }} />
            ) : null}
        </Button>
    );
};

export default SubmitButton;
