import { Dayjs } from 'dayjs'

import { IBudgetDatum } from '../BudgetBreakdown/BudgetBreakdown.types'

export interface IProps {}

export interface IBudgetOverviewChart {
    timestamp: Dayjs
    data: IBudgetDatum[]
}
