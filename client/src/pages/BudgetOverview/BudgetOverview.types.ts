import { Dayjs } from 'dayjs'

import { IBudgetDatum } from '../Budget/Budget.types'

export interface IProps {}

export interface IBudgetOverviewChart {
    timestamp: Dayjs
    data: IBudgetDatum[]
}
