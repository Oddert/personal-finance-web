/**
 * Gets a mean number for a list of numbers.
 * @param nums List of numbers to find the mean of.
 * @returns The mean.
 */
export const meanValue = (nums: number[]) => {
    const n = nums.length;
    return nums.reduce((a, e) => a + e, 0) / n;
};

/**
 * Creates a standard deviation value for a given set of values.
 * @param nums List of numbers to find the standard deviation of.
 * @param subSample If `false`, the number list represents the entire sample size. If unsure leave as `true`.
 * @returns
 */
export const standardDeviation = (
    nums: number[],
    subSample: boolean = true,
) => {
    const n = nums.length;
    const m = meanValue(nums);
    const numerator = nums.reduce((a, e) => a + Math.pow(e - m, 2), 0);
    return Math.sqrt(numerator / (subSample ? n - 1 : n));
};

/**
 * Flattens a number to 2 decimal points.
 *
 * Uses the `toFixed` utility so be careful of precision issues.
 * @param value The raw number value.
 * @returns The number to 2 decimal points.
 */
export const normaliseNum = (value: number) => Number(value.toFixed(2));
