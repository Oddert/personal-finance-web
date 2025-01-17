import { ScheduleByScalarTime, ScheduleBySpecificDay } from '../utils/schedulerUtils';

/**
 * Provides a default fallback for the Scenario projection chart.
 * @deprecated review if still needed.
 * @category Constants
 * @subcategory Projection
 */
export const defaultScenario = {
    title: 'BAU',
    transactors: [
        {
            description: 'Rent',
            startDate: '20 october 2023',
            action: (value: number) => value - 700,
            annotation: '- 700',
            schedulers: [
                new ScheduleBySpecificDay(20),
            ],
        },
        {
            description: 'Salary',
            startDate: '20 october 2023',
            action: (value: number) => value + 1400,
            annotation: '+ 1400',
            schedulers: [
                new ScheduleByScalarTime(31, '20 october 2023')
            ],
        },
    ],
}
