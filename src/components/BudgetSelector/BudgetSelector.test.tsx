import userEvent from '@testing-library/user-event';

import { IBudgetState, setActiveBudget } from '../../redux/slices/budgetSlice';
import { IBudget } from '../../types/Budget.types';

import {
    act,
    fireEvent,
    renderWithProviders,
    screen,
    waitFor,
} from '../../utils/testUtils';

import BudgetSelector from './BudgetSelector';

describe('components/BudgetSelector', () => {
    test('Allows the budget to be changed via the dropdown menu', async () => {
        const activeBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Esse ullamco minim consequat ut consequat qui officia quis cillum consectetur duis irure laboris.',
            shortDescription: 'Esse ullamco minim consequat',
            name: 'Test Budget 1',
        };
        const inactiveBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Aute Lorem nulla pariatur Lorem voluptate ut.Enim labore magna proident minim mollit laborum.',
            shortDescription: 'Aute Lorem nulla pariatur Lorem voluptate ut.',
            name: 'Test Budget 2',
        };
        const budgetState: IBudgetState = {
            loaded: true,
            loading: false,
            timestamp: new Date().getTime(),
            response: [activeBudget, inactiveBudget],
            activeBudget,
        };
        const { container } = renderWithProviders(<BudgetSelector />, {
            preloadedState: {
                budget: budgetState,
            },
        });
        expect(container).toBeInTheDocument();
        const displayElem = screen.getByDisplayValue(activeBudget.name);
        expect(displayElem).toBeInTheDocument();
        act(() => {
            fireEvent.click(screen.getByTitle('Open'));
        });
        await waitFor(() => {
            expect(screen.getByText(inactiveBudget.name)).toBeInTheDocument();
        });
        act(() => {
            fireEvent.click(screen.getByText(inactiveBudget.name));
        });
        await waitFor(() => {
            expect(container.querySelector('input[type=text]')).toHaveValue(
                inactiveBudget.name,
            );
        });
    });
    test('Allows the budgets to be filtered by typing', async () => {
        const activeBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Esse ullamco minim consequat ut consequat qui officia quis cillum consectetur duis irure laboris.',
            shortDescription: 'Esse ullamco minim consequat',
            name: 'Test Budget 1',
        };
        const inactiveBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Aute Lorem nulla pariatur Lorem voluptate ut.Enim labore magna proident minim mollit laborum.',
            shortDescription: 'Aute Lorem nulla pariatur Lorem voluptate ut.',
            name: 'Test Budget 2',
        };
        const budgetState: IBudgetState = {
            loaded: true,
            loading: false,
            timestamp: new Date().getTime(),
            response: [activeBudget, inactiveBudget],
            activeBudget,
        };
        const { container } = renderWithProviders(<BudgetSelector />, {
            preloadedState: {
                budget: budgetState,
            },
        });
        expect(container).toBeInTheDocument();
        const displayElem = screen.getByDisplayValue(activeBudget.name);
        expect(displayElem).toBeInTheDocument();

        const input = container.querySelector('input[type=text]');
        if (input) {
            act(() => {
                userEvent.type(input, inactiveBudget.name);
            });
        }
        await waitFor(() => {
            expect(
                screen.queryByDisplayValue(activeBudget.name),
            ).not.toBeInTheDocument();
        });
    });
    test('Reflects the value of a budget changed externally in the redux store', async () => {
        const activeBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Esse ullamco minim consequat ut consequat qui officia quis cillum consectetur duis irure laboris.',
            shortDescription: 'Esse ullamco minim consequat',
            name: 'Test Budget 1',
        };
        const inactiveBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Aute Lorem nulla pariatur Lorem voluptate ut.Enim labore magna proident minim mollit laborum.',
            shortDescription: 'Aute Lorem nulla pariatur Lorem voluptate ut.',
            name: 'Test Budget 2',
        };
        const budgetState: IBudgetState = {
            loaded: true,
            loading: false,
            timestamp: new Date().getTime(),
            response: [activeBudget, inactiveBudget],
            activeBudget,
        };
        const { container, store } = renderWithProviders(<BudgetSelector />, {
            preloadedState: {
                budget: budgetState,
            },
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByDisplayValue(activeBudget.name)).toBeInTheDocument();
        expect(container.querySelector('input[type=text]')).toHaveValue(
            activeBudget.name,
        );
        act(() => {
            store.dispatch(setActiveBudget({ budget: inactiveBudget }));
        });
        await waitFor(() => {
            expect(
                screen.getByDisplayValue(inactiveBudget.name),
            ).toBeInTheDocument();
        });
        expect(container.querySelector('input[type=text]')).toHaveValue(
            inactiveBudget.name,
        );
    });
    test('Prevents the budget value clearing when text is cleared', async () => {
        const activeBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Esse ullamco minim consequat ut consequat qui officia quis cillum consectetur duis irure laboris.',
            shortDescription: 'Esse ullamco minim consequat',
            name: 'Test Budget 1',
        };
        const inactiveBudget: IBudget = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            budgetRows: [],
            cardId: 1,
            id: 1,
            isDefault: true,
            longDescription:
                'Aute Lorem nulla pariatur Lorem voluptate ut.Enim labore magna proident minim mollit laborum.',
            shortDescription: 'Aute Lorem nulla pariatur Lorem voluptate ut.',
            name: 'Test Budget 2',
        };
        const budgetState: IBudgetState = {
            loaded: true,
            loading: false,
            timestamp: new Date().getTime(),
            response: [activeBudget, inactiveBudget],
            activeBudget,
        };
        const { container } = renderWithProviders(<BudgetSelector />, {
            preloadedState: {
                budget: budgetState,
            },
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByDisplayValue(activeBudget.name)).toBeInTheDocument();
        expect(container.querySelector('input[type=text]')).toHaveValue(
            activeBudget.name,
        );
        act(() => {
            userEvent.click(screen.getByTitle('Clear'));
        });
        await waitFor(() => {
            expect(container.querySelector('input[type=text]')).toHaveValue('');
            expect(
                container.querySelector('input[type=text]'),
            ).toHaveDisplayValue('');
        });
        act(() => {
            userEvent.tab();
        });
        await waitFor(() => {
            expect(container.querySelector('input[type=text]')).toHaveValue(
                activeBudget.name,
            );
            expect(
                container.querySelector('input[type=text]'),
            ).toHaveDisplayValue(activeBudget.name);
        });
    });
});
