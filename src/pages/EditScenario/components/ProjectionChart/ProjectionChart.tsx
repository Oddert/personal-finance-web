import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormControlLabel, Paper, Switch, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts';

import type { IProps } from './ProjectionChart.types';
import type { TAggregateDatapoints } from '../../../../types/Transaction.d';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import { getActiveCardId } from '../../../../redux/selectors/cardSelectors';
import { intakeError } from '../../../../redux/thunks/errorThunks';
import APIService from '../../../../services/APIService';

const ProjectionChart: FC<IProps> = ({ previewMode }) => {
    const [pastData, setPastData] = useState<TAggregateDatapoints>({});
    const [pastDataLoading, setPastDataLoading] = useState(false);
    const [showNegatives, setShowNegatives] = useState(true);

    const cardId = useAppSelector(getActiveCardId);

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const theme = useTheme();

    useEffect(() => {
        if (!cardId?.length) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPastDataLoading(true);

        const fetchPastData = async () => {
            try {
                const pastDataResponse =
                    await APIService.getAllTransactionsAggregated(cardId);
                if (!pastDataResponse.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setPastData(pastDataResponse.payload.transactions);
            } catch (error) {
                dispatch(intakeError(error));
            } finally {
                setPastDataLoading(false);
            }
        };

        fetchPastData();
    }, [dispatch, t, cardId]);

    const { dataset, series } = useMemo(() => {
        // With data pivoted on month the response format in pseudo code is: {[monthKey]: categoryData[]}
        // Here we transform this into an array where each entry represents one month, with category IDs mapped to values.
        // MUI X charts will use a series definition to resolve a label to these values.
        // The accumulator uses top-level keys is for convenient lookup until the eventual Object.values() calls.
        interface TLocalAcc {
            // Record<monthKey, Record<categoryId, value>>
            _dataset: Record<string, Record<string, string | number>>;
            // Record<categoryId, seriesItem[]>
            _series: Record<string, { label: string; dataKey: string }>;
        }

        const { _dataset, _series } = Object.entries(pastData).reduce(
            (monthAcc: TLocalAcc, [monthKey, categoryList]) => {
                monthAcc._dataset[monthKey] = categoryList.reduce(
                    (catAcc: Record<string, string | number>, category) => {
                        const value = showNegatives
                            ? category.totalDebit - category.totalCredit
                            : category.totalDebit;
                        if (!isNaN(value)) {
                            catAcc[category.categoryId] = value;
                        }
                        if (!(category.categoryId in monthAcc._series)) {
                            monthAcc._series[category.categoryId] = {
                                dataKey: category.categoryId,
                                label: category.categoryName,
                            };
                        }
                        return catAcc;
                    },
                    {},
                );
                monthAcc._dataset[monthKey].month = monthKey;
                return monthAcc;
            },
            { _dataset: {}, _series: {} },
        );

        return {
            dataset: Object.values(_dataset),
            series: Object.values(_series),
        };
    }, [pastData, showNegatives]);

    if (previewMode === 'off') {
        return null;
    }

    return (
        <Paper
            sx={{
                color: theme.palette.common.black,
                margin: '20px 0 0',
                padding: '20px',
            }}
        >
            <FormControlLabel
                control={
                    <Switch
                        checked={showNegatives}
                        onChange={(_, checked) => {
                            setShowNegatives(checked);
                        }}
                    />
                }
                label='Include income'
                sx={(theme) => ({ color: theme.palette.primary.contrastText })}
            />
            <BarChart
                dataset={dataset}
                height={600}
                loading={pastDataLoading}
                series={series}
                xAxis={[{ dataKey: 'month' }]}
            />
        </Paper>
    );
};

export default ProjectionChart;
