import userEvent from '@testing-library/user-event';

import { act, render, screen } from '../../utils/testUtils';

import EditableText from './EditableText';

describe('components/EditableText', () => {
    test('renders text with an edit button when text is provided', () => {
        render(
            <EditableText
                headingProps={{ variant: 'body1' }}
                iconPosition='end'
                onChange={jest.fn()}
                text='Current text'
            />,
        );

        expect(screen.getByText('Current text')).toBeInTheDocument();
        expect(screen.getByTitle('buttons.clickToEdit')).toBeInTheDocument();
    });

    test('renders placeholder when text is empty and no text value exists', () => {
        render(
            <EditableText
                headingProps={{ variant: 'body1' }}
                iconPosition='end'
                onChange={jest.fn()}
                placeholder='Enter label'
                text=''
            />,
        );

        expect(screen.getByText('Enter label')).toBeInTheDocument();
    });

    test('opens the input field when the edit button is clicked', async () => {
        render(
            <EditableText
                headingProps={{ variant: 'body1' }}
                iconPosition='end'
                onChange={jest.fn()}
                text='Editable content'
            />,
        );

        const button = screen.getByTitle('buttons.clickToEdit');
        await act(async () => {
            userEvent.click(button);
        });

        const textbox = screen.getByRole('textbox');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveValue('Editable content');
    });

    test('calls onChange with the updated value when editing is committed on blur', async () => {
        const onChangeMock = jest.fn();

        const { container } = render(
            <EditableText
                headingProps={{ variant: 'body1' }}
                iconPosition='end'
                onChange={onChangeMock}
                text='Initial value'
            />,
        );

        const button = screen.getByTitle('buttons.clickToEdit');

        await act(async () => {
            userEvent.click(button);
        });

        const textbox = screen.getByRole('textbox');
        expect(textbox).toHaveValue('Initial value');

        await act(async () => {
            userEvent.clear(textbox);
            userEvent.type(textbox, 'Updated value');
            textbox.blur();
        });

        expect(onChangeMock).toHaveBeenCalledWith('Updated value');
        expect(
            container.querySelector('input[type=text]'),
        ).not.toBeInTheDocument();
        expect(screen.getByText('Updated value')).toBeInTheDocument();
    });

    test('updates displayed text when the text prop changes externally', () => {
        const { rerender } = render(
            <EditableText
                headingProps={{ variant: 'body1' }}
                iconPosition='end'
                onChange={jest.fn()}
                text='Original text'
            />,
        );

        expect(screen.getByText('Original text')).toBeInTheDocument();

        rerender(
            <EditableText
                headingProps={{ variant: 'body1' }}
                iconPosition='end'
                onChange={jest.fn()}
                text='Updated external text'
            />,
        );

        expect(screen.getByText('Updated external text')).toBeInTheDocument();
    });
});
