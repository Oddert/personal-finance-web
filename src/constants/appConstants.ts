/**
 * User's locale setting for localisation functions.
 * @constant
 * @deprecated
 * @category Constants
 * @subcategory App Constants
 */
export const LOCALE = 'en-GB';

/**
 * The predominant currency unit for the user.
 * @constant
 * @deprecated
 * @category Constants
 * @subcategory App Constants
 */
export const CURRENCY_SYMBOL = '£';

/**
 * The predominant currency unit for the user.
 * @constant
 * @deprecated
 * @category Constants
 * @subcategory App Constants
 */
export const CURRENCY_SYMBOL_UNICODE = '&#163;';

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

/**
 * Accessor key for local storage space where the authentication access token is stored.
 * @constant
 * @category Constants
 * @subcategory App Constants
 */
export const PERSONAL_FINANCE_ACCESS_TOKEN = 'PERSONAL_FINANCE_ACCESS_TOKEN';

/**
 * Title used in the header and anywhere the application references itself.
 * @deprecated
 * @constant
 * @category Constants
 * @subcategory App Constants
 */
export const MAIN_TITLE = 'Personal Finance';

/**
 * Width of the main drawer panel when in open state.
 * @constant
 * @category Constants
 * @subcategory App Constants
 */
export const headerDrawerOpenWidth = 280;
