import { ITransactor } from '../../types/Scenario.types';

export interface IProps {}

export type ITransactorRowEditable = ITransactor & {
    staged: boolean;
    deleted: boolean;
};
