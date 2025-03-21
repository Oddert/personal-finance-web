import { styled, TextField as MuiTextField } from '@mui/material';

export const TextField = styled(MuiTextField)(() => ({
    marginTop: '16px',
    minWidth: '350px',
}));

export const Form = styled('form')(({}) => ({
    display: 'flex',
    flexDirection: 'column',
}));
