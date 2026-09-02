import { v4 as uuid } from 'uuid';

import type { ITransactorRowEditable } from '../pages/EditScenario/EditScenario.types';
import type { IMatcher } from '../types/Matcher';

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

export const ffBlankMatcher = (matcher?: Partial<IMatcher>): IMatcher => ({
    id: '',
    match: '',
    matchType: 'exact',
    caseSensitive: false,
    createdOn: '',
    updatedOn: '',
    userId: '',
    ...matcher,
});
