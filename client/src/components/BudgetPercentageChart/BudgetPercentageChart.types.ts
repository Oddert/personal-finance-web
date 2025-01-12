import { IBudgetDatum } from '../../pages/BudgetBreakdown/BudgetBreakdown.types';

export interface IProps {
    data: IBudgetDatum[]
    height?: number
	useFloat?: boolean
    width?: number
}

export interface ISeriesDatum {
	x: string,
	y: number,
	fillColor: string
}
