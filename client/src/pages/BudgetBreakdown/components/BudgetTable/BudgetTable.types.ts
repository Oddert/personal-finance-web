import { IBudgetDatum } from '../../../../types/Budget.types';

export interface IProps {
    data: IBudgetDatum[];
}

export type IBudgetDatumTable = IBudgetDatum & {
    under: boolean;
    over: boolean;
};
