import { type FC, useState } from 'react';

import { Box, List } from '@mui/material';

import type {
    IAggregateDatapointRecordExtended,
    IProps,
} from './MonthAverages.types';
import type { Dayjs } from 'dayjs';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../../../redux/selectors/cardSelectors';
import { getCategoryOrderedDataById } from '../../../../../../redux/selectors/categorySelectors';
import { intakeError } from '../../../../../../redux/thunks/errorThunks';
import APIService from '../../../../../../services/APIService';
import MonthRangeRequest from '../MonthRangeRequest/MonthRangeRequest';

import {
    calculateAggDataTotals,
    convertAggDataResponse,
} from './MonthAverages.utils';
import AverageDataCard from './components/AverageDataCard';

const MonthAverages: FC<IProps> = ({ setTransactors }) => {
    const [aggData, setAggData] = useState<IAggregateDatapointRecordExtended[]>(
        [],
    );
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();

    const categories = useAppSelector(getCategoryOrderedDataById);
    const cards = useAppSelector(getCardResponse);

    const handleDataPointEnabledChange = (
        categoryId: string,
        index: number,
        enabled: boolean,
    ) => {
        setAggData((currentData) =>
            calculateAggDataTotals(
                currentData.map((dataPoint) =>
                    dataPoint.categoryId === categoryId
                        ? {
                              ...dataPoint,
                              data: dataPoint.data.map((datum, datumIndex) =>
                                  datumIndex === index
                                      ? { ...datum, enabled }
                                      : datum,
                              ),
                          }
                        : dataPoint,
                ),
            ),
        );
    };

    const handleClickLoad = (
        startDate: Dayjs,
        endDate: Dayjs,
        cardIds: string | null,
    ) => {
        const request = async () => {
            try {
                setLoading(true);
                const response = await APIService.getAllTransactionsAggregated(
                    cardIds,
                    {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        pivotOnCategory: true,
                    },
                );
                if (response.payload?.cards) {
                    setAggData(
                        calculateAggDataTotals(
                            convertAggDataResponse(
                                response.payload.cards,
                                categories,
                                cards,
                            ),
                        ),
                    );
                }
                setLoading(false);
            } catch (error) {
                dispatch(intakeError(error));
                setLoading(false);
            }
        };
        request();
    };

    return (
        <Box>
            <MonthRangeRequest
                loading={loading}
                onClickLoad={handleClickLoad}
            />
            <List
                sx={{
                    display: 'grid',
                    gridGap: '16px',
                    gridTemplateColumns:
                        'repeat(auto-fill, minmax(250px, 1fr))',
                }}
            >
                {aggData.map((dataPoint, idx) => (
                    <AverageDataCard
                        dataPoint={dataPoint}
                        key={idx}
                        onDataPointEnabledChange={(index, enabled) => {
                            handleDataPointEnabledChange(
                                dataPoint.categoryId,
                                index,
                                enabled,
                            );
                        }}
                        setTransactors={setTransactors}
                    />
                ))}
            </List>
        </Box>
    );
};

export default MonthAverages;
