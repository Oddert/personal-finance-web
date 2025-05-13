import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import userEvent from '@testing-library/user-event';

import { Category as ICategory } from '../../types/Category.d';

import { act, customRenderer, screen, waitFor } from '../../utils/testUtils';

import Category from './Category';

dayjs.extend(localizedFormat);

describe('components/Category', () => {
    test('Renders in standard layout with expected attributes', async () => {
        const category: ICategory = {
            id: '1',
            label: 'Test Category label',
            description: 'Text Category desc',
            colour: '#ecf0f1',
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
            matchers: [
                {
                    case_sensitive: false,
                    created_on: new Date().toISOString(),
                    id: '1',
                    match: 'TESCO',
                    match_type: 'any',
                    updated_on: new Date().toISOString(),
                },
            ],
        };
        const cb = jest.fn();
        const { container } = customRenderer(
            <Category
                category={category}
                onAddNewSubmit={cb}
                layout='standard'
            />,
        );
        expect(container).toBeInTheDocument();
        expect(
            screen.getByText(new RegExp(category.label, 'i')),
        ).toBeInTheDocument();
        expect(screen.getByText(category.description)).toBeInTheDocument();
        expect(
            screen.getByText(/literals\.Matchers \(1\)/),
        ).toBeInTheDocument();
        expect(
            screen.queryByText(category.matchers[0].match),
        ).not.toBeVisible();
    });
    test('Allows the matchers to be viewed and hidden via a toggle', async () => {
        // NOTE: RTL error message "Warning: An update to Transition inside a test was not wrapped in act(...)"
        const category: ICategory = {
            id: '1',
            label: 'Test Category label',
            description: 'Text Category desc',
            colour: '#ecf0f1',
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
            matchers: [
                {
                    case_sensitive: false,
                    created_on: new Date().toISOString(),
                    id: '1',
                    match: 'TESCO',
                    match_type: 'any',
                    updated_on: new Date().toISOString(),
                },
            ],
        };
        const cb = jest.fn();
        const { container } = customRenderer(
            <Category
                category={category}
                onAddNewSubmit={cb}
                layout='standard'
            />,
        );
        expect(container).toBeInTheDocument();
        const accordion = screen.getByText(/literals\.Matchers \(1\)/);
        expect(accordion).toBeInTheDocument();
        expect(
            screen.queryByText(category.matchers[0].match),
        ).not.toBeVisible();
        await act(async () => {
            userEvent.click(accordion);
        });
        await waitFor(() => {
            expect(
                screen.queryByText(new RegExp(category.matchers[0].match, 'i')),
            ).toBeVisible();
            expect(
                container.querySelector('[aria-label="Category.addMatcher"]'),
            ).toBeInTheDocument();
        });
        await act(async () => {
            userEvent.click(accordion);
        });
        await waitFor(() => {
            expect(
                screen.queryByText(category.matchers[0].match),
            ).not.toBeVisible();
            expect(
                screen.queryByText('Category.addMatcher'),
            ).not.toBeInTheDocument();
        });
    });
    test('Presents the add matcher form when the add matcher button is clicked', async () => {
        const category: ICategory = {
            id: '1',
            label: 'Test Category label',
            description: 'Text Category desc',
            colour: '#ecf0f1',
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
            matchers: [
                {
                    case_sensitive: false,
                    created_on: new Date().toISOString(),
                    id: '1',
                    match: 'TESCO',
                    match_type: 'any',
                    updated_on: new Date().toISOString(),
                },
            ],
        };
        const cb = jest.fn();
        const { container } = customRenderer(
            <Category
                category={category}
                onAddNewSubmit={cb}
                layout='standard'
            />,
        );
        expect(container).toBeInTheDocument();
        const accordion = screen.getByText(/literals\.Matchers \(1\)/);
        expect(accordion).toBeInTheDocument();
        await waitFor(() => {
            expect(
                container.querySelector('[aria-label="Category.addMatcher"]'),
            ).toBeInTheDocument();
        });
        const addMatcherButton = container.querySelector(
            '[aria-label="Category.addMatcher"]',
        );
        expect(addMatcherButton).toBeInTheDocument();
        if (addMatcherButton) {
            await act(async () => {
                userEvent.click(addMatcherButton);
            });
            screen.debug(addMatcherButton, 100000);
        }
        await waitFor(() => {
            expect(addMatcherButton).not.toBeInTheDocument();
            screen.debug(container, 100000);
            expect(
                screen.queryByTestId('components-Category-EditMatcher'),
            ).toBeInTheDocument();
        });
    });
});
