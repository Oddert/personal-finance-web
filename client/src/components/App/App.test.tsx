import React from 'react';
// import {describe, expect, test} from '@jest/globals';

import { render } from '../../utils/testUtils';

import App from './App';

describe('root', () => {
    test('renders learn react link', () => {
        const { container } = render(<App />)
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        // const linkElement = container.getElementsByClassName('.App')
        // expect(linkElement).toBeInTheDocument()
        expect(container).toBeInTheDocument()
    });
})
