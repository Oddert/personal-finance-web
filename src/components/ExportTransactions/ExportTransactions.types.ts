import type { ICard } from '../../types/Card.types';
import type { Dayjs } from 'dayjs';

export interface IProps {
    defaultCards?: ICard[];
    defaultEndDate?: Dayjs | Date | number;
    defaultStartDate?: Dayjs | Date | number;
    defaultUseAllCards?: boolean;
}
