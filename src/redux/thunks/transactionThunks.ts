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
            const state = getState();
            const stateStartDate = dayjs(state.transaction.startDate);
            const stateEndDate = dayjs(state.transaction.endDate);

            const loaded = state.transaction.loaded;
            const timestamp = state.transaction.refreshed;

            if (!(startDate && endDate)) {
                if (
                    override ||
                    !loaded ||
                    (timestamp && new Date(timestamp).getTime() <= 300_000)
                ) {
                    dispatch(requestTransactions({}));
                }
            } else {
                const inboundStartDate = dayjs(startDate);
                const inboundEndDate = dayjs(endDate);

                if (
                    override ||
                    inboundStartDate < stateStartDate ||
                    inboundEndDate > stateEndDate
                ) {
                    dispatch(
                        requestTransactions({
                            startDate: inboundStartDate.toISOString(),
                            endDate: inboundEndDate.toISOString(),
                        }),
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
