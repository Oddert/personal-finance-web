import {
    calculateAggDataTotals,
    convertAggDataResponse,
} from './MonthAverages.utils';

describe('convertAggDataResponse', () => {
    it('preserves the same category datapoints across cards in one series', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const categories = {
            catA: { id: 'catA', label: 'Groceries', colour: '#ff0000' },
            catB: { id: 'catB', label: 'Bills', colour: '#00ff00' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        const aggData = [
            {
                cardId: 'card-1',
                transactions: {
                    catA: {
                        data: [
                            {
                                categoryId: 'catA',
                                month: new Date('2024-01-01'),
                                totalCredit: 0,
                                totalDebit: 120,
                                categoryName: 'Groceries',
                            },
                            {
                                categoryId: 'catA',
                                month: new Date('2024-02-01'),
                                totalCredit: 0,
                                totalDebit: 180,
                                categoryName: 'Groceries',
                            },
                        ],
                        totalCredit: 0,
                        totalDebit: 300,
                    },
                    catB: {
                        data: [
                            {
                                categoryId: 'catB',
                                month: new Date('2024-01-01'),
                                totalCredit: 0,
                                totalDebit: 50,
                                categoryName: 'Bills',
                            },
                        ],
                        totalCredit: 0,
                        totalDebit: 50,
                    },
                },
            },
            {
                cardId: 'card-2',
                transactions: {
                    catA: {
                        data: [
                            {
                                categoryId: 'catA',
                                month: new Date('2024-01-01'),
                                totalCredit: 0,
                                totalDebit: 60,
                                categoryName: 'Groceries',
                            },
                            {
                                categoryId: 'catA',
                                month: new Date('2024-02-01'),
                                totalCredit: 0,
                                totalDebit: 240,
                                categoryName: 'Groceries',
                            },
                        ],
                        totalCredit: 0,
                        totalDebit: 300,
                    },
                },
            },
        ];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        const adaptedData = convertAggDataResponse(aggData as any, categories);
        const result = calculateAggDataTotals(adaptedData);

        expect(result).toHaveLength(2);
        expect(result.find((item) => item.categoryId === 'catA')).toMatchObject(
            {
                categoryName: 'Groceries',
                categoryId: 'catA',
                average: 150,
                standardDeviation: 67.1,
                totalCumulative: 600,
            },
        );
        expect(
            result.find((item) => item.categoryId === 'catA')?.data,
        ).toHaveLength(4);
        expect(result.find((item) => item.categoryId === 'catB')).toMatchObject(
            {
                categoryName: 'Bills',
                categoryId: 'catB',
                average: 50,
                standardDeviation: 0,
                totalCumulative: 50,
            },
        );
    });

    it('recalculates derived totals using enabled datapoints only', () => {
        const adaptedData = [
            {
                categoryId: 'catA',
                categoryColour: '#ff0000',
                categoryName: 'Groceries',
                data: [
                    {
                        categoryId: 'catA',
                        categoryName: 'Groceries',
                        month: new Date('2024-01-01'),
                        totalCredit: 0,
                        totalDebit: 120,
                        cardName: 'Checking',
                        enabled: true,
                        period: '2024-0',
                    },
                    {
                        categoryId: 'catA',
                        categoryName: 'Groceries',
                        month: new Date('2024-02-01'),
                        totalCredit: 0,
                        totalDebit: 180,
                        cardName: 'Checking',
                        enabled: false,
                        period: '2024-1',
                    },
                ],
                totalCredit: 0,
                totalDebit: 0,
                totalCumulative: 0,
                average: 0,
                standardDeviation: 0,
            },
        ];

        const result = calculateAggDataTotals(adaptedData);

        expect(calculateAggDataTotals(result)[0]).toMatchObject({
            totalDebit: 120,
            totalCumulative: 120,
            average: 120,
            standardDeviation: 0,
        });
    });
});
