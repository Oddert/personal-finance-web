import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { AppDispatch, RootState } from '../constants/store';

import { requestTransactions } from '../slices/transactionsSlice';

import { intakeError } from './errorThunks';

dayjs.extend(localizedFormat);

export const conditionallyRefreshTransactions =
    (startDate?: number, endDate?: number, override?: boolean) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            // console.log(
            //     '[conditionallyRefreshTransactions] init startDate, endDate: ',
            //     startDate,
            //     endDate,
            // );
            const state = getState();
            const stateStartDate = dayjs(state.transaction.startDate);
            const stateEndDate = dayjs(state.transaction.endDate);

            const loaded = state.transaction.loaded;
            const timestamp = state.transaction.refreshed;

            if (!(startDate && endDate)) {
                // console.log(
                //     '[conditionallyRefreshTransactions] no dated provided, checking refresh...',
                // );
                // console.log(
                //     !loaded,
                //     timestamp && new Date(timestamp).getTime() <= 300_000,
                // );
                if (
                    override ||
                    !loaded ||
                    (timestamp && new Date(timestamp).getTime() <= 300_000)
                ) {
                    // console.log(
                    //     '[conditionallyRefreshTransactions] ...refreshing',
                    // );
                    dispatch(requestTransactions({}));
                }
                // } else {
                //     console.log(
                //         '[conditionallyRefreshTransactions] ...no refresh required, finishing.',
                //     );
                // }
            } else {
                // console.log(
                //     '[conditionallyRefreshTransactions] dates supplied...',
                // );
                const inboundStartDate = dayjs(startDate);
                const inboundEndDate = dayjs(endDate);
                // console.log({
                //     inboundStartDate,
                //     stateStartDate,
                //     inboundEndDate,
                //     stateEndDate,
                // });
                // console.log(
                //     inboundStartDate < stateStartDate,
                //     inboundEndDate > stateEndDate,
                // );
                if (
                    override ||
                    inboundStartDate < stateStartDate ||
                    inboundEndDate > stateEndDate
                ) {
                    // console.log(
                    //     '[conditionallyRefreshTransactions] ...dates are OOB, refreshing.',
                    // );
                    dispatch(
                        requestTransactions({
                            startDate: inboundStartDate.toISOString(),
                            endDate: inboundEndDate.toISOString(),
                        }),
                    );
                }
                // } else {
                //     console.log(
                //         '[conditionallyRefreshTransactions] ...dates are within bounds, finishing.',
                //     );
                // }
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
