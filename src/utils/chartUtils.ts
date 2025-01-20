/**
 * Formats numbers to add commas for large numbers.
 * @category Utils
 * @subcategory Chart Utils
 * @example
 * largeValueFormatter(4) === '4'
 * largeValueFormatter(25.78) === '25.78'
 * largeValueFormatter(4639) === '4,639'
 * largeValueFormatter(82547925.2324) === '82,547,925.232,4'
 * largeValueFormatter(.2324) === '0.232,4'
 * @param number The number to be converted.
 * @returns The formatted number as string
 */
export const largeValueFormatter = (number: number) => {
    if (number === null || isNaN(number)) {
        return String(number);
    }
    const str = number.toString().split('.');
    const converted = [];
    if (str[0].length >= 4) {
        converted.push(str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,'));
    }
    if (str[1] && str[1].length >= 4) {
        converted.push(str[1].replace(/(\d{3})/g, '$1,'));
    }
    return converted.join('.');
};
