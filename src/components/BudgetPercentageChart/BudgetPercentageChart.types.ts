import { IBudgetDatum } from '../../types/Budget.types';

export interface IProps {
    data: IBudgetDatum[];
    dataPointCallback?: (categoryId: number) => void;
    height?: number;
    useFloat?: boolean;
    width?: number;
}

export interface ISeriesDatum {
    x: string;
    y: number;
    fillColor: string;
}
