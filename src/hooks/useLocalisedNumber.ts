import { useMemo } from 'react';

/**
 * @category Hooks
 * @subcategory Localised Number
 * @returns A formatting function to localise numbers, and a formatter for currency values.
 */
const useLocalisedNumber = () => {
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
            // TODO: Swap with currency preferences once ready.
            return Intl.NumberFormat('en-GB', {
                currency,
                style: 'currency',
            }).format(value);
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
            // TODO: Swap with currency preferences once ready.
            return Intl.NumberFormat('en-GB').format(value);
        };

        return {
            currencyLocaliser: currencyLocaliserFunc,
            numberLocaliser: numberLocaliserFunc,
        };
    }, []);
    return { currencyLocaliser, numberLocaliser };
};

export default useLocalisedNumber;
