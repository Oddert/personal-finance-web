import { IScheduler } from '../../../../types/Scenario.types';

export interface IProps {
    handleChangeScheduler: (scheduler: IScheduler) => void;
    handleClickDeleteScheduler: () => void;
    scheduler: IScheduler;
}
