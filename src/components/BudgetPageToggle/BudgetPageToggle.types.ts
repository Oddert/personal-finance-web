import { Dayjs } from 'dayjs';

export interface IProps {
    endDate: Dayjs;
    mode: 'breakdown' | 'overview';
    startDate: Dayjs;
}
