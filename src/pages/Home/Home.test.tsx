import React from 'react';

import { render, screen } from '@testing-library/react';

import Home from './Home';

test('[Home] Renders to screen', () => {
    render(<Home />);
    const header = screen.getByRole('header');
    expect(header).toBeInTheDocument();
});
