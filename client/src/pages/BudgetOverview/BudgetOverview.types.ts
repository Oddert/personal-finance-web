import { Dayjs } from 'dayjs'

import type { IBudgetDatum } from '../../types/Budget.types'

export interface IProps {}

export interface IBudgetOverviewChart {
    timestamp: Dayjs
    data: IBudgetDatum[]
}
