import type { Dispatch, SetStateAction } from 'react';

import type {
    IAggregateDatapoint,
    IAggregateDatapointRecord,
} from '../../../../../../types/Transaction';
import type { ITransactorRowEditable } from '../../../../EditScenario.types';

export interface IProps {
    setTransactors: Dispatch<SetStateAction<ITransactorRowEditable[]>>;
}

export interface IAggregateDatapointExtended extends IAggregateDatapoint {
    cardName: string;
    enabled: boolean;
    period: string;
}

export interface IAggregateDatapointRecordExtended extends IAggregateDatapointRecord {
    // Inherited:
    // data: IAggregateDatapoint[];
    // totalCredit: number;
    // totalDebit: number;
    // finalBalance?: number;
    average: number;
    categoryColour: string;
    categoryId: string;
    categoryName: string;
    data: IAggregateDatapointExtended[];
    totalCumulative: number;
    standardDeviation: number;
}
