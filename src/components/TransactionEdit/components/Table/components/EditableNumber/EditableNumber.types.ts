import type {
    ITECTransaction,
    TAccessorKeyNumbers,
} from '../../../../../../contexts/transactionEditContext';

export interface IProps {
    colMapKey: TAccessorKeyNumbers;
    transaction: ITECTransaction;
}
