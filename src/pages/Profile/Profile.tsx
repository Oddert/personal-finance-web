import { FC } from 'react';
import locale from 'locale-codes';

import { Autocomplete, Box, TextField, Typography } from '@mui/material';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import {
    getActiveLanguage,
    getUserCurrencies,
} from '../../redux/selectors/profileSelectors';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';
import useLocalisedNumber from '../../hooks/useLocalisedNumber';

import { setActiveLanguage } from '../../redux/slices/profileSlice';

import CurrencySelector from './components/CurrencySelector';
import LanguageSelector from './components/LanguageSelector';

import { IProps } from './Profile.types';

/**
 * A user profile and settings page.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const Profile: FC<IProps> = () => {
    const dispatch = useAppDispatch();

    const language = useAppSelector(getActiveLanguage);
    const usersCurrencies = useAppSelector(getUserCurrencies);

    const { currencyLocaliser, numberLocaliser } = useLocalisedNumber();

    return (
        <ResponsiveContainer>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                    padding: '0 0 64px 0',
                }}
            >
                <Typography variant='h2' sx={{ margin: '32px 0' }}>
                    Profile and settings
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                    <Box>
                        <Typography>
                            Example currency display (using {usersCurrencies[0]}
                            ): &ldquo;
                            <Typography
                                component='span'
                                sx={{ fontWeight: 'bold' }}
                            >
                                {currencyLocaliser(27.93, usersCurrencies[0])}
                            </Typography>
                            &rdquo;
                        </Typography>
                        <Typography>
                            Example number formatting: &ldquo;
                            <Typography
                                component='span'
                                sx={{ fontWeight: 'bold' }}
                            >
                                {numberLocaliser(19482.25)}
                            </Typography>
                            &rdquo;
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gridGap: '16px',
                            padding: '0 0 64px 0',
                        }}
                    >
                        <Autocomplete
                            getOptionLabel={(option) =>
                                `${option.name} (${option.tag})`
                            }
                            getOptionKey={(option) => option.tag}
                            onChange={(event, nextValue) => {
                                if (nextValue) {
                                    dispatch(
                                        setActiveLanguage({
                                            language: {
                                                displayName: nextValue.name,
                                                code: nextValue.tag,
                                            },
                                        }),
                                    );
                                }
                            }}
                            options={locale.all}
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    label='Language selected'
                                />
                            )}
                            value={{
                                name: language.displayName,
                                tag: language.code,
                                lcid: 0,
                            }}
                        />
                        <LanguageSelector />
                        <CurrencySelector />
                    </Box>
                </Box>
            </Box>
        </ResponsiveContainer>
    );
};

export default Profile;
