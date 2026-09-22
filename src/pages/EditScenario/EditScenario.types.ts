import type { IScenario, ITransactor } from '../../types/Scenario.types';

export interface IProps {}

export interface IProjectionChartProps {
    scenario: IScenario;
    transactors: ITransactorRowEditable[];
}

export type ITransactorRowEditable = ITransactor & {
    staged: boolean;
    deleted: boolean;
};

export type TPreviewMode = 'off' | 'total' | 'category';
export type TChartCardMode = 'combined' | 'separate';
