import { ITECTransaction } from '../../../../../../contexts/transactionEditContext';

export interface IProps {
    columns: { accessorKey: string; header: string }[];
    idx: number;
    transaction: ITECTransaction;
}
