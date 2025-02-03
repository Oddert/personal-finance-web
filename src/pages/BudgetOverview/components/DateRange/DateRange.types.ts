import { Dayjs } from 'dayjs';

export interface IProps {
    endDate: Dayjs;
    setEndDate: (value: Dayjs) => void;
    setStartDate: (value: Dayjs) => void;
    startDate: Dayjs;
}
