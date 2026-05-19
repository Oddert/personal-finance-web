import { v4 as uuid } from 'uuid';

import type { ITransactorRowEditable } from '../pages/EditScenario/EditScenario.types';

export const ffBlankTransactorRowEditable = (
    partial?: Partial<ITransactorRowEditable>,
): ITransactorRowEditable => ({
    createdOn: '',
    categoryId: null,
    description: '',
    id: uuid(),
    isAddition: true,
    scenarioId: '',
    schedulers: [],
    updatedOn: '',
    value: 0,
    staged: true,
    deleted: false,
    ...partial,
});
