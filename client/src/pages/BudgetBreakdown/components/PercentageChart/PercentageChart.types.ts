import { IBudgetDatum } from '../../../../types/Budget.types';

export interface IProps {
    data: IBudgetDatum[];
    endDate: string;
    startDate: string;
}
