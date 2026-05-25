import { customRenderer, screen } from '../../utils/testUtils';

import ActiveCard from './ActiveCard';

describe('components/ActiveCard', () => {
    test('Renders the selector to the screen with an input', () => {
        const { container } = customRenderer(<ActiveCard />);
        expect(container).toBeInTheDocument();
        expect(
            screen.getByTestId('components-ActiveCard__title').textContent,
        ).toEqual('literals.Card:');
        expect(container.querySelector('input')).toBeInTheDocument();
    });
});
