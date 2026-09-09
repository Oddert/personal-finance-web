import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);

/**
 * Formats an integer value to a human-readable format with commas separating 100 decimal points.
 * @example
 * createReadableNumber(5) === '5'
 * createReadableNumber(5.12) === '5.12'
 * createReadableNumber(5034.12) === '5,034.12'
 * createReadableNumber(50812634.12) === '50,812,634.12'
 * createReadableNumber(50812634.1273) === '50,812,634.1,273'
 * createReadableNumber(508127890634.1273) === '508,127,890,634.1,273'
 * createReadableNumber(508127890634) === '508,127,890,634'
 * @returns {string|unknown}
 */
export const createReadableNumber = (
    value: unknown,
    fallbackValue?: number,
) => {
    if (typeof value !== 'number') {
        return fallbackValue;
    }
    // WARNING: vulnerable regex requires replacement
    // eslint-disable-next-line security/detect-unsafe-regex
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Converts a CSV file string to an array of JSON compatible objects.
 * @param file The response from the file reader.
 * @returns Array of each row from the CSV converted to objects.
 */
export const readCsv = (file: unknown) => {
    const returnValue: {
        values: Record<string, string>[];
        headers: string[];
        valueLength: number;
    } = {
        values: [],
        headers: [],
        valueLength: 0,
    };

    if (typeof file === 'string') {
        const components = file.split('\n');
        components.pop();
        if (components.length) {
            const headers = components[0].split(',');
            const data = components.slice(1);
            const converted = data.map((row) => {
                const rowSplit = row.split(',');
                const rowConverted = headers.reduce(
                    (acc: Record<string, string>, header, idx) => {
                        acc[header] = rowSplit[idx];
                        return acc;
                    },
                    {},
                );
                return rowConverted;
            });
            returnValue.headers = headers;
            returnValue.values = converted;
            returnValue.valueLength = converted.length;
            return returnValue;
        }
    }
};

/**
 * Escapes a string which may contain RegExp compatible special characters.
 *
 * Polyfill for RegExp.escape().
 * @param text Text to be sanitised/
 * @returns The sanitised literal string/
 */
export const escapeRegex = (text: string) => {
    return text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * Applies a range of possible date formats to the interpretation of a date.
 *
 * Will throw an error if no format works.
 * @param date The date string to parse.
 * @returns The date in ISO string format or null (will throw).
 */
export const looseDateParser = (date: string) => {
    const formats = [
        'DD/MM/YYYY',
        'DD/MM/YY',
        'DD-MM-YYYY',
        'DD-MM-YY',
        'DD/M/YYYY',
        'DD/M/YY',
        'DD-M-YYYY',
        'DD-M-YY',
        'DD/MMM/YYYY',
        'DD/MMM/YY',
        'DD-MMM-YYYY',
        'DD-MMM-YY',
        'DD/MMMM/YYYY',
        'DD/MMMM/YY',
        'DD-MMMM-YYYY',
        'DD-MMMM-YY',
        'D/MM/YYYY',
        'D/MM/YY',
        'D-MM-YYYY',
        'D-MM-YY',
        'D/M/YYYY',
        'D/M/YY',
        'D-M-YYYY',
        'D-M-YY',
        'D/MMM/YYYY',
        'D/MMM/YY',
        'D-MMM-YYYY',
        'D-MMM-YY',
        'D/MMMM/YYYY',
        'D/MMMM/YY',
        'D-MMMM-YYYY',
        'D-MMMM-YY',
        'YYYY/MM/DD',
        'YY/MM/DD',
        'YYYY-MM-DD',
        'YY-MM-DD',
        'YYYY/M/DD',
        'YY/M/DD',
        'YYYY-M-DD',
        'YY-M-DD',
        'YYYY/MMM/DD',
        'YY/MMM/DD',
        'YYYY-MMM-DD',
        'YY-MMM-DD',
        'YYYY/MMMM/DD',
        'YY/MMMM/DD',
        'YYYY-MMMM-DD',
        'YY-MMMM-DD',
        'YYYY/MM/D',
        'YY/MM/D',
        'YYYY-MM-D',
        'YY-MM-D',
        'YYYY/M/D',
        'YY/M/D',
        'YYYY-M-D',
        'YY-M-D',
        'YYYY/MMM/D',
        'YY/MMM/D',
        'YYYY-MMM-D',
        'YY-MMM-D',
        'YYYY/MMMM/D',
        'YY/MMMM/D',
        'YYYY-MMMM-D',
        'YY-MMMM-D',
    ];
    const parseAttempt = formats
        .map((format) => dayjs.utc(date, format, true))
        .find((attempt) => attempt.isValid());
    if (parseAttempt) {
        return parseAttempt.toISOString();
    }
    console.warn('Unable to interpret date:', date);
    throw new Error(`Invalid date: ${date}`);
};
