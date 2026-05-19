import { Dispatch, SetStateAction } from 'react';
import { ITransactorRowEditable } from '../../EditScenario.types';

export interface IProps {
    setTransactors: Dispatch<SetStateAction<ITransactorRowEditable[]>>;
    transactors: ITransactorRowEditable[];
}
