export interface IScenario {
    id: string;
    cardId: string;
    userId: string;
    startDate: string;
    endDate: string;
    createdOn: string;
    updatedOn: string;
    title: string;
    description: string;
    startBallance: number;
    transactors: ITransactor[];
}

export interface ITransactor {
    id: string;
    categoryId: string | null;
    createdOn: string;
    description: string;
    isAddition: boolean;
    scenarioId: string;
    schedulers: IScheduler[];
    updatedOn: string;
    value: number;
}

export interface IScheduler {
    id: string;
    createdOn: string;
    updatedOn: string;
    schedulerCode: TSchedulerCode;
    step: number | null;
    startDate: string | null;
    day: number;
    nthDay: number | null;
    transactorId: string;
}

export type TSchedulerCode = 'DAY' | 'SCALAR' | 'DAY_OF_WEEK' | 'EVENT';
