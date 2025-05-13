import { Dayjs } from 'dayjs';

export interface IProps {
    anchorEl: Element | null;
    categoryId: string;
    clearAnchorEl: () => void;
    endDate: Dayjs;
    open: boolean;
    startDate: Dayjs;
}
