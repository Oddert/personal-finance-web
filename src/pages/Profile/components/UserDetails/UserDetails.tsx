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

import {
    getUserFirstName,
    getUserLastName,
} from '../../../../redux/selectors/authSelectors';
import { updateUserDetails } from '../../../../redux/thunks/authThunks';

const UserDetails: FC = () => {
    const dispatch = useAppDispatch();

    const [editing, setEditing] = useState(false);
    const [internalFirstName, setInternalFirstName] = useState('');
    const [internalLastName, setInternalLastName] = useState('');

    const firstName = useAppSelector(getUserFirstName);
    const lastName = useAppSelector(getUserLastName);

    const reset = () => {
        setInternalFirstName(firstName || '');
        setInternalLastName(lastName || '');
        setEditing(false);
    };

    const handleSubmit = () => {
        dispatch(
            updateUserDetails({
                firstName: internalFirstName,
                lastName: internalLastName,
            }),
        );
        setEditing(false);
    };

    useEffect(() => setInternalFirstName(firstName || ''), [firstName]);
    useEffect(() => setInternalLastName(lastName || ''), [lastName]);

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
                <Paper sx={{ display: 'flex', gridGap: 16, px: 4, py: 4 }}>
                    <FormControlLabel
                        control={
                            <TextField
                                fullWidth
                                placeholder='First name'
                                onChange={(event) =>
                                    setInternalFirstName(event.target.value)
                                }
                                value={internalFirstName}
                            />
                        }
                        label='First name'
                        labelPlacement='top'
                        slotProps={{
                            typography: {
                                sx: { alignSelf: 'flex-start', mb: 1 },
                            },
                        }}
                        sx={{ width: '100%', m: 0 }}
                    />
                    <FormControlLabel
                        control={
                            <TextField
                                fullWidth
                                placeholder='Last name'
                                onChange={(event) =>
                                    setInternalLastName(event.target.value)
                                }
                                value={internalLastName}
                            />
                        }
                        label='Last name'
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
                    Name
                </Typography>
                <Box sx={{ display: 'flex', gridGap: 16 }}>
                    <Typography component='p' variant='h4'>
                        {firstName} {lastName}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserDetails;
