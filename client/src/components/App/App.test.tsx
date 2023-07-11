import React from 'react';

import { render } from '@testing-library/react';

import App from './App';

test('renders learn react link', () => {
    const { container } = render(<App />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const linkElement = container.getElementsByClassName('App')
    expect(linkElement).toBeInTheDocument();
});
