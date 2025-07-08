import { Dayjs } from 'dayjs';

export interface IProps {
    defaultStartDate?: Dayjs | Date | number;
    defaultEndDate?: Dayjs | Date | number;
}
