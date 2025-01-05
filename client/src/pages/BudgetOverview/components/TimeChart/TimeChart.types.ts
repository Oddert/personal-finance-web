import { IBudgetOverviewChart } from '../../BudgetOverview.types'

export interface IProps {
    chartList: IBudgetOverviewChart[]
    endDate: string
    startDate: string
}
