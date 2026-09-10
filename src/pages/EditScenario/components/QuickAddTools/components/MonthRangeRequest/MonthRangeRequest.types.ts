import type { Dayjs } from 'dayjs';

export interface IProps {
    loading?: boolean;
    onClickLoad: (startDate: Dayjs, endDate: Dayjs) => void;
}
