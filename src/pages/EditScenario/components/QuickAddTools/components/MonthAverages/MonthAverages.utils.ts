import type {
    IAggregateDatapointExtended,
    IAggregateDatapointRecordExtended,
} from './MonthAverages.types';
import type { ICard } from '../../../../../../types/Card.types';
import type { ICategory } from '../../../../../../types/Category';
import type { TAggregateDataResponse } from '../../../../../../types/Transaction';

export const convertAggDataResponse = (
    aggData: TAggregateDataResponse,
    categories: Record<string, ICategory>,
    cards: ICard[] = [],
): IAggregateDatapointRecordExtended[] => {
    const aggregatedByCategory = new Map<
        string,
        {
            categoryId: string;
            categoryName: string;
            categoryColour: string;
            data: IAggregateDatapointRecordExtended['data'];
        }
    >();

    aggData.forEach((card) => {
        Object.entries(card.transactions).forEach(
            ([categoryId, categoryRecord]) => {
                const existing = aggregatedByCategory.get(categoryId) ?? {
                    categoryId,
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    categoryName: categories[categoryId]?.label ?? '',
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    categoryColour: categories[categoryId]?.colour ?? '#ecf0f1',
                    data: [],
                };

                const foundCard = cards.find((c) => c.id === card.cardId);

                existing.data.push(
                    ...categoryRecord.data.map((datapoint) => {
                        const date = new Date(datapoint.month);
                        const dp: IAggregateDatapointExtended = {
                            ...datapoint,
                            cardName: foundCard?.cardName ?? card.cardId,
                            categoryId,
                            categoryName: existing.categoryName,
                            enabled: true,
                            period: `${String(date.getFullYear())}-${String(date.getMonth())}`,
                        };
                        return dp;
                    }),
                );

                aggregatedByCategory.set(categoryId, existing);
            },
        );
    });

    return Array.from(aggregatedByCategory.values()).map((entry) => ({
        categoryId: entry.categoryId,
        categoryColour: entry.categoryColour,
        categoryName: entry.categoryName,
        data: [...entry.data].sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
        ),
        totalCredit: 0,
        totalDebit: 0,
        totalCumulative: 0,
        average: 0,
        standardDeviation: 0,
    }));
};

export const calculateAggDataTotals = (
    dataRecords: IAggregateDatapointRecordExtended[],
): IAggregateDatapointRecordExtended[] =>
    dataRecords.map((entry) => {
        const enabledData = entry.data.filter((datapoint) => datapoint.enabled);
        const values = enabledData.map((d) => d.totalDebit || d.totalCredit);

        const totalCredit = enabledData.reduce(
            (total, datapoint) => total + datapoint.totalCredit,
            0,
        );

        const totalDebit = enabledData.reduce(
            (total, datapoint) => total + datapoint.totalDebit,
            0,
        );

        const mean = Number(
            (values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0
            ).toFixed(2),
        );

        const standardDeviation = Number(
            (values.length > 0
                ? Math.sqrt(
                      values.reduce(
                          (sum, val) => sum + Math.pow(val - mean, 2),
                          0,
                      ) / values.length,
                  )
                : 0
            ).toFixed(1),
        );

        return {
            categoryId: entry.categoryId,
            categoryColour: entry.categoryColour,
            categoryName: entry.categoryName,
            data: entry.data,
            totalCredit,
            totalDebit,
            totalCumulative: totalDebit + totalCredit,
            average: mean,
            standardDeviation,
        } satisfies IAggregateDatapointRecordExtended;
    });
