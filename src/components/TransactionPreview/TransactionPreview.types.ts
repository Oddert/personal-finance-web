export interface IProps {
    anchorEl: Element | null;
    categoryId: number;
    clearAnchorEl: () => void;
    endDate: string;
    open: boolean;
    startDate: string;
}
