import { FC, useMemo } from 'react';
import locale from 'locale-codes';

import { Autocomplete, Box, TextField, Typography } from '@mui/material';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import {
    getActiveLanguage,
    getUserCurrencies,
    getUserLanguages,
} from '../../redux/selectors/profileSelectors';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';
import useLocalisedNumber from '../../hooks/useLocalisedNumber';

import { IProps } from './Profile.types';
import {
    setActiveLanguage,
    updateCurrencies,
    updateLanguages,
} from '../../redux/slices/profileSlice';

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
    const usersLanguages = useAppSelector(getUserLanguages);

    const { currencyLocaliser } = useLocalisedNumber();

    const currencies = useMemo(
        () =>
            // @ts-ignore
            Intl.supportedValuesOf('currency').map((currencyCode) => [
                currencyCode,
                currencyLocaliser(3.14, currencyCode),
            ]),
        [currencyLocaliser],
    );

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
                        <TextField {...props} label='Language selected' />
                    )}
                    value={{
                        name: language.displayName,
                        tag: language.code,
                        lcid: 0,
                    }}
                />
                <Autocomplete
                    getOptionLabel={(option) =>
                        `${option.name} (${option.tag})`
                    }
                    getOptionKey={(option) => option.tag}
                    multiple
                    onChange={(event, nextValue) => {
                        if (nextValue) {
                            dispatch(
                                updateLanguages({
                                    languages: nextValue.map((lang) => ({
                                        displayName: lang.name,
                                        code: lang.tag,
                                    })),
                                }),
                            );
                        }
                    }}
                    options={locale.all}
                    renderInput={(props) => (
                        <TextField {...props} label='Favourite languages' />
                    )}
                    value={usersLanguages.map((lang) => ({
                        name: lang.displayName,
                        tag: lang.code,
                        lcid: 0,
                    }))}
                />
                <Autocomplete
                    getOptionLabel={(option) =>
                        `${option[0]} (example: ${option[1]})`
                    }
                    getOptionKey={(option) => option[0]}
                    multiple
                    onChange={(event, nextValue) => {
                        if (nextValue) {
                            dispatch(
                                updateCurrencies({
                                    currencies: nextValue.map(
                                        (curr) => curr[1],
                                    ),
                                }),
                            );
                        }
                    }}
                    options={currencies}
                    renderInput={(props) => (
                        <TextField {...props} label='Favourite currencies' />
                    )}
                    value={usersCurrencies.map((userCurrency) => [
                        userCurrency,
                        currencyLocaliser(3.14, userCurrency),
                    ])}
                />
            </Box>
        </ResponsiveContainer>
    );
};

export default Profile;
