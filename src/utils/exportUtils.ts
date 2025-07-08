import { Dayjs } from 'dayjs';

/**
 * Provides a standardised file format name for exported transaction data.
 * @param startDate The file range start date
 * @param endDate The file range end date
 * @returns The file name.
 */
export const createStandardTransactionDlName = (
    startDate: Dayjs,
    endDate: Dayjs,
) => {
    return `pf-transaction-data-${startDate.toISOString()}-to-${endDate.toISOString()}`;
};

/**
 * Downloads data as a CSV file for the user.
 * @param fileData The CSV data as a string.
 * @param fileName The filename. Defaults to "download".
 */
export const downloadCsv = (fileData: string, fileName?: string) => {
    const blob = new Blob([fileData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement('a');
    aTag.href = `${url}.csv`;
    aTag.download = fileName?.length ? fileName : url;
    aTag.click();
    aTag.remove();
};

/**
 * Downloads data as a CSV file for the user with no file suffix (".csv").
 *
 * This enables download of data even if browser security tries to protect the user, believing the action to be suspicious.
 * @param fileData The CSV data as a string.
 * @param fileName The filename. Defaults to "download".
 */
export const downloadCsvNoSuffix = (fileData: string, fileName?: string) => {
    const blob = new Blob([fileData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement('a');
    aTag.href = url;
    aTag.download = fileName?.length ? fileName : url;
    aTag.click();
    aTag.remove();
};

/**
 * Downloads data as a JSON file for the user.
 * @param fileData The CSV data as a string.
 * @param fileName The filename. Defaults to "download".
 */
export const downloadJson = (fileData: object | any[], fileName?: string) => {
    const blob = new Blob([JSON.stringify(fileData)], { type: 'text/json' });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement('a');
    aTag.href = `${url}.json`;
    aTag.download = fileName?.length ? fileName : url;
    aTag.click();
    aTag.remove();
};
