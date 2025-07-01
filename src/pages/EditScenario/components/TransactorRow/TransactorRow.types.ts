import { ITransactorRowEditable } from '../../EditScenario.types';

export interface IProps {
    setTransactors: (transactors: ITransactorRowEditable[]) => void;
    transactor: ITransactorRowEditable;
    transactors: ITransactorRowEditable[];
}
