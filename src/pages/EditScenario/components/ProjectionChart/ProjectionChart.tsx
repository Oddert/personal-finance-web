import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart } from '@mui/x-charts';

import { TAggregateDatapoints } from '../../../../types/Transaction.d';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import { getActiveCardId } from '../../../../redux/selectors/cardSelectors';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import APIService from '../../../../services/APIService';

import { IProps } from './ProjectionChart.types';
import { CircularProgress, Paper, useTheme } from '@mui/material';
import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';

const ProjectionChart: FC<IProps> = () => {
    const [pastData, setPastData] = useState<TAggregateDatapoints>({});
    const [pastDataLoading, setPastDataLoading] = useState(false);

    const cardId = useAppSelector(getActiveCardId);

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const categoryLookup = useAppSelector(getCategoryOrderedDataById);
    const theme = useTheme();

    useEffect(() => {
        if (!cardId?.length) {
            return;
        }

        setPastDataLoading(true);

        const fetchPastData = async () => {
            try {
                const pastDataResponse =
                    await APIService.getAllTransactionsAggregated(cardId, true);
                if (!pastDataResponse || !pastDataResponse.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setPastData(pastDataResponse.payload.transactions);
            } catch (error: any) {
                dispatch(intakeError(error));
            } finally {
                setPastDataLoading(false);
            }
        };

        void fetchPastData();
    }, [dispatch, t, cardId]);

    const monthKeys = useMemo(() => {
        const months = new Set<string>();
        Object.values(pastData).forEach((monthData) => {
            monthData.forEach((month) => {
                months.add(new Date(month.month).toISOString());
            });
        });
        return Array.from(months).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        );
    }, [pastData]);

    const data = useMemo(
        () =>
            Object.entries(pastData).map(([categoryId, monthData]) => {
                const monthMap = new Map(
                    monthData.map((month) => [
                        new Date(month.month).toISOString(),
                        month,
                    ]),
                );

                return {
                    series:
                        categoryId in categoryLookup
                            ? categoryLookup[categoryId].label
                            : categoryId,
                    data: monthKeys.map((monthKey) => {
                        const month = monthMap.get(monthKey);
                        return {
                            x: monthKey,
                            y: month ? month.totalDebit - month.totalCredit : 0,
                        };
                    }),
                };
            }),
        [categoryLookup, monthKeys, pastData],
    );

    if (pastDataLoading) {
        return <CircularProgress />;
    }

    return (
        <Paper
            sx={{
                color: theme.palette.common.black,
                margin: '20px 0 0',
                padding: '20px',
            }}
        >
            <BarChart dataset={data} height={600} series={[]} />
        </Paper>
    );
};

export default ProjectionChart;
