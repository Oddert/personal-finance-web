import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { ROUTES } from '../../constants/routerConstants';

import { DATE_FORMAT } from '../../utils/budgetUtils';
import { customRenderer } from '../../utils/testUtils';

import BudgetPageToggle from './BudgetPageToggle';

dayjs.extend(localizedFormat);

describe('components/BudgetPageToggle', () => {
    test('Shows a link for Overview when in Breakdown', async () => {
        const startDate = dayjs();
        const endDate = dayjs();
        const { container } = customRenderer(
            <BudgetPageToggle
                endDate={startDate}
                mode='breakdown'
                startDate={endDate}
            />,
        );
        expect(container).toBeInTheDocument();
        const button = container.querySelector('a');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('buttons.viewBudgetOverview');
        expect(button).toHaveAttribute(
            'href',
            `${
                ROUTES.BUDGET_OVERVIEW
            }?startDate=${startDate.format(DATE_FORMAT)}&endDate=${endDate.format(DATE_FORMAT)}`,
        );
    });
    test('Shows a link for Breakdown when in Overview', async () => {
        const startDate = dayjs();
        const endDate = dayjs();
        const { container } = customRenderer(
            <BudgetPageToggle
                endDate={endDate}
                mode='overview'
                startDate={startDate}
            />,
        );
        expect(container).toBeInTheDocument();
        const button = container.querySelector('a');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('buttons.viewBudgetBreakdown');
        expect(button).toHaveAttribute(
            'href',
            `${
                ROUTES.BUDGET_BREAKDOWN
            }?startDate=${startDate.format(DATE_FORMAT)}&endDate=${endDate.format(DATE_FORMAT)}`,
        );
    });
});
