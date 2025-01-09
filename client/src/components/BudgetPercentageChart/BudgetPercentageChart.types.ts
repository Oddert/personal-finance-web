import { IBudgetDatum } from '../../pages/Budget/Budget.types';

export interface IProps {
    data: IBudgetDatum[]
    height?: number
    width?: number
}

export interface ISeriesDatum {
	x: string,
	y: number,
	fillColor: string
}
