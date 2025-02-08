import { useMemo } from 'react';

import { getActiveLanguageCode } from '../redux/selectors/profileSelectors';

import { useAppSelector } from './ReduxHookWrappers';

/**
 * @category Hooks
 * @subcategory Localised Number
 * @returns A formatting function to localise numbers, and a formatter for currency values.
 */
const useLocalisedNumber = () => {
    const language = useAppSelector(getActiveLanguageCode);

    const { currencyLocaliser, numberLocaliser } = useMemo(() => {
        /**
         * Localises a currency value, taking into account the user's language settings as well as the specified currency.
         * @param value The number value to format.
         * @param currency Intl currency code to format to.
         * @returns The localised number as a string.
         */
        const currencyLocaliserFunc = (
            value: number | bigint | typeof Infinity,
            currency: string = 'GBP',
        ) => {
            try {
                return Intl.NumberFormat(language, {
                    currency,
                    style: 'currency',
                }).format(value);
            } catch (error) {
                console.error(error);
                return String(value);
            }
        };

        /**
         * Localises a number value to  the user's language setting.
         *
         * For currency values, it is advised to use {@link currencyLocaliserFunc} as currency formatting must take into account language variances.
         * @param value The number value to format.
         * @returns The localised number as a string.
         */
        const numberLocaliserFunc = (
            value: number | bigint | typeof Infinity,
        ) => {
            try {
                return Intl.NumberFormat(language).format(value);
            } catch (error) {
                console.error(error);
                return String(value);
            }
        };

        return {
            currencyLocaliser: currencyLocaliserFunc,
            numberLocaliser: numberLocaliserFunc,
        };
    }, [language]);

    return { currencyLocaliser, numberLocaliser };
};

export default useLocalisedNumber;
