import type { Dispatch, SetStateAction } from 'react';

import type { ITransactorRowEditable } from '../../../../../../EditScenario.types';
import type { IAggregateDatapointRecordExtended } from '../../MonthAverages.types';

export interface IProps {
    dataPoint: IAggregateDatapointRecordExtended;
    onDataPointEnabledChange: (index: number, enabled: boolean) => void;
    setTransactors: Dispatch<SetStateAction<ITransactorRowEditable[]>>;
}
