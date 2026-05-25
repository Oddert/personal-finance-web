import { customRenderer, screen } from '../../utils/testUtils';

import ActiveBudget from './ActiveBudget';

describe('components/ActiveBudget', () => {
    test('Renders the selector to the screen with an input', () => {
        const { container } = customRenderer(<ActiveBudget />);
        // // TODO: investigate testing-library/no-container, testing-library/no-node-access
        // // const linkElement = container.getElementsByClassName('.App')
        // // expect(linkElement).toBeInTheDocument()
        expect(container).toBeInTheDocument();
        expect(
            screen.getByTestId('components-ActiveBudget__title').textContent,
        ).toEqual('literals.Budget:');
        expect(container.querySelector('input')).toBeInTheDocument();
    });
});
