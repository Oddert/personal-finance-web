import userEvent from '@testing-library/user-event';

import { ICardState, setActiveCard } from '../../redux/slices/cardSlice';

import { ICard } from '../../types/Card.types';

import {
    act,
    fireEvent,
    renderWithProviders,
    screen,
    waitFor,
} from '../../utils/testUtils';

import CardSelector from './CardSelector';

describe('components/CardSelector', () => {
    test('Allows the card to be changed via the dropdown menu', async () => {
        const activeCard: ICard = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            id: 1,
            isDefault: true,
            bankName: 'Bank of test ID 1',
            cardName: 'Card of default',
            cardNumber: 246813579,
            cardType: 'DEBIT',
            coverImage: '',
            description: 'Commodo ullamco esse sunt ad.',
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            icon: '',
            sortCode: 123456,
        };
        const inactiveCard: ICard = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            id: 2,
            isDefault: true,
            bankName: 'Bank of test ID 2',
            cardName: 'Card of second choice',
            cardNumber: 135792468,
            cardType: 'CREDIT',
            coverImage: '',
            description: 'Id officia magna irure ex eiusmod.',
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            icon: '',
            sortCode: 123456,
        };
        const cardState: ICardState = {
            loaded: true,
            loading: false,
            timestamp: new Date().getTime(),
            activeCard: activeCard,
            response: [activeCard, inactiveCard],
        };
        const { container } = renderWithProviders(<CardSelector />, {
            preloadedState: {
                card: cardState,
            },
        });
        expect(container).toBeInTheDocument();
        const displayElem = screen.getByDisplayValue(activeCard.cardName);
        expect(displayElem).toBeInTheDocument();
        act(() => {
            fireEvent.click(screen.getByTitle('Open'));
        });
        await waitFor(() => {
            expect(screen.getByText(inactiveCard.cardName)).toBeInTheDocument();
        });
        act(() => {
            fireEvent.click(screen.getByText(inactiveCard.cardName));
        });
        await waitFor(() => {
            expect(container.querySelector('input[type=text]')).toHaveValue(
                inactiveCard.cardName,
            );
        });
    });
    test('Allows the cards to be filtered by typing', async () => {
        const activeCard: ICard = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            id: 1,
            isDefault: true,
            bankName: 'Bank of test ID 1',
            cardName: 'Card of default',
            cardNumber: 246813579,
            cardType: 'DEBIT',
            coverImage: '',
            description: 'Commodo ullamco esse sunt ad.',
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            icon: '',
            sortCode: 123456,
        };
        const inactiveCard: ICard = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            id: 2,
            isDefault: true,
            bankName: 'Bank of test ID 2',
            cardName: 'Card of second choice',
            cardNumber: 135792468,
            cardType: 'CREDIT',
            coverImage: '',
            description: 'Id officia magna irure ex eiusmod.',
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            icon: '',
            sortCode: 123456,
        };
        const cardState: ICardState = {
            loaded: true,
            loading: false,
            timestamp: new Date().getTime(),
            activeCard: activeCard,
            response: [activeCard, inactiveCard],
        };
        const { container } = renderWithProviders(<CardSelector />, {
            preloadedState: {
                card: cardState,
            },
        });
        expect(container).toBeInTheDocument();
        const displayElem = screen.getByDisplayValue(activeCard.cardName);
        expect(displayElem).toBeInTheDocument();

        const input = container.querySelector('input[type=text]');
        if (input) {
            act(() => {
                userEvent.type(input, inactiveCard.cardName);
                fireEvent.keyPress(input, { key: 'ArrowDown', charCode: 40 });
                fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
            });
        }
        await waitFor(() => {
            expect(
                screen.queryByDisplayValue(activeCard.cardName),
            ).not.toBeInTheDocument();
        });
    });
    test('Reflects the value of a card changed externally in the redux store', async () => {
        const activeCard: ICard = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            id: 1,
            isDefault: true,
            bankName: 'Bank of test ID 1',
            cardName: 'Card of default',
            cardNumber: 246813579,
            cardType: 'DEBIT',
            coverImage: '',
            description: 'Commodo ullamco esse sunt ad.',
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            icon: '',
            sortCode: 123456,
        };
        const inactiveCard: ICard = {
            updatedOn: new Date().toISOString(),
            createdOn: new Date().toISOString(),
            id: 2,
            isDefault: true,
            bankName: 'Bank of test ID 2',
            cardName: 'Card of second choice',
            cardNumber: 135792468,
            cardType: 'CREDIT',
            coverImage: '',
            description: 'Id officia magna irure ex eiusmod.',
            expires: new Date().setFullYear(new Date().getFullYear() + 1),
            icon: '',
            sortCode: 123456,
        };
        const cardState: ICardState = {
            loaded: true,
            loading: false,
            timestamp: new Date().getTime(),
            activeCard: activeCard,
            response: [activeCard, inactiveCard],
        };
        const { container, store } = renderWithProviders(<CardSelector />, {
            preloadedState: {
                card: cardState,
            },
        });
        expect(container).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(activeCard.cardName),
        ).toBeInTheDocument();
        expect(container.querySelector('input[type=text]')).toHaveValue(
            activeCard.cardName,
        );
        act(() => {
            store.dispatch(setActiveCard({ card: inactiveCard }));
        });
        await waitFor(() => {
            expect(
                screen.getByDisplayValue(inactiveCard.cardName),
            ).toBeInTheDocument();
        });
        expect(container.querySelector('input[type=text]')).toHaveValue(
            inactiveCard.cardName,
        );
    });
});
