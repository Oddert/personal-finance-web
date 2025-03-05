import { FC, Fragment, useMemo } from 'react';
import { Button, Divider, Typography } from '@mui/material';

interface IProps {
    /**
     * True if the user is on the "Login" page, false for "Sign Up".
     */
    isExisting: boolean;
    /**
     * @param isExistingUser True if the user is on the login page, false for sign up.
     */
    setIsExistingUser: (isExistingUser: boolean) => void;
}

/**
 * Displays the bottom section of the Login / Sign Up modal with buttons to switch to the other mode.
 */
const SwitchMode: FC<IProps> = ({ isExisting, setIsExistingUser }) => {
    const state = useMemo(
        () =>
            isExisting
                ? {
                      question: 'Need an account?',
                      buttonText: 'Sign Up',
                  }
                : {
                      question: 'Already a user?',
                      buttonText: 'Login',
                  },
        [isExisting],
    );

    return (
        <Fragment>
            <Divider sx={{ height: '2px', width: '100%', mt: 3 }} />
            <Typography sx={{ mt: 3 }}>
                {state.question}{' '}
                <Button
                    onClick={() => setIsExistingUser(!isExisting)}
                    variant='text'
                >
                    {state.buttonText}
                </Button>
            </Typography>
        </Fragment>
    );
};

export default SwitchMode;
