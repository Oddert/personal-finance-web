import type { IAggregateDatapointExtended } from '../../MonthAverages.types';

export interface IProps {
    datum: IAggregateDatapointExtended;
    idx: number;
    onDataPointEnabledChange: (index: number, enabled: boolean) => void;
    onClickAddRow: (row: IAggregateDatapointExtended) => void;
}
