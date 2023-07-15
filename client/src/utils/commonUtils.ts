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
