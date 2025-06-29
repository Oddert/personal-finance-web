export interface IScenario {
    id: string;
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
    createdOn: string;
    updatedOn: string;
    description: string;
    isAddition: boolean;
    value: number;
    scenarioId: string;
    schedulers: IScheduler[];
}

export interface IScheduler {
    id: string;
    createdOn: string;
    updatedOn: string;
    schedulerCode: string;
    step: number | null;
    startDate: string | null;
    day: number;
    nthDay: number | null;
    transactorId: string;
}
