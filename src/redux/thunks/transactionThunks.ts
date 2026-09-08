import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { AppDispatch, RootState } from '../constants/store';

import APIService from '../../services/APIService';
import {
    mapCategoriesToTransactions,
    orderTransactions,
} from '../../utils/transactionUtils';
import { getCategoryOrderedDataById } from '../selectors/categorySelectors';
import { getActiveLanguageCode } from '../selectors/profileSelectors';
import {
    requestTransactions,
    writeTransactions,
} from '../slices/transactionsSlice';

import { intakeError } from './errorThunks';

dayjs.extend(localizedFormat);

// TODO: annotations
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
            dispatch(intakeError(error));
        }
    };

export const refreshTransactions =
    (cardIds: string[], startDate?: number|string|Dayjs|Date, endDate?: number|string|Dayjs|Date) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const activeCardIds = cardIds.length ? cardIds.join(',') : null;
            const startDateParsed = dayjs(startDate).valueOf();
            const endDateParsed = dayjs(endDate).valueOf();
            const response = await APIService.getAllTransactionsWithinRange(
                startDateParsed,
                endDateParsed,
                activeCardIds,
            );

            const sortedByDate = (response.payload?.transactions ?? []).sort(
                (a, b) => (new Date(a.date) < new Date(b.date) ? -1 : 1),
            );
            const orderedCategories = getCategoryOrderedDataById(state);
            const language = getActiveLanguageCode(state);

            const transactions = mapCategoriesToTransactions(
                sortedByDate,
                orderedCategories,
            );
            const orderedTransactions = orderTransactions(sortedByDate);
            const timestamp = new Date().toLocaleString(language);

            dispatch(
                writeTransactions({
                    transactions,
                    orderedTransactions,
                    timestamp,
                }),
            );
        } catch (error) {
            dispatch(intakeError(error));
        }
    };
