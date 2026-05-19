import type { Dispatch, SetStateAction } from 'react';

import type { ITransactorRowEditable } from '../../EditScenario.types';

export interface IProps {
    setTransactors: Dispatch<SetStateAction<ITransactorRowEditable[]>>;
    transactors: ITransactorRowEditable[];
}
