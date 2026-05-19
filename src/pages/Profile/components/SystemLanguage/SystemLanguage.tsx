import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Autocomplete, TextField } from '@mui/material';

import locale from 'locale-codes';

import type { IProps } from './SystemLanguage.styles';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import { getActiveLanguage } from '../../../../redux/selectors/profileSelectors';
import { updateActiveLanguage } from '../../../../redux/thunks/profileThunks';

/**
 * Allows the user to select their main (system) language.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const SystemLanguage: FC<IProps> = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const language = useAppSelector(getActiveLanguage);
    return (
        <Autocomplete
            getOptionLabel={(option) => `${option.name} (${option.tag})`}
            getOptionKey={(option) => option.tag}
            onChange={(_, nextValue) => {
                if (nextValue) {
                    dispatch(
                        updateActiveLanguage({
                            displayName: nextValue.name,
                            code: nextValue.tag,
                        }),
                    );
                }
            }}
            options={locale.all}
            renderInput={(props) => (
                <TextField {...props} label={t('Language')} />
            )}
            value={{
                name: language.displayName,
                tag: language.code,
                lcid: 0,
            }}
        />
    );
};

export default SystemLanguage;
