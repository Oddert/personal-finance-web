import { customRenderer } from '../../utils/testUtils';

import BudgetSelector from './BudgetSelector';

describe('components/BudgetSelector', () => {
    test('Renders the selector to the screen with an input', () => {
        const { container } = customRenderer(<BudgetSelector />);
        expect(container).toBeInTheDocument();
        expect(container.querySelector('input')).toBeInTheDocument();
    });
});
