import { IBudgetDatum } from '../../pages/BudgetBreakdown/BudgetBreakdown.types';

export interface IProps {
    data: IBudgetDatum[]
	dataPointCallback?: (anchorEl: Element, categoryId: number) => void
    height?: number
	useFloat?: boolean
    width?: number
}

export interface ISeriesDatum {
	x: string,
	y: number,
	fillColor: string
}
