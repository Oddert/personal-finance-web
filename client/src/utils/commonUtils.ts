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
export const createReadableNumber = (value: unknown, fallbackValue?: number) => {
   if (typeof value !== 'number') {
       return fallbackValue;
   }
   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Converts a CSV file string to an array of JSON compatible objects.
 * @param file The response from the file reader.
 * @returns Array of each row from the CSV converted to objects.
 */
export const readCsv = (file: unknown) => {
    const returnValue: {
        values: { [key: string]: string }[],
        headers: string[],
        valueLength: number,
    } = {
        values: [],
        headers: [],
        valueLength: 0,
    }

    if (typeof file === 'string') {
        const components = file.split('\n')
        components.pop()
        if (components.length) {
            const headers = components[0].split(',')
            const data = components.slice(1)
            const converted = data.map(row => {
                const rowSplit = row.split(',')
                const rowConverted = headers.reduce(
                    (acc: { [key: string]: string }, header, idx) => {
                        acc[header] = rowSplit[idx]
                        return acc
                    },
                    {},
                )
                return rowConverted
            })
            returnValue.headers = headers
            returnValue.values = converted
            returnValue.valueLength = converted.length
            return returnValue
        }
    }
}

/**
 * Escapes a string which may contain RegExp compatible special characters.
 *
 * Polyfill for RegExp.escape().
 * @param text Text to be sanitised/
 * @returns The sanitised literal string/
 */
export const escapeRegex = (text: string) => {
    return text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
