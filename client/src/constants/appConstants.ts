/**
 * User's locale setting for localisation functions.
 * @constant
 * @category Constants
 * @subcategory App Constants
 */
export const LOCALE = 'en-GB';

/**
 * The predominant currency unit for the user.
 * @constant
 * @category Constants
 * @subcategory App Constants
 */
export const CURRENCY_SYMBOL = '£';

/**
 * Accessor key for local storage space where the Transaction-to-CSV mapping is stored.
 *
 * This object informs {@link Upload} how to map the user's CSV format to the application's columns.
 *
 * It is assumed an individual user's CSV format is not likely to change often.
 * @constant
 * @category Constants
 * @subcategory App Constants
 */
export const PERSONAL_FINANCE_CSV_MAPPING = 'PERSONAL_FINANCE_CSV_MAPPING';
