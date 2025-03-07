import { FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Divider, Typography } from '@mui/material';

import { IProps } from './SwitchMode.types';

/**
 * Displays the bottom section of the Login / Sign Up modal with buttons to switch to the other mode.
 * @component
 * @category Pages
 * @subcategory Login
 */
const SwitchMode: FC<IProps> = ({ isExisting, setIsExistingUser }) => {
    const { t } = useTranslation();

    const state = useMemo(
        () =>
            isExisting
                ? {
                      question: t('auth.signUpCTA'),
                      buttonText: t('auth.signUp'),
                  }
                : {
                      question: t('auth.signInCTA'),
                      buttonText: t('auth.Login'),
                  },
        [isExisting, t],
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
