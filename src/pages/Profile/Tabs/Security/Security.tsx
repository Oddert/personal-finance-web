import { FC, useEffect, useState } from 'react';

import {
    Box,
    Button,
    FormControlLabel,
    Paper,
    TextField,
    Typography,
} from '@mui/material';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { updateUserDetails } from '../../../../redux/thunks/authThunks';
import { getUserEmail } from '../../../../redux/selectors/authSelectors';

const Security: FC = () => {
    const dispatch = useAppDispatch();

    const [editing, setEditing] = useState(false);
    // const [internalFirstName, setInternalFirstName] = useState('');
    // const [internalLastName, setInternalLastName] = useState('');
    const [internalEmail, setInternalEmail] = useState('');

    // const firstName = useAppSelector(getUserFirstName);
    // const lastName = useAppSelector(getUserLastName);
    const email = useAppSelector(getUserEmail);

    const reset = () => {
        setInternalEmail(email || '');
        setEditing(false);
    };

    const handleSubmit = () => {
        dispatch(updateUserDetails({ email }));
        setEditing(false);
    };

    useEffect(() => setInternalEmail(email || ''), [email]);

    if (editing) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                    padding: '0 0 64px 0',
                    mb: 2,
                    width: '100%',
                }}
            >
                <Typography>Security</Typography>
                <Paper sx={{ px: 4, py: 4 }}>
                    <FormControlLabel
                        control={
                            <TextField
                                fullWidth
                                placeholder='sample@example.com'
                                onChange={(event) =>
                                    setInternalEmail(event.target.value)
                                }
                                value={internalEmail}
                            />
                        }
                        label='Email'
                        labelPlacement='top'
                        slotProps={{
                            typography: {
                                sx: { alignSelf: 'flex-start', mb: 1 },
                            },
                        }}
                        sx={{ width: '100%', m: 0 }}
                    />
                </Paper>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gridGap: 24,
                        mt: 4,
                    }}
                >
                    <Button onClick={reset} size='large' variant='text'>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        size='large'
                        variant='contained'
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gridGap: '16px',
                padding: '0 0 64px 0',
                width: '100%',
                mb: 2,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setEditing(true)}>Edit</Button>
            </Box>
            <Paper
                sx={{
                    px: 4,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography component='h4' textAlign='left' variant='body1'>
                    Email
                </Typography>
                <Typography component='p' textAlign='left' variant='h4'>
                    {email}
                </Typography>
            </Paper>
        </Box>
    );
};

export default Security;
