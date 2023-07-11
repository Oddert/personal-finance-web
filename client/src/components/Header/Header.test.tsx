import React from 'react'

import { render, screen } from '@testing-library/react'

import Header from './Header'

test('[Header] Renders to screen', () => {
    render(<Header />)
    const header = screen.getByRole('header')
    expect(header).toBeInTheDocument()
})
